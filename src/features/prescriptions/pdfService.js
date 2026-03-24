import { formatDateTime } from '../../lib/formatters'

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderMedicationRows(medications) {
  if (!medications?.length) {
    return `
      <div class="med-row">
        <div class="med-index">1</div>
        <div class="med-body">
          <strong>Medication details pending</strong>
          <p>Add medication details before export.</p>
        </div>
      </div>
    `
  }

  return medications
    .map((item, index) => {
      const meta = [item.strength, item.dosage, item.frequency, item.duration, item.route]
        .filter(Boolean)
        .join(' • ')

      return `
        <div class="med-row">
          <div class="med-index">${index + 1}</div>
          <div class="med-body">
            <strong>${escapeHtml(item.drug_name || 'Medication')}</strong>
            <p>${escapeHtml(meta || 'Dose instructions pending')}</p>
          </div>
        </div>
      `
    })
    .join('')
}

function buildPrescriptionHtml(formData, doctorProfile) {
  const issuedAt = formatDateTime(new Date().toISOString())

  return `
    <html>
      <head>
        <title>${escapeHtml(formData.patient_name || 'prescription')}</title>
        <style>
          @page {
            size: A4;
            margin: 18mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            color: #172033;
            background: #f6f7f9;
          }

          .sheet {
            background: #ffffff;
            border: 1px solid #d9e0e8;
            border-radius: 24px;
            padding: 28px 30px 32px;
            box-shadow: 0 18px 50px rgba(23, 32, 51, 0.08);
          }

          .top-accent {
            height: 6px;
            border-radius: 999px;
            margin-bottom: 22px;
            background: linear-gradient(90deg, #c56a1a 0%, #17746a 50%, #284b7a 100%);
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            padding-bottom: 18px;
            margin-bottom: 22px;
            border-bottom: 1px solid #e7ebf0;
          }

          .brand-kicker {
            margin: 0 0 8px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-size: 11px;
            font-weight: 700;
            color: #c56a1a;
          }

          .clinic-name {
            margin: 0 0 10px;
            font-size: 34px;
            line-height: 1;
            color: #182437;
          }

          .clinic-meta,
          .doctor-meta,
          .muted {
            margin: 0;
            color: #5d6879;
            font-size: 14px;
            line-height: 1.6;
          }

          .header-side {
            min-width: 220px;
            text-align: right;
          }

          .issued-pill {
            display: inline-block;
            margin-bottom: 12px;
            padding: 8px 12px;
            border-radius: 999px;
            background: #eff7f6;
            color: #0f6f66;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-bottom: 20px;
          }

          .card,
          .wide-card {
            border: 1px solid #e7ebf0;
            border-radius: 18px;
            padding: 18px 18px 16px;
            background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
          }

          .wide-card {
            margin-bottom: 18px;
          }

          .label {
            margin: 0 0 10px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-size: 11px;
            font-weight: 700;
            color: #c56a1a;
          }

          .primary {
            margin: 0 0 8px;
            font-size: 23px;
            color: #182437;
          }

          .field-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 18px;
          }

          .field span {
            display: block;
            margin-bottom: 5px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #7a8494;
          }

          .field strong,
          .field p {
            margin: 0;
            font-size: 16px;
            line-height: 1.5;
            color: #182437;
          }

          .notes {
            white-space: pre-wrap;
          }

          .med-list {
            display: grid;
            gap: 14px;
          }

          .med-row {
            display: grid;
            grid-template-columns: 42px 1fr;
            gap: 14px;
            align-items: start;
            padding: 14px 0;
            border-top: 1px solid #edf1f4;
          }

          .med-row:first-child {
            border-top: none;
            padding-top: 0;
          }

          .med-index {
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: linear-gradient(135deg, #eff7f6, #fdf2e8);
            color: #144d68;
            font-weight: 700;
          }

          .med-body strong {
            display: block;
            margin-bottom: 4px;
            font-size: 18px;
            color: #182437;
          }

          .med-body p {
            margin: 0;
            color: #5d6879;
            line-height: 1.6;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid #e7ebf0;
          }

          .signature {
            min-width: 180px;
            text-align: right;
          }

          .signature img,
          .logo {
            max-height: 60px;
            object-fit: contain;
          }

          .signature-line {
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #cfd7e0;
          }

          @media print {
            body {
              background: #ffffff;
            }

            .sheet {
              box-shadow: none;
              border: none;
              border-radius: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <main class="sheet">
          <div class="top-accent"></div>

          <section class="header">
            <div>
              <p class="brand-kicker">Prescription</p>
              <h1 class="clinic-name">${escapeHtml(doctorProfile.clinic_name || 'Clinic Name')}</h1>
              <p class="clinic-meta">${escapeHtml(doctorProfile.clinic_address || 'Clinic address')}</p>
              <p class="clinic-meta">${escapeHtml(doctorProfile.phone || 'Clinic phone number')}</p>
            </div>

            <div class="header-side">
              <span class="issued-pill">Issued ${escapeHtml(issuedAt)}</span>
              ${doctorProfile.logo_url ? `<img src="${doctorProfile.logo_url}" alt="Clinic logo" class="logo" />` : ''}
            </div>
          </section>

          <section class="grid">
            <div class="card">
              <p class="label">Patient</p>
              <h2 class="primary">${escapeHtml(formData.patient_name || 'Patient name')}</h2>
              <div class="field-row">
                <div class="field">
                  <span>Age</span>
                  <strong>${escapeHtml(formData.age || '-')}</strong>
                </div>
                <div class="field">
                  <span>Sex</span>
                  <strong>${escapeHtml(formData.sex || '-')}</strong>
                </div>
                <div class="field">
                  <span>Phone</span>
                  <strong>${escapeHtml(formData.phone || '-')}</strong>
                </div>
              </div>
            </div>

            <div class="card">
              <p class="label">Clinical summary</p>
              <div class="field">
                <span>Diagnosis</span>
                <strong>${escapeHtml(formData.diagnosis || '-')}</strong>
              </div>
            </div>
          </section>

          <section class="wide-card">
            <p class="label">Medication plan</p>
            <div class="med-list">
              ${renderMedicationRows(formData.medications)}
            </div>
          </section>

          <section class="wide-card">
            <p class="label">Notes</p>
            <p class="field notes">${escapeHtml(formData.notes || '-')}</p>
          </section>

          <footer class="footer">
            <div>
              <p class="label">Prescribing doctor</p>
              <h3 class="primary">${escapeHtml(doctorProfile.full_name || 'Doctor name')}</h3>
              <p class="doctor-meta">${escapeHtml(doctorProfile.qualification || 'Qualification')}</p>
            </div>

            <div class="signature">
              ${doctorProfile.signature_url ? `<img src="${doctorProfile.signature_url}" alt="Doctor signature" />` : ''}
              <div class="signature-line">
                <p class="muted">Authorized signature</p>
              </div>
            </div>
          </footer>
        </main>
      </body>
    </html>
  `
}

function openPrintWindow(title, html) {
  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) {
    throw new Error('Popup blocked. Please allow popups to continue.')
  }

  printWindow.document.write(html)
  printWindow.document.close()
  return printWindow
}

export const pdfService = {
  exportPrescriptionPdf(formData, doctorProfile) {
    const printWindow = openPrintWindow(
      `${formData.patient_name || 'prescription'}-pdf`,
      buildPrescriptionHtml(formData, doctorProfile),
    )
    printWindow.print()
  },

  printPrescription(formData, doctorProfile) {
    const printWindow = openPrintWindow(
      `${formData.patient_name || 'prescription'}-print`,
      buildPrescriptionHtml(formData, doctorProfile),
    )
    printWindow.print()
  },
}
