"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
async function run() {
    const base = 'http://localhost:3000/api/v1';
    const login = await axios_1.default.post(base + '/auth/login', { email: 'admin@example.com', password: 'admin1234' });
    const token = login.data.access_token;
    console.log('token', token?.slice?.(0, 20));
    const res = await axios_1.default.post(base + '/admin/invites', { studentId: 1 }, { headers: { Authorization: `Bearer ${token}` } });
    console.log(res.data);
}
run().catch(e => { console.error(e.response?.data || e.message); process.exit(1); });
//# sourceMappingURL=create-invite.js.map