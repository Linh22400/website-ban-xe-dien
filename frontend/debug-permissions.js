
const fetch = require('node-fetch');

async function testEndpoint(name, url) {
    console.log(`Testing ${name}...`);
    try {
        const res = await fetch(url);
        console.log(`  [Public] Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            const count = data.data ? data.data.length : 0;
            const meta = data.meta || {};
            console.log(`  [Data] Count: ${count}`);
            // Check if any item has publishedAt === null (is draft)
            const drafts = data.data ? data.data.filter(i => i.attributes ? i.attributes.publishedAt === null : i.publishedAt === null) : [];
            console.log(`  [Drafts] Count: ${drafts.length}`);
        } else {
             const text = await res.text();
             console.log(`  [Error] ${text.substring(0, 100)}`);
        }
    } catch (e) {
        console.log(`  [Error] ${e.message}`);
    }
}

async function test() {
    const baseUrl = 'https://website-ban-xe-dien.onrender.com/api';
    
    // Test with status=draft (Admin view)
    console.log('--- Testing WITH status=draft (Expect Drafts) ---');
    await testEndpoint('Showrooms (Draft)', `${baseUrl}/showrooms?status=draft`);
    await testEndpoint('Articles (Draft)', `${baseUrl}/articles?status=draft`);
    
    // Test WITHOUT status=draft (Public view)
    console.log('\n--- Testing WITHOUT status=draft (Expect Published Only) ---');
    await testEndpoint('Showrooms (Public)', `${baseUrl}/showrooms`);
    await testEndpoint('Articles (Public)', `${baseUrl}/articles`);
}

test();
