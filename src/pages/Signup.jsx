import React, { useState } from 'react';
import axios from 'axios';
export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.username.length < 4) {
    setError('ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร');
    return;
  }

    if (form.password.length < 6) {
    setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    return;
  }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/auth/signup`, form);
      setSuccess(res.data.message || 'สมัครสมาชิกสำเร็จ');
      setForm({ username: '', email: '', password: '' }); // ล้างฟอร์ม
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">สมัครสมาชิก</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="ชื่อผู้ใช้"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">อีเมล</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            สมัครสมาชิก
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          มีบัญชีอยู่แล้ว?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  );
}
