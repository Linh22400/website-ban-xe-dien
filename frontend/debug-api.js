// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function check() {
    try {
        const response = await fetch('http://localhost:1337/api/promotions?populate[0]=car_models');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

check();
