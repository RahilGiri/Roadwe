const { getModel } = require('../config/db');
const { BiltyTemplateSchema, TransporterTemplateSettingsSchema } = require('../models/schemas');

const BiltyTemplate = getModel('BiltyTemplate', BiltyTemplateSchema);
const TransporterTemplateSettings = getModel('TransporterTemplateSettings', TransporterTemplateSettingsSchema);

// --- 5 Unique Bilty Templates Seed Data Definition ---
const defaultTemplates = [
  {
    template_name: "Standard Classic LR",
    template_code: "classic_lr",
    preview_image: "/bilty_format_1.jpg",
    css_styles: `
      .bilty-wrapper { font-family: 'Inter', sans-serif; color: #0f172a; padding: 20px; box-sizing: border-box; }
      .bilty-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-bottom: 10px; }
      .bilty-meta-grid { display: grid; grid-template-columns: 1.2fr 1.2fr 1fr 1.6fr 1fr; gap: 6px; margin-bottom: 8px; }
      .bilty-info-grid { display: grid; grid-template-columns: 1.5fr 1.5fr 1.2fr 1.2fr; gap: 6px; margin-bottom: 8px; }
      .bilty-box { border: 1px solid #475569; padding: 6px; border-radius: 3px; background: #ffffff; min-height: 70px; }
      .bilty-box-title { font-weight: 800; font-size: 8px; text-transform: uppercase; color: #0f172a; border-bottom: 1px dashed #475569; padding-bottom: 3px; margin-bottom: 4px; display: flex; justify-content: space-between; }
      .bilty-box-content p { margin: 0 0 2px 0; font-size: 8.5px; }
      .bilty-table { width: 100%; border-collapse: collapse; margin-top: 4px; margin-bottom: 8px; }
      .bilty-table th, .bilty-table td { border: 1px solid #475569; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 8.5px; }
      .bilty-table th { background-color: #f8fafc; font-weight: 800; text-transform: uppercase; font-size: 8px; }
    `,
    html_structure: `
      <div class="bilty-wrapper">
        <div class="bilty-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="{{company_logo}}" alt="Logo" style="height: 48px; object-fit: contain;" onerror="this.style.display='none'" />
            <div>
              <span style="font-size: 8px; color: #64748b; display: block;">Subject To {{jurisdiction}} jurisdiction</span>
              <h1 style="font-size: 15px; font-weight: 900; color: #ef4444; margin: 2px 0 0 0;">{{company_name}}</h1>
              <span style="font-size: 8px; font-weight: 700; color: #1e293b; display: block;">FLEET OWNER/TRANSPORT CONTRACTOR AND BROKER</span>
              <span style="font-size: 7.5px; color: #475569; display: block;">{{company_address}}</span>
            </div>
          </div>
          <div style="text-align: right; min-width: 150px;">
            <span style="font-size: 8.5px; font-weight: 800; display: block;">Mob: {{company_mobile}}</span>
            <div style="display: inline-block; margin: 4px 0; padding: 3px 8px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 4px; color: #ef4444; font-size: 9px; font-weight: 800;">
              CONSIGNOR COPY
            </div>
            <span style="font-size: 8px; display: block;"><b>PAN NO:</b> {{company_pan}}</span>
            <span style="font-size: 8px; display: block;"><b>GSTIN:</b> {{company_gstin}}</span>
          </div>
        </div>

        <div class="bilty-meta-grid">
          <div class="bilty-box">
            <div class="bilty-box-title"><span>SCHEDULE OF DEMURRAGE</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 8px;">Demurrage Chargeable After grace 24 hours.</p>
              <p style="font-size: 8px;">Rate: <b>₹{{demurrage_charge}}</b> / Day</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>INSURANCE</span></div>
            <div class="bilty-box-content">
              <p>THE CUSTOMER HAS STATED THAT STATUS: <b>NON INSURED</b></p>
              <p>COMPANY: N/A • POLICY NO: N/A</p>
              <p>RISK: <b>AT OWNER RISK</b></p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>AT OWNER RISK</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 7.5px; color: #ef4444; font-weight: 700;">CAUTION</p>
              <p style="font-size: 7px; line-height: 1.2;">This consignment will not be Detained, re-route, diverted or re-booked without consignees/consignor bank written permission.</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>CONSIGNMENT DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>BILTY NO:</b> <span style="color: #dc2626; font-weight: 700;">{{bilty_number}}</span></p>
              <p><b>DATE:</b> {{date}}</p>
              <p><b>VEHICLE NO:</b> {{vehicle_number}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>ROUTE</span></div>
            <div class="bilty-box-content" style="display: flex; flex-direction: column; gap: 4px;">
              <div><span style="font-size: 8px; color: #64748b;">From</span><p style="font-weight: 700; margin: 0;">{{from_city}}</p></div>
              <div><span style="font-size: 8px; color: #64748b;">To</span><p style="font-weight: 700; margin: 0;">{{to_city}}</p></div>
            </div>
          </div>
        </div>

        <div class="bilty-info-grid">
          <div class="bilty-box" style="min-height: 90px;">
            <div class="bilty-box-title" style="color: #ef4444;"><span>CONSIGNOR'S DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>NAME:</b> {{consignor_name}}</p>
              <p><b>ADDRESS:</b> {{consignor_address}}</p>
              <p><b>EMAIL:</b> {{consignor_email}}</p>
              <p><b>GSTIN:</b> {{consignor_gstin}} • <b>CONTACT:</b> {{consignor_contact}}</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 90px;">
            <div class="bilty-box-title" style="color: #ef4444;"><span>CONSIGNEE'S DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>NAME:</b> {{consignee_name}}</p>
              <p><b>ADDRESS:</b> {{consignee_address}}</p>
              <p><b>EMAIL:</b> {{consignee_email}}</p>
              <p><b>GSTIN:</b> {{consignee_gstin}} • <b>CONTACT:</b> {{consignee_contact}}</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 90px;">
            <div class="bilty-box-title"><span>BILL/INVOICE NO</span></div>
            <div class="bilty-box-content">
              <p><b>INVOICE NO:</b> {{invoice_number}}</p>
              <p><b>INVOICE DATE:</b> {{invoice_date}}</p>
              <p style="margin-top: 8px;"><b>E WAY BILL NO:</b></p>
              <p style="font-weight: 700; margin: 0;">{{eway_bill}}</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 90px;">
            <div class="bilty-box-title"><span>DRIVER / TRUCK CREDENTIALS</span></div>
            <div class="bilty-box-content">
              <p><b>DRIVER NAME:</b> {{driver_name}}</p>
              <p><b>DRIVER NUM:</b> {{driver_mobile}}</p>
              <p><b>DL NUMBER:</b> {{driver_dl}}</p>
              <p><b>OWNER NAME:</b> {{owner_name}}</p>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="flex: 1.4;">
            <table class="bilty-table" style="height: 100%;">
              <thead>
                <tr>
                  <th>PACKAGING TYPE</th>
                  <th>NUMBER OF ARTICLE</th>
                  <th>MATERIAL NAME</th>
                  <th>DESCRIPTION OF GOOD (SAID TO CONTAIN)</th>
                  <th>HSN CODE</th>
                </tr>
              </thead>
              <tbody>
                <tr style="height: 120px;">
                  <td>{{packing_type}}</td>
                  <td>{{no_of_packages}}</td>
                  <td>{{material_name}}</td>
                  <td>{{goods_description}}</td>
                  <td>{{hsn_code}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="flex: 1;">
            <table class="bilty-table">
              <thead>
                <tr>
                  <th colspan="2" style="text-align: center;">WEIGHT</th>
                  <th style="text-align: center;">Rate / MT</th>
                  <th style="text-align: center;">AMOUNT</th>
                </tr>
                <tr>
                  <th style="font-size: 7.5px;">ACTUAL</th>
                  <th style="font-size: 7.5px;">GUARANTEE</th>
                  <th style="font-size: 7.5px;">/ MT</th>
                  <th style="font-size: 7.5px;">FREIGHT CHARGES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center; height: 120px;"><b>{{actual_weight}}</b><br />Tons</td>
                  <td style="text-align: center;"><b>{{guarantee_weight}}</b><br />Tons</td>
                  <td style="text-align: center;"><b>₹{{rate}}</b></td>
                  <td style="padding: 0;">
                    <div style="display: flex; flex-direction: column; font-size: 8px;">
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #475569; padding: 2px 4px;">
                        <span>Freight Amt:</span><b>₹{{freight_amount}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #475569; padding: 2px 4px;">
                        <span>Other Chg:</span><b>₹{{other_charges}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #475569; padding: 2px 4px; background: #f8fafc; font-weight: 800;">
                        <span>Total Amt:</span><b>₹{{total_freight}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #475569; padding: 2px 4px;">
                        <span>Less - Adv:</span><b>₹{{advance_paid}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 2px 4px; background: #fef2f2; color: #dc2626; font-weight: 900;">
                        <span>Balance:</span><b>₹{{balance_amount}}</b>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <div class="bilty-box" style="flex: 1.4; min-height: 60px;">
            <div class="bilty-box-title"><span>RECEIVING USE ONLY</span></div>
            <div style="display: flex; gap: 10px; font-size: 8px;">
              <div style="flex: 1;">
                <p><b>RECEIVER NAME:</b> ___________________</p>
                <p><b>CONTACT NO:</b> _____________________</p>
              </div>
              <div style="flex: 1;">
                <p><b>DELIVERY STATUS:</b> OK [ ] DAMAGE [ ]</p>
              </div>
            </div>
          </div>
          <div class="bilty-box" style="flex: 1; min-height: 60px;">
            <div class="bilty-box-title"><span>VALUE & GST DECLARED</span></div>
            <div class="bilty-box-content">
              <p><b>VALUE OF GOODS:</b> ₹{{value_of_goods}}</p>
              <p><b>GST PAID BY:</b> <span style="font-weight: 700; color: #dc2626;">{{gst_paid_by}}</span></p>
            </div>
          </div>
          <div class="bilty-box" style="flex: 0.8; min-height: 60px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 6px;">
            <span style="font-size: 7px; font-weight: 800; color: #64748b;">For, {{company_name}}</span>
            <img src="{{company_stamp}}" alt="Stamp" style="height: 32px; object-fit: contain;" onerror="this.style.display='none'" />
            <div style="width: 80%; border-top: 1px solid #475569; margin-top: 4px; font-size: 7.5px; color: #64748b;">AUTHORIZE SIGNATURE</div>
          </div>
        </div>
      </div>
    `
  },
  {
    template_name: "Triple-Split Dispatch Summary",
    template_code: "triple_split",
    preview_image: "/bilty_format_2.jpg",
    css_styles: `
      .bilty-wrapper { font-family: 'Inter', sans-serif; color: #0f172a; padding: 20px; box-sizing: border-box; }
      .bilty-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #475569; padding-bottom: 8px; margin-bottom: 12px; }
      .bilty-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
      .bilty-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
      .bilty-box { border: 1px solid #475569; padding: 8px; border-radius: 4px; background: #ffffff; min-height: 75px; }
      .bilty-box-title { font-weight: 800; font-size: 8.5px; text-transform: uppercase; color: #1e293b; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
      .bilty-box-content p { margin: 0 0 3px 0; font-size: 9px; }
      .bilty-table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; }
      .bilty-table th, .bilty-table td { border: 1.5px solid #475569; padding: 6px 8px; text-align: left; vertical-align: top; font-size: 9px; }
      .bilty-table th { background-color: #f1f5f9; font-weight: 800; text-transform: uppercase; font-size: 8.5px; }
    `,
    html_structure: `
      <div class="bilty-wrapper">
        <div class="bilty-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="{{company_logo}}" alt="Logo" style="height: 40px; object-fit: contain;" onerror="this.style.display='none'" />
            <div>
              <h1 style="font-size: 14px; font-weight: 800; color: #1e293b; margin: 0;">{{company_name}}</h1>
              <span style="font-size: 8px; color: #64748b;">TRIP DISPATCH REPORT & CONSIGNMENT RECEIPT</span>
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="font-size: 13px; font-weight: 900; color: #475569; margin: 0;">DELIVERY ADVICE</h2>
            <span style="font-size: 8.5px; color: #334155;"><b>Bilty No:</b> {{bilty_number}} • <b>Date:</b> {{date}}</span>
          </div>
        </div>

        <div class="bilty-grid-3">
          <div class="bilty-box">
            <div class="bilty-box-title" style="color: #475569;"><span>CONSIGNMENT SUMMARY</span></div>
            <div class="bilty-box-content">
              <p><b>LR Number:</b> {{bilty_number}}</p>
              <p><b>Dispatch Date:</b> {{date}}</p>
              <p><b>Invoice No:</b> {{invoice_number}}</p>
              <p><b>E-Way Bill:</b> {{eway_bill}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title" style="color: #475569;"><span>ROUTE & PLACES</span></div>
            <div class="bilty-box-content">
              <p><b>Origin Location:</b> {{from_city}}</p>
              <p><b>Destination City:</b> {{to_city}}</p>
              <p style="margin-top: 4px; font-size: 8px; line-height: 1.2;"><b>Delivery Address:</b> {{consignee_address}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title" style="color: #475569;"><span>TRIP & VEHICLE PARAMETERS</span></div>
            <div class="bilty-box-content">
              <p><b>Vehicle Number:</b> {{vehicle_number}}</p>
              <p><b>Owner:</b> {{owner_name}}</p>
              <p><b>Driver:</b> {{driver_name}} ({{driver_mobile}})</p>
            </div>
          </div>
        </div>

        <div class="bilty-grid-2">
          <div class="bilty-box">
            <div class="bilty-box-title" style="color: #ef4444;"><span>CONSIGNOR (SENDER)</span></div>
            <div class="bilty-box-content">
              <p style="font-weight: 700; color: #0f172a;">{{consignor_name}}</p>
              <p>{{consignor_address}}</p>
              <p><b>GSTIN:</b> {{consignor_gstin}} • <b>Contact:</b> {{consignor_contact}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title" style="color: #ef4444;"><span>CONSIGNEE (RECEIVER)</span></div>
            <div class="bilty-box-content">
              <p style="font-weight: 700; color: #0f172a;">{{consignee_name}}</p>
              <p>{{consignee_address}}</p>
              <p><b>GSTIN:</b> {{consignee_gstin}} • <b>Contact:</b> {{consignee_contact}}</p>
            </div>
          </div>
        </div>

        <table class="bilty-table">
          <thead>
            <tr>
              <th>PARTICULARS OF CONSIGNMENT</th>
              <th style="width: 80px; text-align: center;">ARTICLES</th>
              <th style="width: 100px; text-align: center;">WEIGHT (MT)</th>
              <th style="width: 100px; text-align: center;">RATE / MT</th>
              <th style="width: 120px; text-align: center;">TOTAL FREIGHT</th>
            </tr>
          </thead>
          <tbody>
            <tr style="height: 120px;">
              <td>
                <div style="font-weight: 700; font-size: 10px; color: #1e293b;">{{material_name}}</div>
                <div style="font-size: 8px; color: #64748b; margin-top: 4px; line-height: 1.3;">
                  {{goods_description}}<br/>
                  <b>E-Way Bill:</b> {{eway_bill}} • <b>Invoice:</b> {{invoice_number}} • <b>Decl. Value:</b> ₹{{value_of_goods}}
                </div>
              </td>
              <td style="text-align: center;">{{no_of_packages}}<br/><span style="font-size: 8px; color: #64748b;">{{packing_type}}</span></td>
              <td style="text-align: center;"><b>{{actual_weight}}</b> MT</td>
              <td style="text-align: center;"><b>₹{{rate}}</b></td>
              <td style="padding: 0;">
                <div style="display: flex; flex-direction: column; font-size: 8.5px;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding: 4px 6px;">
                    <span>Freight:</span><b>₹{{freight_amount}}</b>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding: 4px 6px;">
                    <span>Other Chg:</span><b>₹{{other_charges}}</b>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding: 4px 6px; font-weight: 800; background-color: #f8fafc;">
                    <span>Total:</span><b>₹{{total_freight}}</b>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding: 4px 6px; color: #16a34a;">
                    <span>Advance:</span><b>-₹{{advance_paid}}</b>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 4px 6px; font-weight: 900; color: #dc2626; background-color: #fef2f2;">
                    <span>Balance:</span><b>₹{{balance_amount}}</b>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 10px;">
          <span style="font-size: 7.5px; color: #64748b;">Generated electronically on {{date}} - No physical sign required.</span>
          <div style="text-align: center; min-width: 150px;">
            <span style="font-size: 7.5px; color: #475569; display: block; margin-bottom: 15px;">For, {{company_name}}</span>
            <div style="border-top: 1px solid #475569; font-size: 8px; color: #64748b; padding-top: 3px;">AUTHORIZED SIGNATORY</div>
          </div>
        </div>
      </div>
    `
  },
  {
    template_name: "Relational Corporate Format",
    template_code: "relational",
    preview_image: "/bilty_format_3.jpg",
    css_styles: `
      .bilty-wrapper { font-family: 'Inter', sans-serif; color: #0f172a; padding: 20px; box-sizing: border-box; }
      .bilty-header { display: flex; justify-content: space-between; border: 1px solid #0066cc; border-radius: 4px; padding: 10px; margin-bottom: 12px; }
      .bilty-meta-pills { display: flex; justify-content: center; gap: 20px; margin-bottom: 10px; }
      .bilty-pill { border: 1px solid #0066cc; padding: 3px 15px; border-radius: 4px; font-size: 8.5px; }
      .bilty-grid-left-right { display: flex; gap: 8px; margin-bottom: 10px; }
      .bilty-box { border: 1px solid #0066cc; padding: 6px; border-radius: 3px; background: #ffffff; min-height: 70px; }
      .bilty-box-title { font-weight: 800; font-size: 8.5px; text-transform: uppercase; color: #0066cc; border-bottom: 1px dashed #0066cc; padding-bottom: 3px; margin-bottom: 4px; }
      .bilty-box-content p { margin: 0 0 2px 0; font-size: 8.5px; }
      .bilty-table { width: 100%; border-collapse: collapse; margin-top: 4px; margin-bottom: 8px; }
      .bilty-table th, .bilty-table td { border: 1px solid #0066cc; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 8.5px; }
      .bilty-table th { background-color: #eff6ff; font-weight: 800; text-transform: uppercase; font-size: 8px; color: #0066cc; }
    `,
    html_structure: `
      <div class="bilty-wrapper">
        <div class="bilty-header">
          <div style="display: flex; gap: 10px; align-items: center;">
            <div style="border: 2px solid #0066cc; padding: 4px; border-radius: 4px;">
              <img src="{{company_logo}}" alt="Logo" style="height: 32px; object-fit: contain;" onerror="this.style.display='none'" />
            </div>
            <div>
              <span style="font-size: 7.5px; color: #0066cc; display: block;">Subject To {{jurisdiction}} jurisdiction</span>
              <h1 style="font-size: 14px; font-weight: 900; color: #0066cc; margin: 0;">{{company_name}}</h1>
              <span style="font-size: 8px; color: #64748b; display: block;">FLEET OWNER/TRANSPORT CONTRACTOR AND BROKER</span>
              <span style="font-size: 7.5px; color: #475569; display: block;">{{company_address}}</span>
            </div>
          </div>
          <div style="text-align: right; min-width: 120px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="font-size: 8px; display: block;">Mob: {{company_mobile}}</span>
            </div>
            <div style="background: #fef2f2; border: 1px solid #ef4444; color: #ef4444; padding: 2px 4px; font-size: 8px; font-weight: bold; display: inline-block; border-radius: 3px; text-align: center; align-self: flex-end;">
              CONSIGNOR COPY
            </div>
          </div>
        </div>

        <div class="bilty-meta-pills">
          <div class="bilty-pill"><b>PAN NO :</b> {{company_pan}}</div>
          <div class="bilty-pill"><b>GSTIN :</b> {{company_gstin}}</div>
          <div class="bilty-pill" style="color: #dc2626;"><b>Consignment No:</b> {{bilty_number}}</div>
          <div class="bilty-pill"><b>Date:</b> {{date}}</div>
        </div>

        <div class="bilty-grid-left-right">
          <div style="flex: 1.5; display: flex; flex-direction: column; gap: 6px;">
            <div class="bilty-box" style="min-height: 60px;">
              <div class="bilty-box-title" style="color: #0066cc;"><span>FROM : CONSIGNOR</span></div>
              <div class="bilty-box-content">
                <p><b>CONSIGNOR:</b> {{consignor_name}}</p>
                <p><b>ADDRESS:</b> {{consignor_address}}</p>
                <p><b>GSTIN:</b> {{consignor_gstin}} • <b>CONTACT:</b> {{consignor_contact}}</p>
              </div>
            </div>
            <div class="bilty-box" style="min-height: 60px;">
              <div class="bilty-box-title" style="color: #0066cc;"><span>TO : CONSIGNEE</span></div>
              <div class="bilty-box-content">
                <p><b>CONSIGNEE:</b> {{consignee_name}}</p>
                <p><b>ADDRESS:</b> {{consignee_address}}</p>
                <p><b>GSTIN:</b> {{consignee_gstin}} • <b>CONTACT:</b> {{consignee_contact}}</p>
              </div>
            </div>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
            <div class="bilty-box" style="min-height: 60px;">
              <div class="bilty-box-title"><span>DRIVER & TRUCK INFO</span></div>
              <div class="bilty-box-content">
                <p><b>DRIVER NAME:</b> {{driver_name}}</p>
                <p><b>DRIVER MOBILE NO:</b> {{driver_mobile}}</p>
                <p><b>DRIVER DL NO:</b> {{driver_dl}}</p>
                <p><b>TRUCK OWNER NAME:</b> {{owner_name}}</p>
              </div>
            </div>
            
            <div class="bilty-box" style="min-height: 60px;">
              <div class="bilty-box-title"><span>INSURANCE & RISK</span></div>
              <div class="bilty-box-content">
                <p style="color: #dc2626; font-weight: 800;"><b>AT OWNER RISK</b></p>
                <p><b>INSURANCE:</b> NON INSURED</p>
              </div>
            </div>
          </div>
        </div>

        <table class="bilty-table">
          <thead>
            <tr>
              <th>NO. OF ARTICLE</th>
              <th>MATERIAL NAME</th>
              <th>DESCRIPTION OF GOOD (SAID TO CONTAIN)</th>
              <th>HSN CODE</th>
              <th>CHARGED HEAD</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; height: 110px;"><b>{{no_of_packages}}</b><br />{{packing_type}}</td>
              <td><b>{{material_name}}</b></td>
              <td>
                {{goods_description}}<br />
                <span style="font-size: 7.5px; color: #64748b;">Actual Wt: {{actual_weight}} Tons • Guarantee Wt: {{guarantee_weight}} Tons</span>
              </td>
              <td>{{hsn_code}}</td>
              <td style="padding: 0;">
                <div style="display: flex; flex-direction: column; font-size: 8px;">
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc;">FREIGHT CHARGES ({{rate}} / MT)</div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc;">FREIGHT AMOUNT</div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc;">OTHER CHARGE</div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc; font-weight: 800; background: #f8fafc;">TOTAL AMOUNT</div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc; color: #16a34a;">ADVANCE AMOUNT</div>
                  <div style="padding: 2px 4px; font-weight: 900; color: #dc2626; background: #fef2f2;">BALANCE AMOUNT</div>
                </div>
              </td>
              <td style="padding: 0; text-align: right;">
                <div style="display: flex; flex-direction: column; font-size: 8px; text-align: right;">
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc;"><b>₹{{rate}}</b></div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc;"><b>₹{{freight_amount}}</b></div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc;"><b>₹{{other_charges}}</b></div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc; font-weight: 800; background: #f8fafc;"><b>₹{{total_freight}}</b></div>
                  <div style="padding: 2px 4px; border-bottom: 1px solid #0066cc; color: #16a34a;"><b>₹{{advance_paid}}</b></div>
                  <div style="padding: 2px 4px; font-weight: 900; color: #dc2626; background: #fef2f2;"><b>₹{{balance_amount}}</b></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="border: 1px solid #0066cc; border-radius: 4px; padding: 6px; margin-bottom: 10px; background: #eff6ff;">
          <span style="font-size: 8px; font-weight: 800; color: #0066cc; display: block; border-bottom: 1px dashed #0066cc; padding-bottom: 3px; margin-bottom: 4px;">🏦 SETTLEMENT BANK ACCOUNT DETAILS</span>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 8px;">
            <div>
              <p style="margin: 0 0 2px 0;"><b>BANK ACCOUNT NUMBER:</b> 54092010010009</p>
              <p style="margin: 0 0 2px 0;"><b>IFSC CODE:</b> SBIN0554009</p>
            </div>
            <div>
              <p style="margin: 0 0 2px 0;"><b>A/C HOLDER NAME:</b> {{company_name}}</p>
              <p style="margin: 0 0 2px 0;"><b>BANK NAME:</b> IDBI Bank</p>
            </div>
            <div>
              <p style="margin: 0 0 2px 0;"><b>DAILY SERVICE:</b> ALL OVER INDIA</p>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 7px; color: #475569; border-top: 1px solid #0066cc; padding-top: 8px;">
          <div style="flex: 1.5;">
            <p style="margin: 0 0 4px 0; font-weight: bold;">DECLARATION BY CONSIGNOR:</p>
            <p style="margin: 0; line-height: 1.2;">CARRIERS IS NOT RESPONSIBLE FOR LEAKAGE AND BREAKAGE HEREBY SOLEMNLY DECLARE TO THE TRANSPORT OPERATOR ALL CONCERNED THAT PARTICULARS OF THE CONSIGNMENT MENTIONED IN THE LORRY RECEIPT ARE TRUE AND CORRECT AND CORRESPOND TO THE ENTRIES AND DESCRIPTION IN OUR BOOK OF ACCOUNTS AND OTHER RELATED DOCUMENTS IN OUR POSSESSION OF CONTROL.</p>
          </div>
          <div style="flex: 0.5; text-align: center; align-self: center;">
            <span style="font-size: 8px; border: 1px solid #475569; padding: 3px 8px;"><b>GST PAID BY:</b> {{gst_paid_by}}</span>
          </div>
          <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center;">
            <span style="font-weight: bold; font-size: 7.5px; margin-bottom: 15px;">For, {{company_name}}</span>
            <img src="{{company_stamp}}" alt="Stamp" style="height: 30px; object-fit: contain;" onerror="this.style.display='none'" />
            <div style="width: 80%; border-top: 1px solid #475569; font-size: 7.5px; color: #64748b;">AUTHORIZE SIGNATURE</div>
          </div>
        </div>
      </div>
    `
  },
  {
    template_name: "Modern Grid Invoice-style",
    template_code: "invoice_style",
    preview_image: "/bilty_format_4.jpg",
    css_styles: `
      .bilty-wrapper { font-family: 'Inter', sans-serif; color: #0f172a; padding: 20px; box-sizing: border-box; }
      .bilty-header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
      .bilty-box-4 { display: grid; grid-template-columns: 1.2fr 1.2fr 1fr 1fr; gap: 6px; margin-bottom: 8px; }
      .bilty-box-5 { display: grid; grid-template-columns: 1.1fr 1.1fr 1.1fr 1fr 1fr; gap: 6px; margin-bottom: 8px; }
      .bilty-box { border: 1px solid #000000; padding: 6px; border-radius: 3px; background: #ffffff; min-height: 85px; }
      .bilty-box-title { font-weight: 800; font-size: 8px; text-transform: uppercase; color: #0f172a; border-bottom: 1px dashed #000000; padding-bottom: 3px; margin-bottom: 4px; }
      .bilty-box-content p { margin: 0 0 2px 0; font-size: 8.5px; }
      .bilty-table { width: 100%; border-collapse: collapse; margin-top: 4px; margin-bottom: 8px; }
      .bilty-table th, .bilty-table td { border: 1px solid #000000; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 8.5px; }
      .bilty-table th { background-color: #f8fafc; font-weight: 800; text-transform: uppercase; font-size: 8px; }
    `,
    html_structure: `
      <div class="bilty-wrapper">
        <div class="bilty-header">
          <div style="display: flex; gap: 10px; align-items: center;">
            <img src="{{company_logo}}" alt="Logo" style="height: 38px; object-fit: contain;" onerror="this.style.display='none'" />
            <div>
              <span style="font-size: 7.5px; color: #64748b; display: block;">Subject To {{jurisdiction}} jurisdiction</span>
              <h1 style="font-size: 13.5px; font-weight: 900; color: #1e293b; margin: 0;">{{company_name}}</h1>
              <span style="font-size: 7.5px; color: #475569; display: block;">TRANSPORT ALL TYPE OF GOODS & SERVICES</span>
              <span style="font-size: 7.5px; color: #475569; display: block;">{{company_address}}</span>
            </div>
          </div>
          <div style="text-align: right; min-width: 120px;">
            <span style="font-size: 8px; display: block;">Mob: {{company_mobile}}</span>
            <div style="background: #000; color: #fff; padding: 1px 6px; font-size: 7.5px; font-weight: bold; display: inline-block; border-radius: 2px; margin-top: 2px;">
              CONSIGNOR COPY
            </div>
            <span style="font-size: 7.5px; display: block; margin-top: 2px;">PAN NO: {{company_pan}}</span>
            <span style="font-size: 7.5px; display: block;">GSTIN: {{company_gstin}}</span>
          </div>
        </div>

        <div class="bilty-box-4">
          <div class="bilty-box">
            <div class="bilty-box-title"><span>CONSIGNOR'S DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>NAME:</b> {{consignor_name}}</p>
              <p><b>ADDRESS:</b> {{consignor_address}}</p>
              <p><b>EMAIL:</b> {{consignor_email}}</p>
              <p><b>GSTIN:</b> {{consignor_gstin}} • <b>CONTACT:</b> {{consignor_contact}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>CONSIGNEE'S / BUYER'S DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>NAME:</b> {{consignee_name}}</p>
              <p><b>ADDRESS:</b> {{consignee_address}}</p>
              <p><b>EMAIL:</b> {{consignee_email}}</p>
              <p><b>GSTIN:</b> {{consignee_gstin}} • <b>CONTACT:</b> {{consignee_contact}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>BILL/INVOICE NO</span></div>
            <div class="bilty-box-content">
              <p><b>INVOICE NO:</b> {{invoice_number}}</p>
              <p><b>INVOICE DATE:</b> {{invoice_date}}</p>
              <p style="margin-top: 8px;"><b>E WAY BILL NO:</b></p>
              <p style="font-weight: 700; margin: 0;">{{eway_bill}}</p>
            </div>
          </div>
          <div class="bilty-box">
            <div class="bilty-box-title"><span>DRIVER CREDENTIALS</span></div>
            <div class="bilty-box-content">
              <p><b>DRIVER NAME:</b> {{driver_name}}</p>
              <p><b>DRIVER NUM:</b> {{driver_mobile}}</p>
              <p><b>DL NUMBER:</b> {{driver_dl}}</p>
              <p><b>OWNER NAME:</b> {{owner_name}}</p>
            </div>
          </div>
        </div>

        <div class="bilty-box-5">
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title"><span>INSURANCE</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 7.5px;">THE CUSTOMER HAS STATED THAT STATUS: <b>NON INSURED</b></p>
              <p>COMPANY: N/A</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title"><span>SCHEDULE OF DEMURRAGE</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 7.5px;">Demurrage Chargeable After arrival grace 24 hours.</p>
              <p>Rate: <b>₹{{demurrage_charge}}</b> / Day</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title"><span>AT OWNER RISK</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 7.5px; color: #dc2626; font-weight: 700;">CAUTION</p>
              <p style="font-size: 7px; line-height: 1.1;">This consignment will not be Detained, re-route, diverted without consignee bank written permission.</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title"><span>LR / VEHICLE DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>BILTY NO:</b> <span style="color: #dc2626; font-weight: 700;">{{bilty_number}}</span></p>
              <p><b>VEHICLE:</b> {{vehicle_number}}</p>
              <p><b>DATE:</b> {{date}}</p>
            </div>
          </div>
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title"><span>ROUTE</span></div>
            <div class="bilty-box-content" style="display: flex; flex-direction: column; gap: 2px;">
              <div><span style="font-size: 7px; color: #64748b;">From</span><p style="font-weight: 700; margin: 0; font-size: 8px;">{{from_city}}</p></div>
              <div><span style="font-size: 7px; color: #64748b;">To</span><p style="font-weight: 700; margin: 0; font-size: 8px;">{{to_city}}</p></div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="flex: 1.3;">
            <table class="bilty-table" style="height: 100%;">
              <thead>
                <tr>
                  <th>PACKAGING TYPE</th>
                  <th>NUMBER OF ARTICLE</th>
                  <th>MATERIAL NAME</th>
                  <th>DESCRIPTION OF GOOD (SAID TO CONTAIN)</th>
                  <th>HSN CODE</th>
                </tr>
              </thead>
              <tbody>
                <tr style="height: 110px;">
                  <td>{{packing_type}}</td>
                  <td>{{no_of_packages}}</td>
                  <td>{{material_name}}</td>
                  <td>{{goods_description}}</td>
                  <td>{{hsn_code}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="flex: 1;">
            <table class="bilty-table">
              <thead>
                <tr>
                  <th colspan="2" style="text-align: center;">WEIGHT</th>
                  <th style="text-align: center;">RATE / MT</th>
                  <th style="text-align: center;">AMOUNT</th>
                </tr>
                <tr>
                  <th style="font-size: 7.5px;">ACTUAL</th>
                  <th style="font-size: 7.5px;">GUARANTEE</th>
                  <th style="font-size: 7.5px;">/ MT</th>
                  <th style="font-size: 7.5px;">FREIGHT CHARGES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center; height: 110px;"><b>{{actual_weight}}</b><br />MT</td>
                  <td style="text-align: center;"><b>{{guarantee_weight}}</b><br />MT</td>
                  <td style="text-align: center;"><b>₹{{rate}}</b></td>
                  <td style="padding: 0;">
                    <div style="display: flex; flex-direction: column; font-size: 8px;">
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 2px 4px;">
                        <span>Freight:</span><b>₹{{freight_amount}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 2px 4px;">
                        <span>Other Chg:</span><b>₹{{other_charges}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 2px 4px; font-weight: 800; background: #f8fafc;">
                        <span>Total:</span><b>₹{{total_freight}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 2px 4px;">
                        <span>Less - Adv:</span><b>-₹{{advance_paid}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 2px 4px; background: #fef2f2; color: #dc2626; font-weight: 900;">
                        <span>Balance:</span><b>₹{{balance_amount}}</b>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bilty-box" style="min-height: 45px; margin-top: 6px;">
          <div class="bilty-box-title"><span>RECEIVING ACKNOWLEDGEMENT USE ONLY</span></div>
          <div class="bilty-box-content" style="display: flex; justify-content: space-between; align-items: center; font-size: 8px;">
            <p style="margin: 0;"><b>RECEIVER NAME:</b> ___________________________</p>
            <p style="margin: 0;"><b>REMARK:</b> ___________________________</p>
            <p style="margin: 0;"><b>STATUS:</b> DELIVERED OK [ ] DAMAGE [ ]</p>
          </div>
        </div>

        <div style="border: 1px solid #000000; border-radius: 4px; padding: 6px; margin-top: 6px; background: #f8fafc;">
          <span style="font-size: 8px; font-weight: 800; display: block; border-bottom: 1px dashed #000; padding-bottom: 2px; margin-bottom: 4px;">🏦 BANK ACCOUNT DETAILS</span>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 7.5px;">
            <div>
              <p style="margin: 0;"><b>BANK ACCOUNT NUMBER:</b> 54092010010009</p>
              <p style="margin: 0;"><b>IFSC:</b> SBIN0554009</p>
            </div>
            <div>
              <p style="margin: 0;"><b>PAN CARD NAME:</b> ROADWE VENTURES</p>
              <p style="margin: 0;"><b>A/C HOLDER NAME:</b> {{company_name}}</p>
            </div>
            <div>
              <p style="margin: 0;"><b>BANK NAME:</b> IDBI Bank</p>
              <p style="margin: 0;"><b>BRANCH:</b> BHILAI</p>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <span style="font-size: 7.5px; color: #64748b;">This electronic generated pdf does not require any physical signature. Date: {{date}}</span>
          <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
            <span style="font-weight: bold; font-size: 7px;">For, {{company_name}}</span>
            <img src="{{company_stamp}}" alt="Stamp" style="height: 24px; object-fit: contain;" onerror="this.style.display='none'" />
            <div style="width: 80px; border-top: 1px solid #475569; font-size: 7.5px; color: #64748b; margin-top: 2px;">AUTHORIZE SIGNATURE</div>
          </div>
        </div>
      </div>
    `
  },
  {
    template_name: "Compact Minimal Bilty",
    template_code: "minimal",
    preview_image: "/bilty_format_5.jpg",
    css_styles: `
      .bilty-wrapper { font-family: 'Inter', sans-serif; color: #0f172a; padding: 20px; box-sizing: border-box; }
      .bilty-header { display: flex; justify-content: space-between; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px; }
      .bilty-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
      .bilty-grid-3 { display: grid; grid-template-columns: 1.2fr 1.2fr 1.6fr; gap: 6px; margin-bottom: 8px; }
      .bilty-box { border: 1px solid #cbd5e1; padding: 6px; border-radius: 3px; background: #ffffff; min-height: 75px; }
      .bilty-box-title { font-weight: 800; font-size: 8px; text-transform: uppercase; color: #f59e0b; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px; margin-bottom: 4px; }
      .bilty-box-content p { margin: 0 0 2px 0; font-size: 8.5px; }
      .bilty-table { width: 100%; border-collapse: collapse; margin-top: 4px; margin-bottom: 8px; }
      .bilty-table th, .bilty-table td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 8.5px; }
      .bilty-table th { background-color: #f8fafc; font-weight: 800; text-transform: uppercase; font-size: 8px; }
    `,
    html_structure: `
      <div class="bilty-wrapper">
        <div class="bilty-header">
          <div style="display: flex; gap: 10px; align-items: center;">
            <img src="{{company_logo}}" alt="Logo" style="height: 34px; object-fit: contain;" onerror="this.style.display='none'" />
            <div>
              <span style="font-size: 7.5px; color: #64748b; display: block;">Subject To {{jurisdiction}} jurisdiction</span>
              <h1 style="font-size: 13px; font-weight: 900; color: #1e293b; margin: 0;">{{company_name}}</h1>
              <span style="font-size: 7px; color: #475569; display: block;">TRANSPORT ALL TYPE OF GOODS & SERVICES</span>
            </div>
          </div>
          <div style="text-align: right; min-width: 120px;">
            <span style="font-size: 7.5px; display: block;">Mob: {{company_mobile}}</span>
            <div style="background: #f59e0b; color: #fff; padding: 1px 6px; font-size: 7.5px; font-weight: bold; display: inline-block; border-radius: 2px; margin-top: 2px;">
              CONSIGNOR COPY
            </div>
            <span style="font-size: 7px; display: block; margin-top: 2px;">PAN NO: {{company_pan}}</span>
            <span style="font-size: 7px; display: block;">GSTIN: {{company_gstin}}</span>
          </div>
        </div>

        <div class="bilty-grid-2">
          <div class="bilty-box" style="min-height: 75px;">
            <div class="bilty-box-title" style="color: #f59e0b;"><span>CONSIGNOR'S DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>NAME:</b> {{consignor_name}}</p>
              <p><b>ADDRESS:</b> {{consignor_address}}</p>
              <p><b>EMAIL:</b> {{consignor_email}} • <b>GSTIN:</b> {{consignor_gstin}}</p>
              <p><b>MOBILE:</b> {{consignor_contact}} • <b>BANK:</b> {{consignor_bank}}</p>
            </div>
          </div>
          
          <div class="bilty-box" style="min-height: 75px;">
            <div class="bilty-box-title" style="color: #f59e0b;"><span>CONSIGNEE'S / BUYER'S DETAILS</span></div>
            <div class="bilty-box-content">
              <p><b>NAME:</b> {{consignee_name}}</p>
              <p><b>ADDRESS:</b> {{consignee_address}}</p>
              <p><b>EMAIL:</b> {{consignee_email}} • <b>GSTIN:</b> {{consignee_gstin}}</p>
              <p><b>MOBILE:</b> {{consignee_contact}} • <b>BANK:</b> {{consignee_bank}}</p>
            </div>
          </div>
        </div>

        <div class="bilty-grid-3">
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title" style="color: #475569;"><span>INSURANCE</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 7.5px;">THE CUSTOMER HAS STATED THAT STATUS: <b>NON INSURED</b></p>
              <p>RISK: <b>AT OWNER RISK</b></p>
            </div>
          </div>
          
          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title" style="color: #475569;"><span>DEMURRAGE (HALTING)</span></div>
            <div class="bilty-box-content">
              <p style="font-size: 7.5px;">Demurrage Chargeable After arrival grace 24 hours.</p>
              <p>Rate: <b>₹{{demurrage_charge}}</b> / Day</p>
            </div>
          </div>

          <div class="bilty-box" style="min-height: 55px;">
            <div class="bilty-box-title" style="color: #475569;"><span>BILTY & VEHICLE INFORMATION</span></div>
            <div class="bilty-box-content">
              <p><b>BILTY NO:</b> <span style="color: #dc2626; font-weight: 700;">{{bilty_number}}</span></p>
              <p><b>VEHICLE:</b> {{vehicle_number}} • <b>DATE:</b> {{date}}</p>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="flex: 1.3;">
            <table class="bilty-table" style="height: 100%;">
              <thead>
                <tr>
                  <th>PACKAGING TYPE</th>
                  <th>NUMBER OF ARTICLE</th>
                  <th>MATERIAL NAME</th>
                  <th>DESCRIPTION OF GOOD (SAID TO CONTAIN)</th>
                  <th>HSN CODE</th>
                </tr>
              </thead>
              <tbody>
                <tr style="height: 110px;">
                  <td>{{packing_type}}</td>
                  <td>{{no_of_packages}}</td>
                  <td>{{material_name}}</td>
                  <td>{{goods_description}}</td>
                  <td>{{hsn_code}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="flex: 1;">
            <table class="bilty-table">
              <thead>
                <tr>
                  <th colspan="2" style="text-align: center;">WEIGHT</th>
                  <th style="text-align: center;">RATE / MT</th>
                  <th style="text-align: center;">AMOUNT</th>
                </tr>
                <tr>
                  <th style="font-size: 7.5px;">ACTUAL</th>
                  <th style="font-size: 7.5px;">GUARANTEE</th>
                  <th style="font-size: 7.5px;">/ MT</th>
                  <th style="font-size: 7.5px;">FREIGHT CHARGES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center; height: 110px;"><b>{{actual_weight}}</b><br />MT</td>
                  <td style="text-align: center;"><b>{{guarantee_weight}}</b><br />MT</td>
                  <td style="text-align: center;"><b>₹{{rate}}</b></td>
                  <td style="padding: 0;">
                    <div style="display: flex; flex-direction: column; font-size: 8px;">
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding: 2px 4px;">
                        <span>Freight:</span><b>₹{{freight_amount}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding: 2px 4px;">
                        <span>Other:</span><b>₹{{other_charges}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding: 2px 4px; font-weight: 800; background: #f8fafc;">
                        <span>Total:</span><b>₹{{total_freight}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding: 2px 4px;">
                        <span>Less Adv:</span><b>-₹{{advance_paid}}</b>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 2px 4px; background: #fef2f2; color: #dc2626; font-weight: 900;">
                        <span>Balance:</span><b>₹{{balance_amount}}</b>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid #cbd5e1; padding-top: 8px;">
          <span style="font-size: 7.5px; color: #64748b;">This electronic generated pdf does not require any physical signature. Date: {{date}}</span>
          <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
            <span style="font-weight: bold; font-size: 7px;">For, {{company_name}}</span>
            <img src="{{company_stamp}}" alt="Stamp" style="height: 24px; object-fit: contain;" onerror="this.style.display='none'" />
            <div style="width: 80px; border-top: 1px solid #cbd5e1; font-size: 7.5px; color: #64748b; marginTop: 2px;">AUTHORIZE SIGNATURE</div>
          </div>
        </div>
      </div>
    `
  }
];

// --- Automatic Seeding of Templates on Startup ---
exports.ensureTemplatesSeeded = async () => {
  try {
    const count = await BiltyTemplate.countDocuments();
    if (count === 0) {
      console.log('🌱 Database templates collection is empty. Seeding all 5 unique high-fidelity Bilty templates...');
      for (const t of defaultTemplates) {
        await BiltyTemplate.create(t);
      }
      console.log('✅ Successfully seeded 5 Bilty templates in the database.');
    }
  } catch (err) {
    console.error('❌ Failed seeding templates:', err);
  }
};

// --- Templates CRUD endpoints ---
exports.getTemplates = async (req, res) => {
  try {
    const templates = await BiltyTemplate.find({ is_active: true });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const template = await BiltyTemplate.create(req.body);
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await BiltyTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    await BiltyTemplate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Transporter Template Selection Settings ---
exports.getTransporterSettings = async (req, res) => {
  try {
    let settings = await TransporterTemplateSettings.findOne({ company_id: req.userId });
    if (!settings) {
      // Find default classic_lr template
      const defaultTemplate = await BiltyTemplate.findOne({ template_code: 'classic_lr' });
      const defaultId = defaultTemplate ? defaultTemplate._id : 'default_id';
      settings = await TransporterTemplateSettings.create({
        company_id: req.userId,
        selected_template_id: defaultId
      });
    }
    // Fetch and append the full template details
    const template = await BiltyTemplate.findById(settings.selected_template_id);
    res.json({
      _id: settings._id,
      company_id: settings.company_id,
      selected_template_id: settings.selected_template_id,
      selected_template: template,
      selected_invoice_template: settings.selected_invoice_template || 'standard_invoice',
      selected_voucher_template: settings.selected_voucher_template || 'standard_voucher',
      selected_consignment_template: settings.selected_consignment_template || 'standard_consignment',
      logo_img: settings.logo_img || '',
      stamp_img: settings.stamp_img || '',
      heading_color: settings.heading_color || '#000000',
      show_bilty_bank: settings.show_bilty_bank !== false,
      show_load_bank: settings.show_load_bank !== false,
      show_invoice_bank: settings.show_invoice_bank !== false,
      selected_loading_format: settings.selected_loading_format || 1,
      loading_bg_color: settings.loading_bg_color || '#ffffff',
      voucher_bg_color: settings.voucher_bg_color || '#ffffff',
      bilty_min_digits: settings.bilty_min_digits || 'Select Minimum Digits',
      loading_min_digits: settings.loading_min_digits || 'Select Minimum Digits',
      invoice_min_digits: settings.invoice_min_digits || 'Select Minimum Digits',
      chalan_min_digits: settings.chalan_min_digits || 'Select Minimum Digits',
      notify_interval: settings.notify_interval || '15 MIN',
      invoice_heading: settings.invoice_heading || 'Default Template'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransporterSettings = async (req, res) => {
  try {
    const updateData = req.body;
    let settings = await TransporterTemplateSettings.findOneAndUpdate(
      { company_id: req.userId },
      updateData,
      { new: true }
    );
    if (!settings) {
      settings = await TransporterTemplateSettings.create({
        company_id: req.userId,
        ...updateData
      });
    }
    const template = await BiltyTemplate.findById(settings.selected_template_id);
    res.json({
      _id: settings._id,
      company_id: settings.company_id,
      selected_template_id: settings.selected_template_id,
      selected_template: template,
      selected_invoice_template: settings.selected_invoice_template || 'standard_invoice',
      selected_voucher_template: settings.selected_voucher_template || 'standard_voucher',
      selected_consignment_template: settings.selected_consignment_template || 'standard_consignment',
      logo_img: settings.logo_img || '',
      stamp_img: settings.stamp_img || '',
      heading_color: settings.heading_color || '#000000',
      show_bilty_bank: settings.show_bilty_bank !== false,
      show_load_bank: settings.show_load_bank !== false,
      show_invoice_bank: settings.show_invoice_bank !== false,
      selected_loading_format: settings.selected_loading_format || 1,
      loading_bg_color: settings.loading_bg_color || '#ffffff',
      voucher_bg_color: settings.voucher_bg_color || '#ffffff',
      bilty_min_digits: settings.bilty_min_digits || 'Select Minimum Digits',
      loading_min_digits: settings.loading_min_digits || 'Select Minimum Digits',
      invoice_min_digits: settings.invoice_min_digits || 'Select Minimum Digits',
      chalan_min_digits: settings.chalan_min_digits || 'Select Minimum Digits',
      notify_interval: settings.notify_interval || '15 MIN',
      invoice_heading: settings.invoice_heading || 'Default Template'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
