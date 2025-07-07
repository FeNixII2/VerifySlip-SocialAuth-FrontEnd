import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SlipCheckCard from './SlipCheckCard.jsx';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/home', { replace: true });
    } else {
      if (!localStorage.getItem('token')) {
        navigate('/login');
      }
    }
  }, [location.search, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ฟังก์ชันสลับเมนูมือถือ
  const toggleMenu = () => {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('hidden');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between flex-wrap shadow-lg sticky top-0 z-50">
        <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer select-none">
          <span className="font-extrabold text-2xl tracking-wide">CheckSlip With API</span>
        </div>

        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 border rounded border-white hover:border-gray-300 hover:text-gray-300 transition"
            aria-label="Toggle menu"
          >
            <svg className="fill-current h-6 w-6" viewBox="0 0 24 24" >
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div
          id="nav-menu"
          className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block"
        >
          <div className="text-sm lg:flex-grow">
            <a
              href="/home"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-6 font-semibold transition"
            >
              หน้าแรก
            </a>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="inline-block text-sm px-5 py-2 leading-none border rounded-full text-white border-white hover:border-transparent hover:text-blue-700 hover:bg-white font-semibold transition mt-4 lg:mt-0 shadow-md"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-5xl mx-auto mt-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3 drop-shadow-sm">
            ยินดีต้อนรับเข้าสู่หน้าแรก <span role="img" aria-label="party">🎉</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-600 text-lg leading-relaxed">
            นี่คือหน้าเช็คสลิป ที่ต่อ API เข้ากับ Slip2go สำหรับการตรวจสอบสลิปทั้งการ เช็คสลิปปลอม และ เช็คแบบมีเงื่อนไขเบื้องต้น
          </p>
        </header>

        {/* วาง SlipCheckCard */}
        <SlipCheckCard />
      </main>
    </>
  );
}
