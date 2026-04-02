require('dotenv').config();
const http = require('http');

const API_URL = 'http://localhost:5000/api/auth/login';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123';

async function testStandardLogin() {
    console.log('🧪 Testing standard login...');
    const body = JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    const url = new URL(API_URL);
    const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
        },
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            try {
                const json = JSON.parse(data);
                if (res.statusCode === 200 && json.token) {
                    console.log('✅ Success: Login works correctly.');
                } else {
                    console.log('❌ Failure: Standard login failed.');
                    console.log('Response:', data);
                }
            } catch (e) {
                console.log('❌ Error parsing response');
            }
        });
    });

    req.on('error', (err) => {
        console.error('❌ Connection error:', err.message);
    });

    req.write(body);
    req.end();
}

testStandardLogin();
