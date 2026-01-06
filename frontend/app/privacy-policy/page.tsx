export const metadata = {
  title: "Chính Sách Bảo Mật | Xe Điện Xanh",
  description: "Chính sách bảo mật và nguyên tắc xử lý dữ liệu cá nhân tại Xe Điện Xanh.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-muted-foreground">
            Cam kết bảo vệ thông tin và minh bạch về cách chúng tôi xử lý dữ liệu.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Dữ liệu có thể thu thập</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Thông tin liên hệ khi bạn đặt hàng/đăng ký tư vấn (họ tên, số điện thoại, email).</li>
              <li>Thông tin phục vụ giao dịch (mã đơn hàng, trạng thái thanh toán/đơn hàng).</li>
              <li>Dữ liệu kỹ thuật cơ bản để vận hành website (ví dụ: log lỗi hệ thống).</li>
            </ul>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Mục đích sử dụng</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Xử lý đơn hàng, hỗ trợ khách hàng và cung cấp dịch vụ sau bán.</li>
              <li>Xác minh thông tin khi tra cứu đơn hàng hoặc hỗ trợ thanh toán.</li>
              <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.</li>
            </ul>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Bảo vệ thông tin</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi áp dụng các biện pháp kỹ thuật và quy trình phù hợp để giảm thiểu rủi ro truy cập trái phép,
              rò rỉ và lạm dụng dữ liệu.
            </p>
          </section>

          <section className="bg-secondary/30 p-6 md:p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Liên hệ</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nếu bạn có yêu cầu về dữ liệu cá nhân hoặc cần hỗ trợ, vui lòng liên hệ qua trang Liên hệ hoặc hotline.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
