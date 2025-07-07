import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';  // import sweetalert2
import 'sweetalert2/dist/sweetalert2.min.css'; // ถ้าต้องการใช้ default styles

const banks = [
  'กรุงไทย', 'กสิกรไทย', 'ไทยพาณิชย์', 'กรุงเทพ', 'กรุงศรีอยุธยา',
  'ทหารไทย', 'ธนชาต', 'ซีไอเอ็มบีไทย', 'ยูโอบี', 'ออมสิน', 'ธ.เกษตรและสหกรณ์',
  'อาคารสงเคราะห์', 'อิสลาม', 'อิออน', 'ธ.เพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)'
];

export default function SlipCheckCard() {
  const [conditionType, setConditionType] = useState('none');
  const [form, setForm] = useState({ ownerName: '', bank: '', amount: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlipClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!imagePreview) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกไฟล์รูปก่อน',
      });
      return;
    }

    try {
      const formData = new FormData();
      const file = fileInputRef.current.files[0];
      if (!file) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกไฟล์รูปก่อน',
        });
        return;
      }
      formData.append('file', file);

      if (conditionType === 'withCondition') {
        const bankCodeMap = {
          'กรุงเทพ': '01002',
          'กสิกรไทย': '01004',
          'กรุงไทย': '01006',
          'ทหารไทย': '01011',
          'ไทยพาณิชย์': '01014',
          'กรุงศรีอยุธยา': '01025',
          'ธนชาต': '01069',
          'ซีไอเอ็มบีไทย': '01022',
          'ยูโอบี': '01024',
          'ออมสิน': '01030',
          'ธ.เกษตรและสหกรณ์': '01034',
          'อาคารสงเคราะห์': '01033',
          'อิสลาม': '01066',
        };

        const payload = {
          checkReceiver: [
            {
              accountType: bankCodeMap[form.bank] || '',
              accountNameTH: form.ownerName.trim(),
              accountNameEN: form.ownerName.trim(),
            },
          ],
          checkAmount: {
            type: 'eq',
            amount: parseFloat(form.amount),
          }
        };

        formData.append('payload', JSON.stringify(payload));
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/slip/verify`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: data.message || 'เกิดข้อผิดพลาด',
        });
        return;
      }


      const messageMap = {
        "Slip not found.": "❌ ไม่พบสลิปในระบบ หรือรายการอาจหมดอายุ",
        "Slip found.": "✅ พบข้อมูลสลิปในระบบเรียบร้อยแล้ว",
        "Recipient account Mismatch.": "⚠️ บัญชีปลายทางไม่ตรง โปรดตรวจสอบชื่อบัญชีอีกครั้ง",
        "Slip is valid.": "✅ สลิปถูกต้อง ข้อมูลครบถ้วน",
        "Amount not as specified.": "⚠️ จำนวนเงินไม่ตรงตามที่ระบุไว้"
      };

      if (messageMap[data.message]) {
        // ถ้า message ตรงกับข้อความที่กำหนด
        Swal.fire({
          icon: data.message === "Slip is valid." ? 'success' : 'info',
          title: 'ผลการตรวจสอบสลิป',
          html: `
        <div style="font-size: 1.1rem; text-align: left;">
          ${messageMap[data.message]}
        </div>
      `,
          width: '500px',
          customClass: {
            popup: 'text-left'
          }
        });
      } else {
        // ถ้าไม่ตรง แสดง log ดิบแบบเดิม
        Swal.fire({
          icon: 'info',
          title: 'ผลการตรวจสอบ (Raw Log)',
          html: `<pre style="text-align:left;">${JSON.stringify(data, null, 2)}</pre>`,
          width: '600px',
          customClass: {
            popup: 'text-left'
          }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
      {/* input file ซ่อน */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* ปุ่มเลือกรูป */}
      <button
        type="button"
        onClick={handleSlipClick}
        className="w-full h-48 bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition duration-200"
        aria-label="กดเลือกรูปสลิปจากเครื่อง"
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Slip preview" className="object-contain h-full" />
        ) : (
          <span className="text-blue-700 text-lg font-medium">[คลิกเพื่อเลือกรูปสลิป]</span>
        )}
      </button>

      <div className="p-6">
        {/* ตัวเลือกเงื่อนไข */}
        <div className="flex justify-center space-x-6 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="conditionType"
              value="none"
              checked={conditionType === 'none'}
              onChange={() => setConditionType('none')}
              className="accent-blue-600"
            />
            <span className="text-gray-800 font-medium">ไม่มีเงื่อนไข</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="conditionType"
              value="withCondition"
              checked={conditionType === 'withCondition'}
              onChange={() => setConditionType('withCondition')}
              className="accent-blue-600"
            />
            <span className="text-gray-800 font-medium">มีเงื่อนไข</span>
          </label>
        </div>

        {/* ฟอร์มเงื่อนไข */}
        {conditionType === 'withCondition' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">ชื่อเจ้าของบัญชีปลายทาง</label>
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
                placeholder="ชื่อเจ้าของบัญชี"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">ธนาคาร</label>
              <select
                name="bank"
                value={form.bank}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>เลือกธนาคาร</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">จำนวนเงิน</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="จำนวนเงิน"
                min="0"
                step="0.01"
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              ส่งข้อมูล
            </button>
          </form>
        )}

        {conditionType === 'none' && (
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            เช็คสลิป
          </button>
        )}
      </div>
    </div>
  );
}
