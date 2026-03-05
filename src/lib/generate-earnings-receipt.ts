import type { EarningsDetail } from '@/hooks/api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDuration(minutes: number): string {
  const hours = minutes / 60;
  return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export function generateEarningsReceipt(detail: EarningsDetail): void {
  const tutorName = detail.tutorId?.name || 'N/A';
  const periodLabel = `${MONTH_NAMES[detail.payoutMonth - 1]} ${detail.payoutYear}`;

  const lineItemsHtml = detail.lineItems
    .map(
      (item, i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${formatDate(item.completedAt)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${item.studentName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${item.subject}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${formatDuration(item.duration)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${formatCurrency(item.tutorEarning)}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Earnings Receipt - ${periodLabel}</title>
  <style>
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1f2937; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #002AC8; }
    .logo { font-size: 24px; font-weight: 700; color: #002AC8; }
    .logo-sub { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .ref { text-align: right; }
    .ref-code { font-size: 13px; color: #6b7280; font-family: monospace; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .meta-box { background: #f9fafb; border-radius: 8px; padding: 16px; }
    .meta-label { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .meta-value { font-size: 15px; font-weight: 500; }
    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { background: #f3f4f6; padding: 10px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; text-align: left; }
    th:first-child { text-align: center; }
    th:last-child { text-align: right; }
    td { font-size: 14px; }
    .summary { margin-left: auto; width: 300px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .summary-row.total { border-top: 2px solid #002AC8; padding-top: 12px; margin-top: 4px; font-weight: 700; font-size: 16px; color: #002AC8; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-PENDING { background: #fef3c7; color: #92400e; }
    .status-PROCESSING { background: #dbeafe; color: #1e40af; }
    .status-PAID { background: #d1fae5; color: #065f46; }
    .status-FAILED { background: #fee2e2; color: #991b1b; }
    .status-REFUNDED { background: #f3f4f6; color: #374151; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
    .print-btn { display: block; margin: 0 auto 32px; padding: 10px 32px; background: #002AC8; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .print-btn:hover { background: #001F9C; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Download as PDF</button>

  <div class="header">
    <div>
      <div class="logo">Schäfer Tutoring</div>
      <div class="logo-sub">Tutor Earnings Receipt</div>
    </div>
    <div class="ref">
      <span class="status-badge status-${detail.status}">${detail.status}</span>
      <div class="ref-code" style="margin-top:8px">${detail.payoutReference || 'N/A'}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-box">
      <div class="meta-label">Tutor</div>
      <div class="meta-value">${tutorName}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Period</div>
      <div class="meta-value">${periodLabel}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Period Start</div>
      <div class="meta-value">${formatDate(detail.periodStart)}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Period End</div>
      <div class="meta-value">${formatDate(detail.periodEnd)}</div>
    </div>
  </div>

  <div class="section-title">Session Details</div>
  <table>
    <thead>
      <tr>
        <th style="text-align:center">#</th>
        <th>Date</th>
        <th>Student</th>
        <th>Subject</th>
        <th style="text-align:center">Duration</th>
        <th style="text-align:right">Earned</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsHtml || '<tr><td colspan="6" style="padding:16px;text-align:center;color:#9ca3af">No session records</td></tr>'}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-row">
      <span>Total Sessions</span>
      <span>${detail.totalSessions}</span>
    </div>
    <div class="summary-row">
      <span>Total Hours</span>
      <span>${detail.totalHours.toFixed(1)}h</span>
    </div>
    <div class="summary-row">
      <span>Gross Earnings</span>
      <span>${formatCurrency(detail.grossEarnings)}</span>
    </div>
    <div class="summary-row">
      <span>Commission (${(detail.commissionRate * 100).toFixed(0)}%)</span>
      <span>-${formatCurrency(detail.platformCommission)}</span>
    </div>
    <div class="summary-row total">
      <span>Net Earnings</span>
      <span>${formatCurrency(detail.netEarnings)}</span>
    </div>
  </div>

  ${detail.paidAt ? `<div style="margin-top:24px;font-size:13px;color:#6b7280">Paid on: ${formatDate(detail.paidAt)}</div>` : ''}

  <div class="footer">
    Generated on ${new Date().toLocaleDateString('de-DE')} &middot; Schäfer Tutoring
  </div>
</body>
</html>`;

  const receiptWindow = window.open('', '_blank');
  if (receiptWindow) {
    receiptWindow.document.write(html);
    receiptWindow.document.close();
  }
}
