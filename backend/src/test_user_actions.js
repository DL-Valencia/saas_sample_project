const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function testActions() {
    try {
        console.log('Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
            password: process.env.SEED_ADMIN_PASSWORD || 'admin123'
        });

        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        console.log('Fetching users...');
        const usersRes = await axios.get(`${API_URL}/users`, { headers });
        const users = usersRes.data;
        const testUser = users.find(u => u.email === (process.env.SEED_USER_EMAIL || 'user@example.com'));

        if (!testUser) {
            console.log('Test user not found.');
            return;
        }

        console.log(`Updating user: ${testUser.name}...`);
        const updateRes = await axios.patch(`${API_URL}/users/${testUser._id}`, {
            name: 'Updated Name',
            companyName: 'Updated Company'
        }, { headers });
        console.log('Update Successful:', updateRes.data.name === 'Updated Name');

        console.log(`Toggling isActive for: ${testUser.name}...`);
        const toggleRes = await axios.patch(`${API_URL}/users/${testUser._id}`, {
            isActive: !testUser.isActive
        }, { headers });
        console.log('Toggle Successful:', toggleRes.data.isActive !== testUser.isActive);
        
        console.log('Action Tests Completed Successfully.');
    } catch (err) {
        console.error('Test Failed:', err.response?.data || err.message);
    }
}

testActions();
