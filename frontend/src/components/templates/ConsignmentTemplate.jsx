import React from 'react';

export default function ConsignmentTemplate({ data = {}, company = {} }) {
  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const headingColor = company.heading_color || '#0066cc';

  return (
    <div className="consignment-print-page w-[210mm] h-[297mm] p-[10mm] bg-white border border-gray-200 flex flex-col justify-between font-sans text-[9px] leading-tight select-text relative shadow-sm" style={{ boxSizing: 'border-box' }}>
      
      <div>
        {/* Header Block */}
        <div className="flex justify-between items-start border-b-2 border-gray-400 pb-2 mb-3">
          <div className="flex items-center gap-3">
            {company.logo_img ? (
              <img src={company.logo_img} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="h-10 w-10 bg-blue-900 rounded flex items-center justify-center text-white font-black text-lg">T</div>
            )}
            <div>
              <h1 className="text-[16px] font-black tracking-wide leading-none" style={{ color: headingColor }}>{company.companyName || 'ROADWE LOGISTICS'}</h1>
              <span className="text-[8px] text-gray-500 block uppercase font-bold tracking-wider mt-0.5">CONSIGNMENT CARGO DISPATCH NOTE</span>
              <span className="text-[7.5px] text-gray-600 block leading-tight mt-0.5">{company.address || 'BHILAI CHHATTISGARH'}</span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-[14px] font-black text-gray-800 tracking-wide uppercase my-0.5">CONSIGNMENT NOTE</h2>
            <span className="text-[8.5px] text-gray-600 block"><b>Note No:</b> <span className="font-extrabold text-red-700">{data.biltyNo || 'CN-549100'}</span> • <b>Date:</b> {data.date || '27-May-2026'}</span>
          </div>
        </div>

        {/* Dispatch Specifications Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3 text-[8.5px] border border-gray-300 rounded bg-gray-50/50 p-2">
          <p><b>Vehicle No:</b> {data.vehicleNumber || 'UP-70-LT-3066'}</p>
          <p><b>Origin Location:</b> {data.fromCity || 'SANDILA, UTTAR PRADESH'}</p>
          <p><b>Destination City:</b> {data.toCity || 'KALOL, GUJARAT'}</p>
          <p><b>E-Way Bill:</b> {data.ewayBill || '431730116534'}</p>
        </div>

        {/* Consignor / Consignee detail cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-gray-300 p-2 rounded bg-white min-h-[70px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 uppercase tracking-wider">CONSIGNOR (SENDER) DETAILS</span>
            <div className="mt-1 flex flex-col gap-0.5 text-gray-900">
              <p className="font-extrabold text-[9px]">{data.consignorName || 'INDIA PESTICIDES LTD'}</p>
              <p className="text-[8px] text-gray-600 leading-tight">{data.consignorAddress || 'Plot No.d-2, UPSIDC Industrial Area, Sandila, Uttar Pradesh'}</p>
              <p className="text-[7.5px] mt-0.5"><b>GSTIN:</b> {data.consignorGstin || '09AAACI3591D1ZO'} • <b>Phone:</b> {data.consignorContact || ''}</p>
            </div>
          </div>

          <div className="border border-gray-300 p-2 rounded bg-white min-h-[70px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 uppercase tracking-wider">CONSIGNEE (RECEIVER) DETAILS</span>
            <div className="mt-1 flex flex-col gap-0.5 text-gray-900">
              <p className="font-extrabold text-[9px]">{data.consigneeName || 'ARYSTA LIFE SCIENCE INDIA LTD'}</p>
              <p className="text-[8px] text-gray-600 leading-tight">{data.consigneeAddress || '50-a, GIDC Estate Survey No.317-318, Kalol, Gujarat'}</p>
              <p className="text-[7.5px] mt-0.5"><b>GSTIN:</b> {data.consigneeGstin || '24AAACD0557C1ZB'} • <b>Phone:</b> {data.consigneeContact || ''}</p>
            </div>
          </div>
        </div>

        {/* Cargo Descriptions table */}
        <table className="w-100 border border-gray-300 border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 text-[8px] text-gray-950 font-black border-b border-gray-300">
              <th className="border border-gray-300 p-2 text-center w-[12%]">PACKAGING</th>
              <th className="border border-gray-300 p-2 text-center w-[10%]">QUANTITY</th>
              <th className="border border-gray-300 p-2 text-left w-[25%]">MATERIAL DESIGNATION</th>
              <th className="border border-gray-300 p-2 text-left w-[28%]">CARGO REMARKS &amp; SPECS</th>
              <th className="border border-gray-300 p-2 text-center w-[13%]">HSN CODE</th>
              <th className="border border-gray-300 p-2 text-right w-[12%]">WEIGHT (MT)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-medium text-gray-800">
              <td className="border border-gray-300 p-2 text-center">{data.packingType || 'BAGS'}</td>
              <td className="border border-gray-300 p-2 text-center font-bold text-gray-900">{data.noOfPackages || '700'}</td>
              <td className="border border-gray-300 p-2 font-bold text-gray-900 uppercase">{data.materialName || 'CAPTAN TECHNICAL'}</td>
              <td className="border border-gray-300 p-2 text-[8px] leading-tight text-gray-600">{data.goodsDescription || 'CAPTAN TECHNICAL - SAFE DISPATCHED'}</td>
              <td className="border border-gray-300 p-2 text-center">{data.hsnCode || '38089299'}</td>
              <td className="border border-gray-300 p-2 text-right font-extrabold text-gray-950">{data.actualWeight || '17.50'} MT</td>
            </tr>
          </tbody>
        </table>

        {/* Detailed terms & conditions print block */}
        <div className="border border-gray-300 rounded p-2 mt-4 bg-gray-50">
          <span className="text-[7.5px] font-black block border-b border-gray-200 pb-0.5 mb-1 text-gray-700 tracking-wide uppercase">📋 TERMS &amp; CONDITIONS OF CARRIAGE</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[6.5px] text-gray-500 leading-normal text-justify">
            <p>1. The Transport Operator agrees to hold itself liable to the bank concerned, as if the bank was a party to the contract, for carriage and storage safety.</p>
            <p>2. The Operator undertakes to deliver the goods in the same order and condition as received, surrendering the receipt only to authorized bank assigns.</p>
            <p>3. The right to entrust goods to any other lorry or intermediary services for transport is reserved as the operator's designated agency agent.</p>
            <p>4. The consignor is the primary liable payer of all freight and incidental charges payable at agreed billing coordinates.</p>
            <p>5. Perishable items lying undelivered after 48 hours of destination arrival may be disposed of without prior notice or operator liability.</p>
            <p>6. General cargo remaining undelivered after 30 days will be disposed of after giving 15 days written disposal notice to the consignor.</p>
            <p>7. Transporter is not responsible for natural leakages, breakages, or evaporation occurrences during transit phases.</p>
            <p>8. All disputes are strictly subject to {company.city || 'VADODARA'} local legal jurisdiction rules only.</p>
          </div>
        </div>
      </div>

      {/* Signatures & Stamps Footer */}
      <div className="border-t border-gray-300 pt-3 flex justify-between items-end">
        <div className="flex flex-col gap-1 text-[7px] text-gray-500">
          <p><b>Decl. Value of Goods:</b> ₹{data.valueOfGoods || '9086000'}</p>
          <p><b>GST Paid By:</b> {data.paidBy || 'CONSIGNOR'}</p>
          <p className="italic">Electronic Document - No physical signature required.</p>
        </div>

        <div className="flex gap-8 text-center text-[7.5px] font-bold text-gray-500 tracking-wide">
          <div className="w-[100px]">
            <div className="h-[25px] border-b border-dashed border-gray-300"></div>
            <p className="mt-1">CONSIGNEE SIGN</p>
          </div>
          <div className="w-[150px] text-center border border-gray-300 rounded p-1 bg-white relative">
            <span className="text-[7.5px] block text-gray-600 uppercase font-black">For, {company.companyName || 'ROADWE LOGISTICS'}</span>
            
            {company.stamp_img && (
              <img src={company.stamp_img} alt="Stamp" className="absolute h-6 w-auto object-contain opacity-75 bottom-2 right-8 rotate-6" />
            )}
            
            <div className="border-t border-gray-400 font-extrabold text-[7.5px] text-gray-500 pt-1 uppercase mt-4 tracking-wider">AUTHORIZED SIGNATORY</div>
          </div>
        </div>
      </div>

    </div>
  );
}
