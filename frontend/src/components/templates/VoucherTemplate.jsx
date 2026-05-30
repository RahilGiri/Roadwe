import React from 'react';

export default function VoucherTemplate({ data = {}, company = {} }) {
  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const numberToWords = (num) => {
    if (!num || isNaN(num)) return 'Zero Rupees Only';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const g = ['', 'Thousand', 'Lakh', 'Crore'];
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' Rupees Only' : 'Rupees Only';
    return str;
  };

  const isReceipt = data.type === 'Receipt' || data.type === 'Received Payment';
  const headingColor = company.heading_color || '#0066cc';

  return (
    <div className="voucher-print-page w-[210mm] h-[148mm] p-[10mm] bg-white border border-gray-200 flex flex-col justify-between font-sans text-[9.5px] leading-relaxed select-text relative shadow-sm" style={{ boxSizing: 'border-box' }}>
      
      <div>
        {/* Header Block */}
        <div className="flex justify-between items-center border-b border-gray-400 pb-1 mb-2">
          <div className="flex items-center gap-3">
            {company.logo_img ? (
              <img src={company.logo_img} alt="Logo" className="h-9 w-auto object-contain" />
            ) : (
              <div className="h-9 w-9 bg-blue-900 rounded flex items-center justify-center text-white font-black text-sm">T</div>
            )}
            <div>
              <h1 className="text-[13px] font-black leading-none" style={{ color: headingColor }}>{company.companyName || 'ROADWE LOGISTICS'}</h1>
              <span className="text-[7.5px] text-gray-500 block uppercase font-bold tracking-wider mt-0.5">FLEET OWNERS &amp; Billing Contractor</span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-[12px] font-black text-gray-800 tracking-wide uppercase leading-none">
              {isReceipt ? 'RECEIPT VOUCHER' : 'PAYMENT VOUCHER'}
            </h2>
            <span className="text-[8px] text-gray-600 block mt-0.5"><b>Voucher No:</b> <span className="font-extrabold">{data.voucherNo}</span></span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-2 mb-3">
          <p><b>Date:</b> {data.date}</p>
          <p><b>Payment Mode:</b> {data.mode || 'Cash / Ledger Account'}</p>
          <p><b>Financial Year:</b> 2026-2027</p>
        </div>

        {/* Voucher core statement */}
        <div className="flex flex-col gap-3 my-2 border border-gray-300 rounded p-3 bg-gray-50/50">
          <div className="flex items-baseline">
            <span className="text-gray-500 w-140 shrink-0 font-bold uppercase">{isReceipt ? 'Received With Thanks From :' : 'Paid To Party Name :'}</span>
            <span className="border-b border-dashed border-gray-400 flex-1 font-black text-gray-950 text-[11px] pb-0.5 px-1">{data.partyName}</span>
          </div>

          <div className="flex items-baseline">
            <span className="text-gray-500 w-140 shrink-0 font-bold uppercase">On Account Of (Particulars) :</span>
            <span className="border-b border-dashed border-gray-400 flex-1 font-bold text-gray-900 pb-0.5 px-1">{data.description || 'Settlement of Lorry Freight expenses'}</span>
          </div>

          <div className="flex items-baseline">
            <span className="text-gray-500 w-140 shrink-0 font-bold uppercase">The Sum Of Rupees (In Words) :</span>
            <span className="border-b border-dashed border-gray-400 flex-1 font-extrabold text-blue-900 pb-0.5 px-1">{numberToWords(data.amount)}</span>
          </div>
        </div>
      </div>

      {/* Footer Figures & Signature Blocks */}
      <div>
        <div className="flex justify-between items-end mt-4">
          <div className="border-2 border-gray-800 bg-gray-900 text-white font-black text-[12px] px-4 py-1.5 rounded-sm shadow-sm tracking-wide">
            AMOUNT: ₹{formatCurrency(data.amount)}/-
          </div>

          <div className="flex gap-6 text-[7.5px] text-gray-500 text-center font-bold tracking-wide">
            <div className="w-[80px]">
              <div className="h-[25px] border-b border-dashed border-gray-300"></div>
              <p className="mt-1 uppercase">PAID BY</p>
            </div>
            <div className="w-[80px]">
              <div className="h-[25px] border-b border-dashed border-gray-300"></div>
              <p className="mt-1 uppercase">RECEIVED BY</p>
            </div>
            <div className="w-[80px]">
              <div className="h-[25px] border-b border-dashed border-gray-300"></div>
              <p className="mt-1 uppercase">CHECKED BY</p>
            </div>
            <div className="w-[120px] text-center relative border border-gray-300 rounded p-1 bg-white">
              <span className="text-[7.5px] block text-gray-600 uppercase font-black">For, {company.companyName || 'ROADWE LOGISTICS'}</span>
              
              {company.stamp_img && (
                <img src={company.stamp_img} alt="Stamp" className="absolute h-6 w-auto object-contain opacity-75 bottom-2 right-6 rotate-6" />
              )}
              
              <div className="border-t border-gray-400 font-extrabold text-[7.5px] text-gray-500 pt-1 uppercase mt-4 tracking-wider">AUTHORIZED SIGN</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
