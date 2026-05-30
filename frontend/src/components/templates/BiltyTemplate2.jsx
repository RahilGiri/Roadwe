import React from 'react';

export default function BiltyTemplate2({ data = {}, company = {}, copyLabel = 'TRANSPORT COPY' }) {
  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <div className="bilty-print-page w-[210mm] h-[297mm] p-[10mm] bg-white border border-gray-200 flex flex-col justify-between font-sans text-[9px] leading-tight select-text relative shadow-sm" style={{ boxSizing: 'border-box' }}>
      
      {/* Top Header Block */}
      <div>
        <div className="flex justify-between items-center border-b-2 border-gray-600 pb-2 mb-3">
          <div className="flex items-center gap-3">
            {company.logo_img ? (
              <img src={company.logo_img} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="h-10 w-10 bg-gray-800 rounded flex items-center justify-center text-white font-black text-lg">T</div>
            )}
            <div>
              <h1 className="text-[15px] font-black text-gray-900 leading-none">{company.companyName || 'ROADWE LOGISTICS'}</h1>
              <span className="text-[7.5px] text-gray-500 block uppercase font-bold tracking-wider mt-0.5">TRIP DISPATCH REPORT &amp; CONSIGNMENT RECEIPT</span>
              <span className="text-[7px] text-gray-500 block font-medium leading-none">{company.address || 'BHILAI CHHATTISGARH'}</span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-[13px] font-black text-gray-700 tracking-wide uppercase leading-none">DELIVERY ADVICE</h2>
            <div className="inline-block my-1 px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-700 font-extrabold text-[8px] rounded uppercase">
              {copyLabel}
            </div>
            <span className="text-[8px] text-gray-600 block mt-0.5"><b>LR No:</b> <span className="font-extrabold text-red-700">{data.biltyNo || 'G/1000011211'}</span> • <b>Date:</b> {data.date || '27-May-2026'}</span>
          </div>
        </div>

        {/* Triple Split Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="border border-gray-600 p-2 rounded bg-white min-h-[75px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 tracking-wider">CONSIGNMENT SUMMARY</span>
            <div className="mt-1 flex flex-col gap-0.5">
              <p><b>LR Number:</b> {data.biltyNo || 'G/1000011211'}</p>
              <p><b>Dispatch Date:</b> {data.date || '27-May-2026'}</p>
              <p><b>Invoice No:</b> {data.invoiceNumber || 'S/26-27/289'}</p>
              <p><b>E-Way Bill:</b> {data.ewayBill || '431730116534'}</p>
            </div>
          </div>

          <div className="border border-gray-600 p-2 rounded bg-white min-h-[75px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 tracking-wider">ROUTE &amp; PLACES</span>
            <div className="mt-1 flex flex-col gap-0.5">
              <p><b>Origin Location:</b> {data.fromCity || 'SANDILA, UTTAR PRADESH'}</p>
              <p><b>Destination City:</b> {data.toCity || 'KALOL, GUJARAT'}</p>
              <p className="text-[7.5px] leading-tight text-gray-600 mt-1"><b>Delivery Address:</b> {data.deliveryAddress || '50-A,GIDC ESTATE SURVEY NO.317-318,KALOL,PANCHMAHAL,GUJARAT-389330'}</p>
            </div>
          </div>

          <div className="border border-gray-600 p-2 rounded bg-white min-h-[75px]">
            <span className="text-[8px] font-black block border-b border-gray-200 pb-1 text-gray-700 tracking-wider">TRIP &amp; VEHICLE PARAMETERS</span>
            <div className="mt-1 flex flex-col gap-0.5">
              <p><b>Vehicle Number:</b> {data.vehicleNumber || 'UP-70-LT-3066'}</p>
              <p><b>Owner:</b> {data.ownerName || ''}</p>
              <p><b>Driver:</b> {data.driverName || 'SHYAM BAHADUR GUPTA'}</p>
              <p><b>Driver Contact:</b> {data.driverMobile || '8528214393'}</p>
            </div>
          </div>
        </div>

        {/* Party Details cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="border border-gray-600 p-2 rounded bg-white min-h-[70px]">
            <span className="text-[8px] font-black block border-b border-red-200 pb-1 text-red-700 tracking-wider">CONSIGNOR (SENDER)</span>
            <div className="mt-1 flex flex-col gap-0.5">
              <p className="font-extrabold text-gray-950">{data.consignorName || 'INDIA PESTICIDES LTD SANDILA'}</p>
              <p className="text-[8px] text-gray-600 leading-tight">{data.consignorAddress || 'Plot No.d-2 To D-4&k-2 To K-12,l-1,upsidc Industrial Area Sandila-241127,hardoi,uttar Pradesh'}</p>
              <p className="text-[7.5px] mt-0.5"><b>GSTIN:</b> {data.consignorGstin || '09AAACI3591D1ZO'} • <b>Contact:</b> {data.consignorContact || ''}</p>
            </div>
          </div>

          <div className="border border-gray-600 p-2 rounded bg-white min-h-[70px]">
            <span className="text-[8px] font-black block border-b border-red-200 pb-1 text-red-700 tracking-wider">CONSIGNEE (RECEIVER)</span>
            <div className="mt-1 flex flex-col gap-0.5">
              <p className="font-extrabold text-gray-950">{data.consigneeName || 'ARYSTA LIFE SCIENCE INDIA LTD'}</p>
              <p className="text-[8px] text-gray-600 leading-tight">{data.consigneeAddress || '50-a,gidc Estate Survey No.317-318,kalol,panchmahal,Gujarat-389330'}</p>
              <p className="text-[7.5px] mt-0.5"><b>GSTIN:</b> {data.consigneeGstin || '24AAACD0557C1ZB'} • <b>Contact:</b> {data.consigneeContact || ''}</p>
            </div>
          </div>
        </div>

        {/* Consignment particulars and calculations table */}
        <table className="w-100 border-2 border-gray-600 border-collapse bg-white mt-2">
          <thead>
            <tr className="bg-gray-100 text-[8px] text-gray-950 font-black">
              <th className="border-2 border-gray-600 p-2 text-left w-[45%]">PARTICULARS OF CONSIGNMENT</th>
              <th className="border-2 border-gray-600 p-2 text-center w-[12%]">ARTICLES</th>
              <th className="border-2 border-gray-600 p-2 text-center w-[13%]">WEIGHT (MT)</th>
              <th className="border-2 border-gray-600 p-2 text-center w-[13%]">RATE / MT</th>
              <th className="border-2 border-gray-600 p-2 text-center w-[17%]">TOTAL FREIGHT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 border-gray-600 p-2 align-top h-[120px]">
                <div className="font-extrabold text-[10px] text-gray-900 uppercase">{data.materialName || 'CAPTAN TECHNICAL'}</div>
                <div className="text-[7.5px] text-gray-600 mt-1 leading-normal font-medium">
                  {data.goodsDescription || 'CAPTAN TECHNICAL'}<br />
                  <b>E-Way Bill:</b> {data.ewayBill || '431730116534'} • <b>Invoice:</b> {data.invoiceNumber || 'S/26-27/289'} • <b>Decl. Value:</b> ₹{data.valueOfGoods || '9086000'}
                </div>
              </td>
              <td className="border-2 border-gray-600 p-2 text-center align-top font-bold text-gray-900">
                {data.noOfPackages || '700'}<br />
                <span className="text-[7.5px] text-gray-500 font-normal">{data.packingType || 'BAGS'}</span>
              </td>
              <td className="border-2 border-gray-600 p-2 text-center align-top font-bold text-gray-900">
                <b>{data.actualWeight || '17.50'}</b> MT
              </td>
              <td className="border-2 border-gray-600 p-2 text-center align-top font-bold text-gray-900">
                <b>₹{data.rate || '0.00'}</b>
              </td>
              <td className="border-2 border-gray-600 p-0 align-top">
                <div className="flex flex-col text-[8px] font-bold text-gray-800">
                  <div className="flex justify-between border-b border-gray-200 p-1">
                    <span>Freight:</span><b>₹{formatCurrency(data.freightCharge || 0)}</b>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 p-1">
                    <span>Other:</span><b>₹{formatCurrency(data.otherCharges || 0)}</b>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 p-1 font-black bg-gray-50 text-gray-950">
                    <span>Total:</span><b>₹{formatCurrency(data.totalFreight || 0)}</b>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 p-1 text-green-700">
                    <span>Advance:</span><b>-₹{formatCurrency(data.advancePaid || 0)}</b>
                  </div>
                  <div className="flex justify-between p-1 font-black bg-red-50 text-red-700 text-[8.5px]">
                    <span>Balance:</span><b>₹{formatCurrency(data.balanceAmount || 0)}</b>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Block */}
      <div className="border-t border-gray-300 pt-3 flex justify-between items-center text-[7.5px] text-gray-500">
        <span>Generated electronically on {data.date || '2026-05-30'} - No physical sign required.</span>
        <div className="text-center min-w-[150px] relative">
          <span className="text-[7.5px] color-gray-600 block mb-4">For, {company.companyName || 'ROADWE LOGISTICS'}</span>
          
          {company.stamp_img && (
            <img src={company.stamp_img} alt="Stamp" className="absolute h-8 w-auto object-contain opacity-75 bottom-2 right-10 rotate-6" />
          )}
          
          <div className="border-t border-gray-600 font-extrabold text-[8px] text-gray-600 pt-1 tracking-wider">AUTHORIZED SIGNATORY</div>
        </div>
      </div>

    </div>
  );
}
