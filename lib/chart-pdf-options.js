/**
 * Chart.js options tuned for PDF export (avoids stray legend markers / layout glitches in rasterized charts).
 * Use for Pie/Bar used in calculator PDFs; tooltips off for cleaner canvas capture.
 */
export const PDF_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { ticks: { maxRotation: 45, minRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
    y: { beginAtZero: true },
  },
};

export const PDF_PIE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};
