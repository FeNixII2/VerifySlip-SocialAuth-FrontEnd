import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-error">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold mt-4 text-base-content">ไม่พบหน้านี้</h2>
        <p className="mt-2 text-base-content/70">ขออภัย หน้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>

        <div className="mt-6">
          <Link to="/" className="btn btn-primary">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
