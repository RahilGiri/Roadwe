import React from 'react';

export default function BiltyTemplate1({ data = {}, company = {}, copyLabel = 'TRANSPORT COPY' }) {
  // Safe helper to convert number to currency format
  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Convert number to words helper (Indian format)
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

  const formattedValueWords = numberToWords(data.valueOfGoods || 9086000);

  return (
    <div className="bilty-print-page w-[210mm] h-[297mm] p-[10mm] bg-white border border-gray-200 flex flex-col justify-between font-sans text-[8.5px] leading-tight select-text relative shadow-sm" style={{ boxSizing: 'border-box' }}>
      
      {/* Top Header Block */}
      <div>
        <div className="flex justify-between items-start border-b border-gray-400 pb-1">
          <div className="flex items-center gap-3">
            {company.logo_img ? (
              <img src={company.logo_img} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="h-10 w-10 bg-blue-900 rounded flex items-center justify-center text-white font-black text-lg">T</div>
            )}
            <div>
              <span className="text-[7.5px] text-blue-700 font-bold block underline">Subject To {company.city || 'VADODARA'} jurisdiction</span>
              <h1 className="text-15 font-black text-black tracking-wide leading-none my-0.5">{company.companyName || 'TRANSCORE LOGISTICS'}</h1>
              <span className="text-[8px] font-extrabold text-blue-900 block tracking-wider uppercase">LOGISTICS &amp; SERVICE PROVIDER</span>
              <span className="text-[7.5px] text-gray-600 block mt-0.5 font-medium">{company.address || 'REGD. OFF. PLOT NO.16 SIKOTARDHAM SOCIETY KARODIYA ROAD BAJWA VADODARA 391310(GUJ) , VADODARA, GUJARAT'}</span>
            </div>
          </div>
          <div className="text-right min-w-[160px]">
            <span className="text-[8.5px] font-extrabold block text-gray-900">Mob: {company.mobile || '9664874523'}</span>
            <div className="inline-block my-1 px-2.5 py-0.5 border border-red-400 bg-red-50 text-red-600 font-extrabold text-[9px] rounded uppercase">
              {copyLabel}
            </div>
            <span className="text-[7.5px] text-gray-800 block"><b>PAN NO :</b> {company.pan || 'CTSPG1070M'}</span>
            <span className="text-[7.5px] text-gray-800 block"><b>GSTIN :</b> {company.gstin || '24CTSPG1070M1ZF'}</span>
          </div>
        </div>

        {/* Schedule, Notice, Insurance, Caution Grid */}
        <div className="grid grid-cols-12 gap-1.5 mt-2">
          {/* Schedule of Demurrage */}
          <div className="col-span-3 border border-gray-700 p-1 rounded-sm bg-white min-h-[60px]">
            <span className="text-[7.5px] font-black block border-b border-gray-400 pb-0.5 text-gray-900 tracking-wider">SCHEDULE OF DEMURAARGE</span>
            <p className="text-[7px] text-gray-800 mt-1 leading-normal">
              Demurrage Chargeable After <b>More than 5 days</b> from the date of arrival Rs. <b>₹{data.demurrageCharge || '500'}</b> Per Day
            </p>
          </div>

          {/* Notice */}
          <div className="col-span-3 border border-gray-700 p-1 rounded-sm bg-white min-h-[60px]">
            <span className="text-[7.5px] font-black block border-b border-gray-400 pb-0.5 text-red-600 tracking-wider">NOTICE</span>
            <p className="text-[6.5px] text-gray-800 mt-0.5 leading-tight">
              We are sending Vehicle no <b className="text-red-700">{data.vehicleNumber || 'UP-70-LT-3066'}</b> as per your order.Please arrange to load the same and check yourself all the paper of the vehicle before loading.You are requested to insure the goods otherwise the company is not liable for any loss or damages.
            </p>
          </div>

          {/* Insurance */}
          <div className="col-span-3 border border-gray-700 p-1 rounded-sm bg-white min-h-[60px] text-[7px]">
            <span className="text-[7.5px] font-black block border-b border-gray-400 pb-0.5 text-gray-900 tracking-wider">INSURANCE</span>
            <p className="mt-0.5">THE CUSTOMER HAS STATED THAT</p>
            <p className="font-extrabold text-[7.5px]">STATUS : {data.insuranceType || 'INSURED'}</p>
            <p>COMPANY : {data.insuranceCompany || ''}</p>
            <p>POLICY NO : {data.insurancePolicyNo || ''}</p>
            <div className="flex justify-between mt-0.5">
              <span>RISK : <b>AT OWNER RISK</b></span>
              <span>GP NO. : <b>8</b></span>
            </div>
          </div>

          {/* Caution */}
          <div className="col-span-3 border border-gray-700 p-1 rounded-sm bg-white min-h-[60px]">
            <div className="flex justify-between items-center border-b border-gray-400 pb-0.5">
              <span className="text-[7.5px] font-black text-gray-900 tracking-wider">AT OWNER RISK</span>
              <span className="text-[7px] text-red-600 font-extrabold">CAUTION</span>
            </div>
            <p className="text-[6.5px] text-gray-800 mt-1 leading-normal">
              This consignment will not be Detained, re-route, diverted or re-book without consignees / consignor bank written permission. it will be delivered at the destination.
            </p>
          </div>
        </div>

        {/* Bilty Details & Vehicle Meta & From/To Route */}
        <div className="grid grid-cols-12 gap-1.5 mt-1.5">
          {/* Bilty Details */}
          <div className="col-span-9 border border-gray-700 p-1 bg-white rounded-sm grid grid-cols-3 gap-2">
            <div>
              <p className="text-[7.5px]">BILTY NO : <b className="text-red-700 text-[8.5px] font-black">{data.biltyNo || 'G/1000011211'}</b></p>
              <p className="text-[7.5px] mt-0.5">Vehicle Size : <span className="font-bold">{data.vehicleSize || '32 FT MXL'}</span></p>
            </div>
            <div>
              <p className="text-[7.5px]">VEHICLE NUMBER : <b className="text-gray-900 text-[8.5px] font-black">{data.vehicleNumber || 'UP-70-LT-3066'}</b></p>
              <p className="text-[7.5px] mt-0.5">SEAL NUMBER : <span className="font-bold">{data.sealNumber || '2675782'}</span></p>
            </div>
            <div>
              <p className="text-[7.5px]">DATE : <b className="text-gray-900 text-[8.5px] font-bold">{data.date || '27-May-2026'}</b></p>
              <p className="text-[6.5px] leading-none mt-0.5 text-gray-700">DELIVERY ADDR: {data.deliveryAddress || '50-A,GIDC ESTATE SURVEY NO.317-318,KALOL,PANCHMAHAL,GUJARAT-389330'}</p>
            </div>
          </div>

          {/* From / To Route Block */}
          <div className="col-span-3 grid grid-rows-2 gap-1">
            <div className="border border-gray-700 px-2 py-0.5 bg-white rounded-sm flex justify-between items-center">
              <span className="text-[7px] text-gray-500 font-bold uppercase">From</span>
              <span className="font-extrabold text-[8.5px] text-gray-950">{data.fromCity || 'SANDILA, UTTAR PRADESH'}</span>
            </div>
            <div className="border border-gray-700 px-2 py-0.5 bg-white rounded-sm flex justify-between items-center">
              <span className="text-[7px] text-gray-500 font-bold uppercase">To</span>
              <span className="font-extrabold text-[8.5px] text-gray-950">{data.toCity || 'KALOL, GUJARAT'}</span>
            </div>
          </div>
        </div>

        {/* Consignor, Consignee, Invoice, Driver Credentials Grid */}
        <div className="grid grid-cols-12 gap-1.5 mt-1.5">
          {/* Consignor Box */}
          <div className="col-span-4 border border-gray-700 rounded-sm bg-white overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="bg-gray-100 text-center font-black py-0.5 border-b border-gray-700 text-gray-900">CONSIGNOR'S DETAILS</div>
            <div className="p-1 flex-1 flex flex-col gap-0.5">
              <p className="flex"><span className="w-12 text-gray-500">NAME :</span> <span className="font-extrabold flex-1 text-gray-950">{data.consignorName || 'INDIA PESTICIDES LTD SANDILA'}</span></p>
              <p className="flex"><span className="w-12 text-gray-500">ADDRESS :</span> <span className="flex-1 text-[7px] text-gray-800 leading-tight">{data.consignorAddress || 'Plot No.d-2 To D-4&k-2 To K-12,l-1,upsidc Industrial Area Sandila-241127,hardoi,uttar Pradesh'}</span></p>
              <p className="flex"><span className="w-12 text-gray-500">EMAIL :</span> <span className="flex-1 text-gray-800">{data.consignorEmail || ''}</span></p>
              <div className="flex justify-between border-t border-gray-100 pt-0.5">
                <p className="flex flex-1"><span className="w-12 text-gray-500">GSTIN :</span> <span className="font-bold text-gray-900">{data.consignorGstin || '09AAACI3591D1ZO'}</span></p>
                <p className="flex flex-1"><span className="w-12 text-gray-500">CONTACT :</span> <span className="text-gray-900">{data.consignorContact || ''}</span></p>
              </div>
              <p className="flex"><span className="w-12 text-gray-500">Bank Name:</span> <span className="text-gray-800">{data.consignorBank || ''}</span></p>
            </div>
          </div>

          {/* Consignee Box */}
          <div className="col-span-4 border border-gray-700 rounded-sm bg-white overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="bg-gray-100 text-center font-black py-0.5 border-b border-gray-700 text-gray-900">CONSIGNEE'S / BUYER'S DETAILS</div>
            <div className="p-1 flex-1 flex flex-col gap-0.5">
              <p className="flex"><span className="w-12 text-gray-500">NAME :</span> <span className="font-extrabold flex-1 text-gray-950">{data.consigneeName || 'ARYSTA LIFE SCIENCE INDIA LTD'}</span></p>
              <p className="flex"><span className="w-12 text-gray-500">ADDRESS :</span> <span className="flex-1 text-[7px] text-gray-800 leading-tight">{data.consigneeAddress || '50-a,gidc Estate Survey No.317-318,kalol,panchmahal,Gujarat-389330'}</span></p>
              <p className="flex"><span className="w-12 text-gray-500">EMAIL :</span> <span className="flex-1 text-gray-800">{data.consigneeEmail || ''}</span></p>
              <div className="flex justify-between border-t border-gray-100 pt-0.5">
                <p className="flex flex-1"><span className="w-12 text-gray-500">GSTIN :</span> <span className="font-bold text-gray-900">{data.consigneeGstin || '24AAACD0557C1ZB'}</span></p>
                <p className="flex flex-1"><span className="w-12 text-gray-500">CONTACT :</span> <span className="text-gray-900">{data.consigneeContact || ''}</span></p>
              </div>
              <p className="flex"><span className="w-12 text-gray-500">Bank Name:</span> <span className="text-gray-800">{data.consigneeBank || ''}</span></p>
            </div>
          </div>

          {/* Invoice / Dispatch Details */}
          <div className="col-span-2 border border-gray-700 rounded-sm bg-white flex flex-col justify-between min-h-[90px] text-[7.5px] p-1">
            <div>
              <div className="font-extrabold border-b border-gray-200 pb-0.5 text-center text-gray-900 uppercase">BILL/INVOICE NO</div>
              <p className="text-center font-bold text-[8.5px] mt-1 text-gray-950">{data.invoiceNumber || 'S/26-27/289'}</p>
            </div>
            <div className="border-t border-b border-gray-200 py-1 my-1">
              <span className="text-[6.5px] text-gray-500 block text-center">BILL/INVOICE DATE</span>
              <p className="text-center font-bold text-gray-900">{data.invoiceDate || '27-06-2026'}</p>
            </div>
            <div>
              <span className="text-[6.5px] text-gray-500 block text-center">E WAY BILL NO</span>
              <p className="text-center font-extrabold text-[8.5px] text-red-700">{data.ewayBill || '431730116534'}</p>
            </div>
          </div>

          {/* Driver Details Box */}
          <div className="col-span-2 border border-gray-700 rounded-sm bg-white flex flex-col justify-between min-h-[90px] text-[7.5px] p-1">
            <div className="flex flex-col gap-0.5">
              <p><span className="text-gray-500 block leading-none">DRIVER NAME :</span> <span className="font-bold text-gray-950">{data.driverName || 'SHYAM BAHADUR GUPTA'}</span></p>
              <p className="mt-0.5"><span className="text-gray-500 block leading-none">DRIVER NUM :</span> <span className="font-bold text-gray-900">{data.driverMobile || '8528214393'}</span></p>
              <p className="mt-0.5"><span className="text-gray-500 block leading-none">DL NUMBER :</span> <span className="text-gray-800">{data.driverDl || 'UP7220140010882'}</span></p>
              <p className="mt-0.5"><span className="text-gray-500 block leading-none">OWNER NAME :</span> <span className="text-gray-800">{data.ownerName || ''}</span></p>
              <p className="mt-0.5"><span className="text-gray-500 block leading-none">OWNER NUMBER :</span> <span className="font-bold text-gray-900">{data.ownerPhone || '8528214393'}</span></p>
            </div>
          </div>
        </div>

        {/* GSTIN PAID BY Banner */}
        <div className="bg-gray-100 border border-gray-700 rounded-sm text-center py-0.5 mt-1.5 font-black text-gray-900 tracking-wider">
          GSTIN PAID BY {data.paidBy?.toUpperCase() || 'CONSIGNOR'}
        </div>

        {/* Table & Financial Breakdown Row */}
        <div className="flex gap-1.5 mt-1.5 items-stretch">
          {/* Material Specs Table (Left) */}
          <table className="flex-1.3 border border-gray-700 border-collapse bg-white">
            <thead>
              <tr className="bg-purple-50 text-[7px] text-gray-950 font-black">
                <th className="border border-gray-700 p-1 text-center w-[18%]">PACKAGING TYPE</th>
                <th className="border border-gray-700 p-1 text-center w-[15%]">NUMBER OF ARTICLE</th>
                <th className="border border-gray-700 p-1 text-center w-[22%]">MATERIAL NAME</th>
                <th className="border border-gray-700 p-1 text-center w-[33%]">DESCRIPTION OF GOOD (SAID TO CONTAIN)</th>
                <th className="border border-gray-700 p-1 text-center w-[12%]">HSN CODE</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center font-bold text-gray-900">
                <td className="border border-gray-700 px-1 py-12 text-center align-top">{data.packingType || 'BAGS'}</td>
                <td className="border border-gray-700 px-1 py-12 text-center align-top text-[10px] text-red-700 font-extrabold">{data.noOfPackages || '700'}</td>
                <td className="border border-gray-700 px-1 py-12 text-center align-top uppercase">{data.materialName || 'CAPTAN TECHNICAL'}</td>
                <td className="border border-gray-700 px-1 py-12 text-center align-top leading-tight font-medium text-gray-800 text-[8px]">{data.goodsDescription || 'CAPTAN TECHNICAL'}</td>
                <td className="border border-gray-700 px-1 py-12 text-center align-top">{data.hsnCode || '38089299'}</td>
              </tr>
            </tbody>
          </table>

          {/* Financial Breakdown Table (Right) */}
          <div className="w-[300px] border border-gray-700 flex flex-col bg-white">
            {/* Weight Sub Header */}
            <div className="flex border-b border-gray-700">
              <div className="w-[45%] border-r border-gray-700 flex flex-col">
                <span className="bg-purple-50 text-center font-bold text-[7px] border-b border-gray-700 py-0.5">WEIGHT</span>
                <div className="flex flex-1 text-center py-1">
                  <div className="flex-1 border-r border-gray-200">
                    <span className="text-[6.5px] block text-gray-500">ACTUAL</span>
                    <b className="text-[9px] text-gray-950 font-black">{data.actualWeight || '17500'} KG</b>
                  </div>
                  <div className="flex-1">
                    <span className="text-[6.5px] block text-gray-500">GUARANTEE</span>
                    <b className="text-[9px] text-gray-950 font-black">{data.chargedWeight || '18000'} KG</b>
                  </div>
                </div>
              </div>
              <div className="w-[20%] border-r border-gray-700 flex flex-col text-center justify-between">
                <span className="bg-purple-50 font-bold text-[7px] border-b border-gray-700 py-0.5">Rate / KG</span>
                <div className="py-2">
                  <b className="text-[9px]">₹{data.rate || '0.00'}</b>
                  <span className="text-[7px] text-gray-500 block font-medium">/ KG</span>
                </div>
              </div>
              <div className="w-[35%] bg-purple-50 text-center font-bold text-[8px] flex items-center justify-center">
                AMOUNT
              </div>
            </div>

            {/* Calculations List */}
            <div className="flex flex-1 text-[8.5px]">
              <div className="w-[65%] border-r border-gray-700 flex flex-col bg-gray-50 font-bold text-gray-800">
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center">FREIGHT AMOUNT</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center">HALTING CHARGE</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center">Bilty Charges</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center">Bilty Charges</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center">OTHER CHARGE</div>
                <div className="flex-1 border-b border-gray-700 px-1.5 py-[2px] flex items-center bg-yellow-50 text-gray-950 font-extrabold">TOTAL AMOUNT</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center text-green-700">ADVANCE AMOUNT</div>
                <div className="flex-1 px-1.5 py-[2px] flex items-center bg-red-50 text-red-700 font-extrabold">BALANCE AMOUNT</div>
              </div>
              <div className="w-[35%] flex flex-col text-right font-extrabold text-gray-950">
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center justify-end">₹{formatCurrency(data.freightCharge || (data.rate * (data.chargedWeight || data.actualWeight || 0)))}</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center justify-end">₹{formatCurrency(data.haltingCharges || 0)}</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center justify-end">₹{formatCurrency(data.laborCharge || 0)}</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center justify-end">₹{formatCurrency(0)}</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center justify-end">₹{formatCurrency(data.otherCharges || 0)}</div>
                <div className="flex-1 border-b border-gray-700 px-1.5 py-[2px] flex items-center justify-end bg-yellow-50 text-[9px] font-black text-gray-900">₹{formatCurrency(data.totalFreight || 0)}</div>
                <div className="flex-1 border-b border-gray-200 px-1.5 py-[2px] flex items-center justify-end text-green-700">₹{formatCurrency(data.advancePaid || 0)}</div>
                <div className="flex-1 px-1.5 py-[2px] flex items-center justify-end bg-red-50 text-[9px] font-black text-red-700">₹{formatCurrency(data.balanceAmount || 0)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Receiver Sign & Remak Status Box */}
        <div className="grid grid-cols-12 gap-1.5 mt-1.5">
          <div className="col-span-4 border border-gray-700 p-1 rounded-sm bg-white min-h-[45px]">
            <span className="text-[7.5px] font-black block border-b border-gray-200 pb-0.5 text-gray-900">RECEIVING USE ONLY</span>
            <div className="mt-1 font-bold text-gray-800 text-[7px] flex flex-col gap-0.5">
              <p>RECEIVER NAME : ____________________</p>
              <p>RECEIVER NUMBER : __________________</p>
            </div>
          </div>
          <div className="col-span-3 border border-gray-700 p-1 rounded-sm bg-white min-h-[45px]">
            <span className="text-[7.5px] font-black block border-b border-gray-200 pb-0.5 text-gray-900">REMARK</span>
            <p className="mt-1 text-[7px] text-gray-800">{data.remarks || ''}</p>
          </div>
          <div className="col-span-2 border border-gray-700 p-1 rounded-sm bg-white min-h-[45px]">
            <span className="text-[7.5px] font-black block border-b border-gray-200 pb-0.5 text-gray-900">STATUS</span>
            <span className="inline-block mt-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-black text-[7.5px] uppercase">
              {data.deliveryStatus || 'PENDING'}
            </span>
          </div>
          <div className="col-span-3 border border-gray-700 p-1 rounded-sm bg-white min-h-[45px] text-center flex flex-col justify-between items-center">
            <span className="text-[7px] font-extrabold text-gray-500 uppercase">Authentication</span>
            <div className="w-[80%] border-t border-dashed border-gray-400 mt-5 pt-0.5 text-[7px] text-gray-500">RECEIVER SIGN</div>
          </div>
        </div>

        {/* Bank Account Details Grid */}
        <div className="border border-gray-700 p-1 rounded-sm bg-white mt-1.5">
          <span className="text-[7.5px] font-black block border-b border-gray-200 pb-0.5 text-blue-900 uppercase">BANK ACCOUNT DETAILS</span>
          <div className="grid grid-cols-3 gap-3 mt-1 text-[7.5px]">
            <div className="flex flex-col gap-0.5">
              <p><span className="text-gray-500">BANK ACCOUNT NO. :</span> <b className="text-gray-900 font-extrabold">50200108804813</b></p>
              <p><span className="text-gray-500">IFSC CODE :</span> <b className="text-gray-900">HDFC0008785</b></p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p><span className="text-gray-500">A/C HOLDER NAME :</span> <b className="text-gray-900">TRANSCORE LOGISTICS</b></p>
              <p><span className="text-gray-500">BANK NAME :</span> <b className="text-gray-900">HDFC BANK</b></p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p><span className="text-gray-500">PAN CARD NAME :</span> <b className="text-gray-900"></b></p>
              <p><span className="text-gray-500">PAN NUMBER :</span> <b className="text-gray-900">CTSPG1070M</b></p>
            </div>
          </div>
        </div>
      </div>

      {/* Value statement & Bottom Stamp box */}
      <div className="border-t border-gray-400 pt-2">
        <div className="flex justify-between items-end">
          <div className="flex-1 pr-6 flex flex-col gap-1 text-[7.5px] text-gray-800">
            <p className="font-extrabold uppercase text-gray-950">VALUES OF GOODS : <span className="text-red-700 text-[8px] font-black">{data.valueOfGoods || '9086000'}</span> ( {formattedValueWords} )</p>
            <p><b>REMARK :</b> {data.remarks || ''}</p>
            <p><b>BRANCH OFFICE ADDRESS:</b> F-403 VILLAGE DASHHRATH FERTILIZERNAGAR VADODARA-391310 GUJARAT</p>
            <p className="text-[6.5px] text-gray-500 mt-1 italic">This electronic generated pdf does not require any physical signature. Date : {data.date || '2026-05-27'} 19:20:45</p>
          </div>
          
          <div className="w-[180px] border border-gray-500 p-2 rounded-sm text-center bg-white flex flex-col justify-between items-center min-h-[65px] relative">
            <span className="text-[7.5px] font-black text-gray-900 block leading-none">FOR, {company.companyName || 'TRANSCORE LOGISTICS'}</span>
            
            {/* Transporter Stamp image absolute layout overlay */}
            {company.stamp_img ? (
              <img src={company.stamp_img} alt="Stamp" className="absolute h-10 w-auto object-contain opacity-85 bottom-4 z-10" />
            ) : (
              <div className="absolute h-10 w-28 border border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-extrabold text-[8px] opacity-25 rotate-12 bottom-3 tracking-widest uppercase">TRANSCORE LOGISTICS</div>
            )}
            
            <div className="w-[90%] border-t border-gray-500 mt-6 pt-1 text-[7.5px] text-gray-500 uppercase font-bold tracking-wide z-20">AUTHORIZE SIGNATURE</div>
          </div>
        </div>
      </div>

    </div>
  );
}
