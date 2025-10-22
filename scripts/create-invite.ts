import axios from 'axios';

async function run() {
  const base = 'http://localhost:3000/api/v1';
  const login = await axios.post(base + '/auth/login', { email: 'admin@example.com', password: 'admin1234' });
  const token = login.data.access_token;
  console.log('token', token?.slice?.(0, 20));
  const res = await axios.post(base + '/admin/invites', { studentId: 1 }, { headers: { Authorization: `Bearer ${token}` } });
  console.log(res.data);
}

run().catch(e => { console.error(e.response?.data || e.message); process.exit(1); });
