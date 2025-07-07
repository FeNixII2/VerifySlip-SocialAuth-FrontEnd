/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // ตรวจสอบให้ถูก path กับโปรเจกต์ของคุณ
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};