require('dotenv').config();

const http = require('http');

const API_URL = 'http://localhost:5000/api/auth/login';

// Load credentials from .env to test the "Email Bypass" scenario
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123';

/**
 * ── helper ─────────────────────────────────────────────────────
 */
function testPayload(name, payload) {
    return new Promise((resolve) => {
        const url = new URL(API_URL);
        const body = JSON.stringify(payload);

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
            let responseData = '';
            res.on('data', (chunk) => (responseData += chunk));
            res.on('end', () => {
                console.log(`[Test: ${name}]`);
                console.log(`- Request Payload: ${body}`);
                console.log(`- Status: ${res.statusCode}`);
                
                try {
                    const json = JSON.parse(responseData);
                    if (res.statusCode === 200 && json.token) {
                        console.log('🔴 VULNERABILITY DETECTED: Login Bypassed!');
                    } else {
                        console.log('🟢 SECURE: Login Rejected.');
                    }
                } catch (e) {
                    console.log('⚪ Unknown Response Format.');
                }
                console.log('--------------------------------------------------');
                resolve();
            });
        });

        req.on('error', (err) => {
            console.error(`❌ Connection Error: ${err.message}`);
            console.log('Make sure the backend is running (npm run dev)');
            resolve();
        });

        req.write(body);
        req.end();
    });
}

/**
 * ── main ───────────────────────────────────────────────────────
 */
async function runTests() {
    console.log('🔍 Starting NoSQL Injection Security Audit...\n');

    // Test 1: Bypass Email with $gt operator
    // We use the correct password but a malicious email object.
    // This demonstrates that an attacker doesn't need the victim's email.
    await testPayload('Bypass Email ($gt)', {
        email: { "$gt": "" },
        password: ADMIN_PASSWORD
    });

    // Test 2: Bypassing login completely if both fields are vulnerable
    await testPayload('Bypass both Email and Password ($ne)', {
        email: { "$ne": "non-existent@example.com" },
        password: { "$ne": "empty-string" }
    });

    console.log('Audit Complete.');
}

runTests();

