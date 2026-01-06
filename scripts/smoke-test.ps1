param(
  [string]$StrapiUrl = $(if ($env:STRAPI_URL) { $env:STRAPI_URL } else { "http://localhost:1337" }),
  [string]$NewsletterEmail = $(if ($env:SMOKE_EMAIL) { $env:SMOKE_EMAIL } else { "" }),
  [string]$Phone = $(if ($env:SMOKE_PHONE) { $env:SMOKE_PHONE } else { "" }),
  [switch]$SendOtp,
  [string]$Otp = $(if ($env:SMOKE_OTP) { $env:SMOKE_OTP } else { "" }),
  [string]$OrderCode = $(if ($env:SMOKE_ORDER_CODE) { $env:SMOKE_ORDER_CODE } else { "" }),
  [switch]$TestRateLimit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Normalize-BaseUrl([string]$Url) {
  if (-not $Url) { return "" }
  $u = $Url.Trim()
  if ($u.EndsWith("/")) { $u = $u.Substring(0, $u.Length - 1) }
  return $u
}

function New-RandomEmail([string]$Prefix) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $rand = Get-Random -Minimum 1000 -Maximum 9999
  return "${Prefix}+${stamp}-${rand}@example.com"
}

function Read-ResponseBody([System.Net.WebResponse]$Resp) {
  if (-not $Resp) { return $null }
  try {
    $stream = $Resp.GetResponseStream()
    if (-not $stream) { return $null }
    $reader = New-Object System.IO.StreamReader($stream)
    return $reader.ReadToEnd()
  } catch {
    return $null
  }
}

function Try-ParseJson([string]$Text) {
  if (-not $Text) { return $null }
  try {
    return $Text | ConvertFrom-Json
  } catch {
    return $Text
  }
}

function Invoke-JsonPost([string]$Url, [hashtable]$Body, [hashtable]$Headers = @{}) {
  $json = $Body | ConvertTo-Json -Depth 10

  try {
    $resp = Invoke-WebRequest -Uri $Url -Method Post -ContentType "application/json" -Headers $Headers -Body $json -UseBasicParsing
    return [pscustomobject]@{
      Status  = [int]$resp.StatusCode
      Headers = $resp.Headers
      Raw     = $resp.Content
      Body    = (Try-ParseJson $resp.Content)
    }
  } catch {
    $webResp = $_.Exception.Response
    if (-not $webResp) { throw }

    $raw = Read-ResponseBody $webResp
    return [pscustomobject]@{
      Status  = [int]$webResp.StatusCode
      Headers = $webResp.Headers
      Raw     = $raw
      Body    = (Try-ParseJson $raw)
    }
  }
}

function Invoke-JsonGet([string]$Url, [hashtable]$Headers = @{}) {
  try {
    $resp = Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers -UseBasicParsing
    return [pscustomobject]@{
      Status  = [int]$resp.StatusCode
      Headers = $resp.Headers
      Raw     = $resp.Content
      Body    = (Try-ParseJson $resp.Content)
    }
  } catch {
    $webResp = $_.Exception.Response
    if (-not $webResp) { throw }

    $raw = Read-ResponseBody $webResp
    return [pscustomobject]@{
      Status  = [int]$webResp.StatusCode
      Headers = $webResp.Headers
      Raw     = $raw
      Body    = (Try-ParseJson $raw)
    }
  }
}

function Get-RetryAfterSec($Headers) {
  try {
    if ($Headers -and $Headers["Retry-After"]) {
      return [int]$Headers["Retry-After"]
    }
  } catch { }
  return $null
}

function Write-Result([string]$Name, $Resp, [int[]]$OkStatuses = @(200)) {
  $status = [int]$Resp.Status
  if ($OkStatuses -contains $status) {
    Write-Host ("[PASS] {0} ({1})" -f $Name, $status) -ForegroundColor Green
    return $true
  }

  if ($status -eq 429) {
    $retry = Get-RetryAfterSec $Resp.Headers
    $retryText = if ($retry) { " retryAfter=${retry}s" } else { "" }
    Write-Host ("[WARN] {0} (429){1}" -f $Name, $retryText) -ForegroundColor Yellow
    return $false
  }

  Write-Host ("[FAIL] {0} ({1})" -f $Name, $status) -ForegroundColor Red
  if ($Resp.Raw) {
    Write-Host ("       {0}" -f ($Resp.Raw -replace "\r?\n", " ")) -ForegroundColor DarkGray
  }
  return $false
}

$StrapiUrl = Normalize-BaseUrl $StrapiUrl
if (-not $StrapiUrl) {
  throw "StrapiUrl is required"
}

if (-not $NewsletterEmail) {
  $NewsletterEmail = New-RandomEmail "newsletter"
}

Write-Host "=== Smoke test (Strapi) ===" -ForegroundColor Cyan
Write-Host ("Base URL: {0}" -f $StrapiUrl)
Write-Host ("NewsletterEmail: {0}" -f $NewsletterEmail)
if ($Phone) { Write-Host ("Phone: {0}" -f $Phone) }
if ($OrderCode) { Write-Host ("OrderCode: {0}" -f $OrderCode) }
Write-Host ""

# 1) Newsletter subscribe
$newsletterUrl = "${StrapiUrl}/api/newsletter/subscribe"
$respNewsletter = Invoke-JsonPost -Url $newsletterUrl -Body @{ email = $NewsletterEmail; source = "smoke-test"; website = "" }
Write-Result -Name "Newsletter subscribe" -Resp $respNewsletter | Out-Null

if ($TestRateLimit) {
  Start-Sleep -Milliseconds 200
  $respNewsletter2 = Invoke-JsonPost -Url $newsletterUrl -Body @{ email = $NewsletterEmail; source = "smoke-test"; website = "" }
  Write-Result -Name "Newsletter rate-limit (rapid second request)" -Resp $respNewsletter2 -OkStatuses @(200, 429) | Out-Null
}

# 2) OTP send (optional)
$mockOtp = ""
if ($SendOtp) {
  if (-not $Phone) {
    throw "-Phone is required when using -SendOtp"
  }

  $otpSendUrl = "${StrapiUrl}/api/auth/otp/send"
  $respOtpSend = Invoke-JsonPost -Url $otpSendUrl -Body @{ phone = $Phone }
  Write-Result -Name "OTP send" -Resp $respOtpSend -OkStatuses @(200, 429) | Out-Null

  if ($respOtpSend.Status -eq 200 -and $respOtpSend.Body -and $respOtpSend.Body.mockOtp) {
    $mockOtp = [string]$respOtpSend.Body.mockOtp
    Write-Host ("       mockOtp detected (non-prod): {0}" -f $mockOtp) -ForegroundColor DarkGray
  }
}

# 3) OTP verify + my-orders (optional)
$token = ""
$otpToUse = ""
if ($Otp) { $otpToUse = $Otp }
elseif ($mockOtp) { $otpToUse = $mockOtp }

if ($otpToUse) {
  if (-not $Phone) {
    throw "-Phone is required when verifying OTP"
  }

  $otpVerifyUrl = "${StrapiUrl}/api/auth/otp/verify"
  $respOtpVerify = Invoke-JsonPost -Url $otpVerifyUrl -Body @{ phone = $Phone; otp = $otpToUse }
  if (Write-Result -Name "OTP verify" -Resp $respOtpVerify -OkStatuses @(200, 429)) {
    try {
      $token = [string]$respOtpVerify.Body.token
    } catch {
      $token = ""
    }
  }

  if ($token) {
    $ordersUrl = "${StrapiUrl}/api/orders/my-orders"
    $respMyOrders = Invoke-JsonGet -Url $ordersUrl -Headers @{ Authorization = "Bearer ${token}" }
    Write-Result -Name "My orders (auth)" -Resp $respMyOrders -OkStatuses @(200) | Out-Null
  } else {
    Write-Host "[INFO] JWT not available; skipping my-orders." -ForegroundColor DarkGray
  }
}

# 4) Tracking lookup (optional)
if ($OrderCode -and $Phone) {
  $trackUrl = "${StrapiUrl}/api/order-tracking/lookup"
  $respTrack = Invoke-JsonPost -Url $trackUrl -Body @{ code = $OrderCode; phone = $Phone }
  Write-Result -Name "Order tracking (code+phone)" -Resp $respTrack -OkStatuses @(200, 404, 429) | Out-Null

  if ($TestRateLimit) {
    # Negative test: wrong phone should not reveal existence (expect 404)
    $wrongPhone = $Phone + "0"
    $respTrackWrong = Invoke-JsonPost -Url $trackUrl -Body @{ code = $OrderCode; phone = $wrongPhone }
    Write-Result -Name "Order tracking (wrong phone should be 404)" -Resp $respTrackWrong -OkStatuses @(404, 429) | Out-Null
  }
} else {
  Write-Host "[INFO] No -OrderCode/-Phone provided; skipping tracking lookup." -ForegroundColor DarkGray
}

# 5) Payment create + status (optional)
if ($OrderCode -and $Phone) {
  $payCreateUrl = "${StrapiUrl}/api/payments/create"
  $respPayCreate = Invoke-JsonPost -Url $payCreateUrl -Body @{ orderCode = $OrderCode; phone = $Phone }

  if (Write-Result -Name "Payment create" -Resp $respPayCreate -OkStatuses @(200, 429, 400, 404)) {
    $paymentId = ""
    try {
      $paymentId = [string]$respPayCreate.Body.data.id
    } catch {
      $paymentId = ""
    }

    if ($paymentId) {
      $statusUrl = "${StrapiUrl}/api/payments/status/${paymentId}?orderCode=$([uri]::EscapeDataString($OrderCode))&phone=$([uri]::EscapeDataString($Phone))"
      $respPayStatus = Invoke-JsonGet -Url $statusUrl
      Write-Result -Name "Payment status" -Resp $respPayStatus -OkStatuses @(200, 429, 400, 404) | Out-Null
    } else {
      Write-Host "[INFO] Payment id not found in response; skipping payment status." -ForegroundColor DarkGray
    }
  }
} else {
  Write-Host "[INFO] No -OrderCode/-Phone provided; skipping payment create/status." -ForegroundColor DarkGray
}

Write-Host "" 
Write-Host "Done." -ForegroundColor Cyan
