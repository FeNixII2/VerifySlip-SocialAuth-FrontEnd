import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 7000);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/auth/login`,
        { email, password },
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      clearTimeout(timeout);

      if (axios.isCancel(err)) {
        setError(
          <>
            ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ อาจเป็นเพราะ Render ยังไม่เปิดบริการ<br />
            👉 กรุณาเปิดลิงก์นี้ก่อน:{' '}
            <a
              href="https://verifyslip-socialauth-backend.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              เปิด backend ที่นี่
            </a>
          </>
        );
      } else {
        setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
      }
    }

    setLoading(false);
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_BACKEND}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">VerifySlip With API</h2>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">อีเมล</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 rounded-md transition`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

          {loading && (
            <div className="flex justify-center mt-2">
              <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-gray-500">หรือเข้าสู่ระบบด้วย</div>

        <div className="mt-4 space-y-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full bg-blue-700 text-white hover:bg-blue-800 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <i className="fa-brands fa-facebook-f"></i>
            Facebook
          </button>
          <button
            onClick={() => handleSocialLogin('line')}
            className="w-full bg-green-500 text-white hover:bg-green-600 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
              alt="LINE"
              className="w-5 h-5"
            />
            LINE
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-600">ยังไม่มีบัญชี? </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:underline font-medium"
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>
    </div>
  );
}
