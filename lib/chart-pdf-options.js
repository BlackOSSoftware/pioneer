/**
 * On-screen chart options — keep aspect ratio so Chart.js cannot grow the page infinitely.
 * (maintainAspectRatio: false without a fixed-height parent causes endless height growth.)
 */
export const DISPLAY_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  animation: false,
  plugins: {
    legend: { position: "top" },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      ticks: { maxRotation: 45, minRotation: 0, autoSkip: true, maxTicksLimit: 12 },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          const n = Number(value);
          if (!Number.isFinite(n)) return value;
          if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
          if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
          return `₹${Math.round(n).toLocaleString("en-IN")}`;
        },
      },
    },
  },
};

export const DISPLAY_PIE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.15,
  animation: false,
  plugins: {
    legend: { position: "bottom" },
    tooltip: { enabled: true },
  },
};

/**
 * Options used when capturing canvas for PDF (same sizing rules; no tooltips).
 * Prefer fixed-height wrappers in the page when using these.
 */
export const PDF_CHART_OPTIONS = {
  ...DISPLAY_CHART_OPTIONS,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};

export const PDF_PIE_OPTIONS = {
  ...DISPLAY_PIE_OPTIONS,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};
