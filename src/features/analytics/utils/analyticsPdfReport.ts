import {
  formatShortDateId,
  getUserInitials,
  type ApplicationDto,
} from "@/features/shared/workspace-types";
import type { AnalyticsSummary } from "./analyticsMetrics";

function escapeHtml(raw: string | null | undefined): string {
  return (raw ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const STAGE_GROUPS = [
  { key: "APPLIED", label: "Applied", match: (s: string) => s === "APPLIED" },
  { key: "FOLLOW_UP", label: "Follow-Up", match: (s: string) => s === "FOLLOW_UP_NEEDED" },
  { key: "INTERVIEW", label: "Interview", match: (s: string) => s === "INTERVIEW_SCHEDULED" },
  { key: "OFFERED", label: "Offered", match: (s: string) => s === "OFFERED" },
  {
    key: "REJECTED",
    label: "Rejected",
    match: (s: string) => s === "REJECTED" || s === "GHOSTED",
  },
] as const;

export function openAnalyticsPdfReport(params: {
  userName: string;
  userEmail: string;
  periodLabel: string;
  applications: readonly ApplicationDto[];
  summary: AnalyticsSummary;
}): void {
  const { userName, userEmail, periodLabel, applications, summary } = params;
  const initials = getUserInitials(userName, userEmail);
  const logoUrl = `${window.location.origin}/images/brand/android-chrome-192x192.png`;
  const generatedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const stageCounts = STAGE_GROUPS.map((stage) => {
    const items = applications.filter((a) => stage.match(a.status));
    return { ...stage, items, count: items.length };
  });
  const maxStageCount = Math.max(0, ...stageCounts.map((s) => s.count));

  const stageStripHtml = stageCounts
    .map((stage) => {
      const isHighlight = stage.count > 0 && stage.count === maxStageCount;
      return `
        <td class="stage-cell ${isHighlight ? "stage-highlight" : ""}">
          <div class="stage-label">${escapeHtml(stage.label)}</div>
          <div class="stage-count-wrap">
            <span class="stage-badge ${isHighlight ? "stage-badge-active" : ""}">${stage.count}</span>
          </div>
          <div class="stage-pct">${
            summary.total > 0 ? Math.round((stage.count / summary.total) * 100) : 0
          }%</div>
        </td>
      `;
    })
    .join("");

  const portalRowsHtml =
    summary.sources.length > 0
      ? summary.sources
          .map(
            (src) => `
          <div class="portal-row">
            <div class="portal-left">
              <div class="portal-title-line">
                <span class="portal-name">${escapeHtml(src.name)}</span>
                <span class="pill-tag">${src.responseRate}% RESPON</span>
              </div>
              <p class="portal-desc">
                ${src.total} lamaran terkirim melalui ${escapeHtml(src.name)} dengan ${src.responded} lamaran mendapat tanggapan HRD.
              </p>
            </div>
            <div class="portal-metric">${String(src.total).padStart(2, "0")}</div>
          </div>
        `
          )
          .join("")
      : `<p class="empty-note">Belum ada data portal sumber pada periode ini.</p>`;

  const breakdownRowsHtml = stageCounts
    .filter((stage) => stage.items.length > 0)
    .map((stage) => {
      const itemRows = stage.items
        .map(
          (app, idx) => `
          <tr class="${idx === 0 ? "group-first-row" : ""}">
            <td class="col-stage">${idx === 0 ? `<strong>${escapeHtml(stage.label)}</strong>` : ""}</td>
            <td class="col-role">
              <div class="role-title">${escapeHtml(app.companyName)} — ${escapeHtml(app.position)}</div>
              <div class="role-meta">${escapeHtml(
                [app.location, app.employmentType, app.salaryRange, app.jobSource]
                  .filter((v): v is string => Boolean(v && v.trim().length > 0))
                  .join(" • ")
              )}</div>
            </td>
            <td class="col-right">
              <div>${app.matchScore !== null ? `${app.matchScore}% Cocok` : "—"}</div>
              <div class="role-meta">${escapeHtml(formatShortDateId(app.appliedAt))}</div>
            </td>
          </tr>
        `
        )
        .join("");

      return `
        ${itemRows}
        <tr class="subtotal-row">
          <td></td>
          <td></td>
          <td class="col-right">Subtotal : ${stage.count} lamaran</td>
        </tr>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>NextRole — Laporan Analitik Karir (${escapeHtml(generatedDate)})</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #1e293b;
      background: #f8fafc;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      max-width: 780px;
      margin: 0 auto;
      background: #ffffff;
      padding: 28px 32px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    @media print {
      body { background: #ffffff; }
      .page { border: none; padding: 0; max-width: none; border-radius: 0; }
      .no-print { display: none !important; }
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 20px;
    }
    .brand { display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; color: #0f172a; letter-spacing: -0.02em; }
    .brand-logo { width: 26px; height: 26px; border-radius: 9999px; object-fit: cover; }
    .meta-date { font-size: 11px; color: #64748b; }
    .summary-title { font-size: 18px; font-weight: 500; color: #0f172a; margin: 0 0 12px; }
    .user-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .avatar {
      width: 38px; height: 38px; border-radius: 9999px;
      background: #e0f2fe; color: #0284c7; font-size: 13px; font-weight: 600;
      display: flex; align-items: center; justify-content: center;
    }
    .user-name { font-size: 14px; font-weight: 500; color: #0f172a; }
    .user-email { font-size: 11px; color: #64748b; }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-bottom: 14px;
    }
    .period-heading { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0; }
    .period-pill {
      font-size: 11px; color: #0284c7; background: #f0f9ff;
      border: 1px solid #bae6fd; padding: 3px 10px; border-radius: 999px;
    }
    .kpi-strip {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
      padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; margin-bottom: 16px;
    }
    .kpi-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
    .kpi-value { font-size: 17px; font-weight: 600; color: #0f172a; }
    .stage-table {
      width: 100%; border-collapse: collapse; margin-bottom: 16px;
      border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;
    }
    .stage-cell {
      text-align: center; padding: 10px 6px; border-right: 1px solid #f1f5f9; width: 16.66%;
    }
    .stage-cell:last-child { border-right: none; }
    .stage-highlight { background: #eff6ff; }
    .stage-label { font-size: 10px; color: #64748b; margin-bottom: 6px; }
    .stage-count-wrap { margin-bottom: 4px; }
    .stage-badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 24px; height: 24px; border-radius: 9999px;
      font-size: 12px; font-weight: 600; color: #334155;
    }
    .stage-badge-active { background: #0284c7; color: #ffffff; }
    .stage-pct { font-size: 11px; color: #64748b; }
    .portal-row {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 12px 0; border-top: 1px solid #f1f5f9;
    }
    .portal-title-line { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .portal-name { font-size: 13px; font-weight: 600; color: #0f172a; }
    .pill-tag {
      font-size: 9px; font-weight: 600; color: #475569; background: #f1f5f9;
      padding: 2px 7px; border-radius: 4px; letter-spacing: 0.03em;
    }
    .portal-desc { font-size: 11px; color: #64748b; margin: 0; line-height: 1.45; }
    .portal-metric { font-size: 20px; font-weight: 500; color: #0f172a; flex-shrink: 0; }
    .section-heading { font-size: 13px; font-weight: 600; color: #0f172a; margin: 0 0 10px; }
    .breakdown-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .breakdown-table th {
      text-align: left; font-size: 11px; font-weight: 500; color: #64748b;
      padding: 8px 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
    }
    .breakdown-table th.col-right, .breakdown-table td.col-right { text-align: right; }
    .breakdown-table td { padding: 9px 10px; vertical-align: top; color: #334155; }
    .group-first-row td { border-top: 1px solid #f1f5f9; padding-top: 12px; }
    .col-stage { width: 18%; color: #0f172a; }
    .col-role { width: 58%; }
    .col-right { width: 24%; white-space: nowrap; }
    .role-title { font-weight: 500; color: #0f172a; }
    .role-meta { font-size: 10px; color: #64748b; margin-top: 2px; }
    .subtotal-row td {
      padding-top: 4px; padding-bottom: 10px; font-size: 11px; font-weight: 500; color: #475569;
    }
    .report-total-row td {
      border-top: 1px solid #cbd5e1; padding: 12px 10px 4px;
      font-size: 12px; font-weight: 600; color: #0f172a;
    }
    .empty-note { font-size: 12px; color: #64748b; text-align: center; padding: 16px 0; }
    .print-bar {
      max-width: 780px; margin: 14px auto; display: flex; justify-content: flex-end; gap: 8px;
    }
    .btn-print {
      background: #0284c7; color: #ffffff; border: none; border-radius: 999px;
      padding: 9px 18px; font-size: 12px; font-weight: 500; cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <button class="btn-print" onclick="window.print()">Simpan sebagai PDF / Cetak</button>
  </div>

  <div class="page">
    <div class="topbar">
      <div class="brand">
        <img src="${escapeHtml(logoUrl)}" alt="NextRole" class="brand-logo" />
        <span>nextrole</span>
      </div>
      <div class="meta-date">Dicetak pada ${escapeHtml(generatedDate)}</div>
    </div>

    <h1 class="summary-title">Ringkasan Analitik Karir</h1>
    <div class="user-row">
      <div class="avatar">${escapeHtml(initials)}</div>
      <div>
        <div class="user-name">${escapeHtml(userName)}</div>
        <div class="user-email">${escapeHtml(userEmail)}</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="period-heading">Laporan Performa Lamaran</h2>
        <span class="period-pill">${escapeHtml(periodLabel)}</span>
      </div>

      <div class="kpi-strip">
        <div>
          <div class="kpi-label">Total Lamaran</div>
          <div class="kpi-value">${summary.total}</div>
        </div>
        <div>
          <div class="kpi-label">Lolos Wawancara</div>
          <div class="kpi-value">${summary.interviewRate}%</div>
        </div>
        <div>
          <div class="kpi-label">Tingkat Respon HRD</div>
          <div class="kpi-value">${summary.responseRate}%</div>
        </div>
        <div>
          <div class="kpi-label">Kecocokan CV</div>
          <div class="kpi-value">${summary.avgMatchScore !== null ? `${summary.avgMatchScore}%` : "—"}</div>
        </div>
      </div>

      <table class="stage-table">
        <tr>
          ${stageStripHtml}
          <td class="stage-cell">
            <div class="stage-label">Total</div>
            <div class="stage-count-wrap"><span class="stage-badge">${summary.total}</span></div>
            <div class="stage-pct">100%</div>
          </td>
        </tr>
      </table>

      ${portalRowsHtml}
    </div>

    <h3 class="section-heading">Rincian Lamaran Berdasarkan Tahap</h3>
    <div class="card" style="padding: 0; overflow: hidden;">
      <table class="breakdown-table">
        <thead>
          <tr>
            <th>Tahap</th>
            <th>Perusahaan &amp; Posisi</th>
            <th class="col-right">Kecocokan &amp; Tanggal</th>
          </tr>
        </thead>
        <tbody>
          ${
            breakdownRowsHtml ||
            `<tr><td colspan="3" class="empty-note">Belum ada lamaran pada periode ini.</td></tr>`
          }
          <tr class="report-total-row">
            <td colspan="2"></td>
            <td class="col-right">Total Lamaran : ${summary.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
