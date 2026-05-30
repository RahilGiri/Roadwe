import React from 'react';

export default function InvoiceTemplate({ data = {}, company = {} }) {
  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const gstPercentage = data.gstPercentage || 18;
  const headingColor = company.heading_color || '#0066cc';

  return (
    <div className="invoice-print-page w-[210mm] h-[297mm] p-[10mm] bg-white border border-gray-200 flex flex-col justify-between font-sans text-[9px] leading-tight select-text relative shadow-sm" style={{ boxSizing: 'border-box' }}>
      
      <div>
        {/* Header Block */}
        <div className="flex justify-between items-start border-b-2 border-gray-300 pb-2 mb-3">
          <div className="flex items-center gap-3">
            {company.logo_img ? (
              <img src={company.logo_img} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="h-10 w-10 bg-blue-900 rounded flex items-center justify-center text-white font-black text-lg">T</div>
            )}
            <div>
              <h1 className="text-[16px] font-black tracking-wide leading-none" style={{ color: headingColor }}>{company.companyName || 'ROADWE LOGISTICS'}</h1>
              <span className="text-[8px] text-gray-500 block uppercase font-bold tracking-wider mt-0.5">FLEET OWNERS &amp; Billing Contractor</span>
              <span className="text-[7.5px] text-gray-600 block leading-tight mt-0.5">{company.address || 'BHILAI CHHATTISGARH'}</span>
              <span className="text-[7.5px] text-gray-600 block"><b>Transport Reg No:</b> GJ-24-0129196</span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-[14px] font-black text-gray-800 tracking-wide uppercase my-0.5">TAX INVOICE</h2>
            <div className="text-left inline-block border border-gray-300 p-1.5 rounded mt-1 bg-gray-50 text-[7.5px] leading-relaxed">
              <p><b>Invoice No:</b> <span className="font-bold text-gray-950">INV-{data.invoiceNo}</span></p>
              <p><b>Date:</b> {data.date}</p>
              <p><b>Due Date:</b> {data.dueDate || 'Immediate'}</p>
            </div>
          </div>
        </div>

        {/* GSTIN / PAN Banner row */}
        <div className="grid grid-cols-4 gap-2 mb-3 text-[8px] border-b border-gray-200 pb-1.5">
          <p><b>GSTIN:</b> {company.gstin || '24CTSPG1070M1ZF'}</p>
          <p><b>PAN:</b> {company.pan || 'CTSPG1070M'}</p>
          <p><b>Mobile:</b> {company.mobile || '9664874523'}</p>
          <p><b>Email:</b> {company.email || 'billing@roadwe.in'}</p>
        </div>

        {/* Customer / Party details */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-gray-300 p-2 rounded bg-white min-h-[75px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 uppercase tracking-wider">BILL TO (CUSTOMER)</span>
            <div className="mt-1 flex flex-col gap-0.5 text-gray-900">
              <p className="font-extrabold text-[9.5px]">{data.customerName}</p>
              <p className="text-[8px] text-gray-600 leading-tight">{data.customerAddress || 'Jamshedpur Industrial Area'}</p>
              <p className="text-[8px] mt-0.5"><b>GSTIN:</b> {data.customerGstin || '09AAACI3591D1ZO'} • <b>Phone:</b> {data.customerPhone || ''}</p>
            </div>
          </div>

          <div className="border border-gray-300 p-2 rounded bg-white min-h-[75px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 uppercase tracking-wider">CONSIGNMENT ROUTE DETAILS</span>
            <div className="mt-1 flex flex-col gap-0.5 text-gray-800">
              <p><b>Place of Supply:</b> {data.placeOfSupply || 'GUJARAT'}</p>
              <p><b>Dispatch Method:</b> Road Transport</p>
              <p><b>Total Shipments:</b> {(data.items || []).length} Consignments Billed</p>
            </div>
          </div>
        </div>

        {/* Billed LR Cargo items table */}
        <h3 className="text-[8px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Consignment Shipments Summary</h3>
        <table className="w-100 border border-gray-300 border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50 text-[7.5px] text-gray-950 font-black border-b border-gray-300">
              <th className="border border-gray-300 p-1.5 text-center w-[5%]">S.No.</th>
              <th className="border border-gray-300 p-1.5 text-left w-[15%]">LR/GR Number</th>
              <th className="border border-gray-300 p-1.5 text-left w-[18%]">Vehicle Number</th>
              <th className="border border-gray-300 p-1.5 text-left w-[25%]">Route Details</th>
              <th className="border border-gray-300 p-1.5 text-left w-[22%]">Material Name</th>
              <th className="border border-gray-300 p-1.5 text-right w-[15%]">Freight Charge</th>
            </tr>
          </thead>
          <tbody>
            {(data.items || []).length > 0 ? (
              (data.items || []).map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 font-medium text-gray-800">
                  <td className="border border-gray-300 p-1.5 text-center">{idx + 1}</td>
                  <td className="border border-gray-300 p-1.5 font-bold text-gray-900">{item.lrNo}</td>
                  <td className="border border-gray-300 p-1.5 text-red-700 font-extrabold">{item.vehicleNumber}</td>
                  <td className="border border-gray-300 p-1.5">{item.fromCity} → {item.toCity}</td>
                  <td className="border border-gray-300 p-1.5 uppercase">{item.materialName}</td>
                  <td className="border border-gray-300 p-1.5 text-right font-bold text-gray-950">₹{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400 font-bold italic">No Consignments attached to this invoice.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary block */}
      <div className="mt-3">
        <div className="flex gap-4 items-start border-t border-gray-200 pt-2">
          {/* Bank coordinates */}
          <div className="flex-1 border border-gray-300 p-1.5 rounded bg-gray-50 text-[7.5px] leading-relaxed">
            <span className="font-extrabold text-[8px] text-blue-900 block border-b border-gray-200 pb-0.5 mb-1 uppercase">🏦 SETTLEMENT BANK ACCOUNT DETAILS</span>
            <p><b>Account Number:</b> 50200108804813</p>
            <p><b>Bank Name:</b> HDFC BANK (RAIPUR BRANCH)</p>
            <p><b>IFSC Code:</b> HDFC0008785</p>
            <p><b>Beneficiary:</b> {company.companyName || 'ROADWE LOGISTICS'}</p>
          </div>

          {/* Pricing grid */}
          <div className="w-[260px] flex flex-col font-bold text-gray-800 text-[8.5px]">
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>Freight Subtotal:</span><b>₹{formatCurrency(data.totalFreight)}</b>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>CGST ({gstPercentage / 2}%):</span><b>₹{formatCurrency((data.totalFreight * (gstPercentage / 2)) / 100)}</b>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1">
              <span>SGST ({gstPercentage / 2}%):</span><b>₹{formatCurrency((data.totalFreight * (gstPercentage / 2)) / 100)}</b>
            </div>
            {data.tdsAmount > 0 && (
              <div className="flex justify-between border-b border-gray-200 py-1 text-red-600">
                <span>TDS Deducted:</span><b>-₹{formatCurrency(data.tdsAmount)}</b>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-300 py-1 font-black text-gray-950 bg-gray-100 px-1 text-[9px]">
              <span style={{ color: headingColor }}>GRAND TOTAL VALUE:</span><b>₹{formatCurrency(data.grandTotal)}</b>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1 text-green-700">
              <span>Less - Paid Advances:</span><b>-₹{formatCurrency(data.amountPaid)}</b>
            </div>
            <div className="flex justify-between py-1 font-black text-red-700 bg-red-50 px-1 text-[9px]">
              <span>NET BALANCE DUE:</span><b>₹{formatCurrency(data.balance)}</b>
            </div>
          </div>
        </div>

        {/* Transporter Seal box */}
        <div className="flex justify-between items-end border-t border-gray-300 pt-3 mt-4 text-[7px] text-gray-500">
          <div>
            <p className="font-extrabold text-[7.5px] text-gray-900 mb-0.5">TERMS &amp; CONDITIONS</p>
            <p>1. Payment is due immediately upon receipt of tax invoice.</p>
            <p>2. Subject to Raigarh jurisdiction only.</p>
          </div>
          <div className="text-center min-w-[150px] relative">
            <span className="text-[7.5px] text-gray-600 block mb-4">For, {company.companyName || 'ROADWE LOGISTICS'}</span>
            
            {company.stamp_img && (
              <img src={company.stamp_img} alt="Stamp" className="absolute h-8 w-auto object-contain opacity-75 bottom-2 right-10 rotate-6" />
            )}
            
            <div className="border-t border-gray-600 font-extrabold text-[8px] text-gray-600 pt-1 tracking-wider">AUTHORIZED SIGNATORY</div>
          </div>
        </div>
      </div>

    </div>
  );
}
