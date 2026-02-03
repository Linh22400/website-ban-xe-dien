
const fetch = require('node-fetch'); // Or use global fetch if Node 18+

async function testEndpoint(name, url) {
    console.log(`\nTesting ${name}...`);
    try {
        // Test 1: No Token (Public Access?)
        const resPublic = await fetch(url);
        console.log(`  [Public] Status: ${resPublic.status}`);

        // Test 2: Invalid Token (Simulating Stale Localhost Token)
        const resBadToken = await fetch(url, {
            headers: { 'Authorization': 'Bearer invalid-token-from-localhost' }
        });
        console.log(`  [Bad Token] Status: ${resBadToken.status}`);
        
        if (resPublic.ok) {
             const data = await resPublic.json();
             console.log(`  [Data] Count: ${data.meta?.pagination?.total || 'N/A'}`);
        }
    } catch (e) {
        console.error(`  [Error] ${e.message}`);
    }
}

async function test() {
    const baseUrl = 'https://website-ban-xe-dien.onrender.com/api';
    
    await testEndpoint('Showrooms', `${baseUrl}/showrooms?status=draft`);
    await testEndpoint('Articles', `${baseUrl}/articles?status=draft`);
    await testEndpoint('Promotions', `${baseUrl}/promotions?status=draft`);
    await testEndpoint('Accessories', `${baseUrl}/accessories?status=draft`);
}

test();
