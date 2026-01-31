// components/sitemap/ScreenTypeThumbnail.js
// SVG wireframe thumbnails for screen types

export default function ScreenTypeThumbnail({ type, size = 32, className = '' }) {
  const s = size;
  const strokeWidth = size < 24 ? 1 : 1.5;

  const thumbnails = {
    landing: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Hero section */}
        <rect x="2" y="2" width="28" height="10" rx="1" fill="#dbeafe" stroke="#3b82f6" strokeWidth={strokeWidth} />
        <line x1="6" y1="5" x2="18" y2="5" stroke="#3b82f6" strokeWidth={strokeWidth} />
        <line x1="6" y1="8" x2="14" y2="8" stroke="#93c5fd" strokeWidth={strokeWidth} />
        {/* Cards */}
        <rect x="2" y="14" width="8" height="6" rx="1" fill="#eff6ff" stroke="#93c5fd" strokeWidth={strokeWidth} />
        <rect x="12" y="14" width="8" height="6" rx="1" fill="#eff6ff" stroke="#93c5fd" strokeWidth={strokeWidth} />
        <rect x="22" y="14" width="8" height="6" rx="1" fill="#eff6ff" stroke="#93c5fd" strokeWidth={strokeWidth} />
        {/* CTA */}
        <rect x="10" y="24" width="12" height="4" rx="1" fill="#3b82f6" />
      </svg>
    ),

    login: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Card */}
        <rect x="4" y="4" width="24" height="24" rx="2" fill="#faf5ff" stroke="#a855f7" strokeWidth={strokeWidth} />
        {/* Avatar circle */}
        <circle cx="16" cy="10" r="3" fill="#e9d5ff" stroke="#a855f7" strokeWidth={strokeWidth} />
        {/* Input fields */}
        <rect x="8" y="15" width="16" height="3" rx="1" fill="#f3e8ff" stroke="#c4b5fd" strokeWidth={strokeWidth} />
        <rect x="8" y="20" width="16" height="3" rx="1" fill="#f3e8ff" stroke="#c4b5fd" strokeWidth={strokeWidth} />
        {/* Button */}
        <rect x="10" y="25" width="12" height="2" rx="0.5" fill="#a855f7" />
      </svg>
    ),

    dashboard: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Sidebar */}
        <rect x="2" y="2" width="6" height="28" rx="1" fill="#dcfce7" stroke="#22c55e" strokeWidth={strokeWidth} />
        {/* Top stats */}
        <rect x="10" y="2" width="6" height="6" rx="1" fill="#f0fdf4" stroke="#86efac" strokeWidth={strokeWidth} />
        <rect x="18" y="2" width="6" height="6" rx="1" fill="#f0fdf4" stroke="#86efac" strokeWidth={strokeWidth} />
        <rect x="26" y="2" width="4" height="6" rx="1" fill="#f0fdf4" stroke="#86efac" strokeWidth={strokeWidth} />
        {/* Chart area */}
        <rect x="10" y="10" width="20" height="10" rx="1" fill="#f0fdf4" stroke="#86efac" strokeWidth={strokeWidth} />
        <polyline points="12,18 15,14 18,16 22,12 26,15 28,13" stroke="#22c55e" strokeWidth={strokeWidth} fill="none" />
        {/* Table */}
        <rect x="10" y="22" width="20" height="8" rx="1" fill="#f0fdf4" stroke="#86efac" strokeWidth={strokeWidth} />
        <line x1="10" y1="25" x2="30" y2="25" stroke="#86efac" strokeWidth={strokeWidth} />
        <line x1="10" y1="28" x2="30" y2="28" stroke="#86efac" strokeWidth={strokeWidth} />
      </svg>
    ),

    form: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Form fields */}
        <rect x="4" y="3" width="24" height="4" rx="1" fill="#fef3c7" stroke="#f59e0b" strokeWidth={strokeWidth} />
        <rect x="4" y="9" width="24" height="4" rx="1" fill="#fef3c7" stroke="#f59e0b" strokeWidth={strokeWidth} />
        <rect x="4" y="15" width="11" height="4" rx="1" fill="#fef3c7" stroke="#f59e0b" strokeWidth={strokeWidth} />
        <rect x="17" y="15" width="11" height="4" rx="1" fill="#fef3c7" stroke="#f59e0b" strokeWidth={strokeWidth} />
        {/* Textarea */}
        <rect x="4" y="21" width="24" height="6" rx="1" fill="#fef3c7" stroke="#f59e0b" strokeWidth={strokeWidth} />
        {/* Submit button */}
        <rect x="18" y="28" width="10" height="2" rx="0.5" fill="#f59e0b" />
      </svg>
    ),

    table: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Header */}
        <rect x="2" y="2" width="28" height="5" rx="1" fill="#e2e8f0" stroke="#64748b" strokeWidth={strokeWidth} />
        {/* Rows */}
        <rect x="2" y="8" width="28" height="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <rect x="2" y="13" width="28" height="4" fill="white" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <rect x="2" y="18" width="28" height="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <rect x="2" y="23" width="28" height="4" fill="white" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        {/* Column lines */}
        <line x1="10" y1="2" x2="10" y2="27" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <line x1="20" y1="2" x2="20" y2="27" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        {/* Pagination */}
        <rect x="11" y="28" width="10" height="2" rx="0.5" fill="#94a3b8" />
      </svg>
    ),

    detail: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Image placeholder */}
        <rect x="2" y="2" width="12" height="10" rx="1" fill="#cffafe" stroke="#06b6d4" strokeWidth={strokeWidth} />
        <circle cx="5" cy="5" r="1.5" fill="#06b6d4" />
        <polygon points="2,12 8,7 14,12" fill="#a5f3fc" />
        {/* Title and meta */}
        <line x1="16" y1="3" x2="30" y2="3" stroke="#06b6d4" strokeWidth={2} />
        <line x1="16" y1="7" x2="26" y2="7" stroke="#67e8f9" strokeWidth={strokeWidth} />
        <line x1="16" y1="10" x2="22" y2="10" stroke="#67e8f9" strokeWidth={strokeWidth} />
        {/* Content lines */}
        <line x1="2" y1="16" x2="30" y2="16" stroke="#a5f3fc" strokeWidth={strokeWidth} />
        <line x1="2" y1="20" x2="28" y2="20" stroke="#a5f3fc" strokeWidth={strokeWidth} />
        <line x1="2" y1="24" x2="30" y2="24" stroke="#a5f3fc" strokeWidth={strokeWidth} />
        <line x1="2" y1="28" x2="20" y2="28" stroke="#a5f3fc" strokeWidth={strokeWidth} />
      </svg>
    ),

    wizard: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Progress steps */}
        <circle cx="6" cy="5" r="3" fill="#6366f1" stroke="#6366f1" strokeWidth={strokeWidth} />
        <circle cx="16" cy="5" r="3" fill="#e0e7ff" stroke="#6366f1" strokeWidth={strokeWidth} />
        <circle cx="26" cy="5" r="3" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth={strokeWidth} />
        <line x1="9" y1="5" x2="13" y2="5" stroke="#6366f1" strokeWidth={strokeWidth} />
        <line x1="19" y1="5" x2="23" y2="5" stroke="#c7d2fe" strokeWidth={strokeWidth} />
        {/* Content area */}
        <rect x="4" y="10" width="24" height="14" rx="1" fill="#eef2ff" stroke="#a5b4fc" strokeWidth={strokeWidth} />
        <line x1="8" y1="14" x2="24" y2="14" stroke="#a5b4fc" strokeWidth={strokeWidth} />
        <line x1="8" y1="18" x2="20" y2="18" stroke="#c7d2fe" strokeWidth={strokeWidth} />
        {/* Buttons */}
        <rect x="4" y="26" width="8" height="3" rx="0.5" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth={strokeWidth} />
        <rect x="20" y="26" width="8" height="3" rx="0.5" fill="#6366f1" />
      </svg>
    ),

    settings: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Sidebar menu */}
        <rect x="2" y="2" width="8" height="28" rx="1" fill="#f3f4f6" stroke="#6b7280" strokeWidth={strokeWidth} />
        <line x1="4" y1="6" x2="8" y2="6" stroke="#6b7280" strokeWidth={strokeWidth} />
        <line x1="4" y1="10" x2="8" y2="10" stroke="#9ca3af" strokeWidth={strokeWidth} />
        <line x1="4" y1="14" x2="8" y2="14" stroke="#9ca3af" strokeWidth={strokeWidth} />
        {/* Settings rows */}
        <rect x="12" y="4" width="18" height="5" rx="1" fill="#f9fafb" stroke="#d1d5db" strokeWidth={strokeWidth} />
        <rect x="12" y="11" width="18" height="5" rx="1" fill="#f9fafb" stroke="#d1d5db" strokeWidth={strokeWidth} />
        <rect x="12" y="18" width="18" height="5" rx="1" fill="#f9fafb" stroke="#d1d5db" strokeWidth={strokeWidth} />
        {/* Toggles */}
        <rect x="25" y="6" width="4" height="2" rx="1" fill="#6b7280" />
        <rect x="25" y="13" width="4" height="2" rx="1" fill="#9ca3af" />
        <rect x="25" y="20" width="4" height="2" rx="1" fill="#6b7280" />
      </svg>
    ),

    profile: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Avatar */}
        <circle cx="16" cy="9" r="6" fill="#fce7f3" stroke="#ec4899" strokeWidth={strokeWidth} />
        <circle cx="16" cy="7" r="2" fill="#fbcfe8" />
        <ellipse cx="16" cy="12" rx="3" ry="2" fill="#fbcfe8" />
        {/* Info card */}
        <rect x="4" y="17" width="24" height="12" rx="1" fill="#fdf2f8" stroke="#f9a8d4" strokeWidth={strokeWidth} />
        <line x1="8" y1="21" x2="24" y2="21" stroke="#f9a8d4" strokeWidth={strokeWidth} />
        <line x1="8" y1="25" x2="20" y2="25" stroke="#fbcfe8" strokeWidth={strokeWidth} />
      </svg>
    ),

    pricing: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Three pricing cards */}
        <rect x="2" y="6" width="8" height="20" rx="1" fill="#fefce8" stroke="#eab308" strokeWidth={strokeWidth} />
        <rect x="12" y="2" width="8" height="26" rx="1" fill="#fef08a" stroke="#eab308" strokeWidth={strokeWidth} />
        <rect x="22" y="6" width="8" height="20" rx="1" fill="#fefce8" stroke="#eab308" strokeWidth={strokeWidth} />
        {/* Price labels */}
        <line x1="4" y1="10" x2="8" y2="10" stroke="#eab308" strokeWidth={2} />
        <line x1="14" y1="7" x2="18" y2="7" stroke="#eab308" strokeWidth={2} />
        <line x1="24" y1="10" x2="28" y2="10" stroke="#eab308" strokeWidth={2} />
        {/* Features */}
        <line x1="4" y1="14" x2="8" y2="14" stroke="#fde047" strokeWidth={strokeWidth} />
        <line x1="4" y1="17" x2="8" y2="17" stroke="#fde047" strokeWidth={strokeWidth} />
        <line x1="14" y1="11" x2="18" y2="11" stroke="#fde047" strokeWidth={strokeWidth} />
        <line x1="14" y1="14" x2="18" y2="14" stroke="#fde047" strokeWidth={strokeWidth} />
        <line x1="14" y1="17" x2="18" y2="17" stroke="#fde047" strokeWidth={strokeWidth} />
        <line x1="24" y1="14" x2="28" y2="14" stroke="#fde047" strokeWidth={strokeWidth} />
        <line x1="24" y1="17" x2="28" y2="17" stroke="#fde047" strokeWidth={strokeWidth} />
        {/* Buttons */}
        <rect x="3" y="22" width="6" height="2" rx="0.5" fill="#eab308" />
        <rect x="13" y="24" width="6" height="2" rx="0.5" fill="#eab308" />
        <rect x="23" y="22" width="6" height="2" rx="0.5" fill="#eab308" />
      </svg>
    ),

    contact: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Left info */}
        <rect x="2" y="4" width="12" height="24" rx="1" fill="#f0fdfa" stroke="#14b8a6" strokeWidth={strokeWidth} />
        <circle cx="8" cy="10" r="3" fill="#99f6e4" stroke="#14b8a6" strokeWidth={strokeWidth} />
        <line x1="4" y1="16" x2="12" y2="16" stroke="#5eead4" strokeWidth={strokeWidth} />
        <line x1="4" y1="20" x2="10" y2="20" stroke="#5eead4" strokeWidth={strokeWidth} />
        <line x1="4" y1="24" x2="12" y2="24" stroke="#5eead4" strokeWidth={strokeWidth} />
        {/* Right form */}
        <rect x="16" y="4" width="14" height="5" rx="1" fill="#ccfbf1" stroke="#5eead4" strokeWidth={strokeWidth} />
        <rect x="16" y="11" width="14" height="5" rx="1" fill="#ccfbf1" stroke="#5eead4" strokeWidth={strokeWidth} />
        <rect x="16" y="18" width="14" height="8" rx="1" fill="#ccfbf1" stroke="#5eead4" strokeWidth={strokeWidth} />
        <rect x="22" y="27" width="8" height="2" rx="0.5" fill="#14b8a6" />
      </svg>
    ),

    error: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Error icon */}
        <circle cx="16" cy="12" r="8" fill="#fee2e2" stroke="#ef4444" strokeWidth={strokeWidth} />
        <line x1="16" y1="8" x2="16" y2="13" stroke="#ef4444" strokeWidth={2} />
        <circle cx="16" cy="16" r="1" fill="#ef4444" />
        {/* Error message */}
        <line x1="6" y1="24" x2="26" y2="24" stroke="#fca5a5" strokeWidth={strokeWidth} />
        <line x1="8" y1="28" x2="24" y2="28" stroke="#fecaca" strokeWidth={strokeWidth} />
      </svg>
    ),

    search: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Search bar */}
        <rect x="2" y="3" width="28" height="6" rx="3" fill="#fff7ed" stroke="#f97316" strokeWidth={strokeWidth} />
        <circle cx="7" cy="6" r="2" stroke="#f97316" strokeWidth={strokeWidth} fill="none" />
        <line x1="8.5" y1="7.5" x2="10" y2="9" stroke="#f97316" strokeWidth={strokeWidth} />
        {/* Results */}
        <rect x="2" y="12" width="28" height="5" rx="1" fill="#ffedd5" stroke="#fdba74" strokeWidth={strokeWidth} />
        <rect x="2" y="19" width="28" height="5" rx="1" fill="#fff7ed" stroke="#fed7aa" strokeWidth={strokeWidth} />
        <rect x="2" y="26" width="28" height="5" rx="1" fill="#ffedd5" stroke="#fdba74" strokeWidth={strokeWidth} />
      </svg>
    ),

    checkout: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Cart summary */}
        <rect x="2" y="2" width="18" height="18" rx="1" fill="#ecfdf5" stroke="#10b981" strokeWidth={strokeWidth} />
        <line x1="4" y1="6" x2="18" y2="6" stroke="#6ee7b7" strokeWidth={strokeWidth} />
        <line x1="4" y1="10" x2="16" y2="10" stroke="#6ee7b7" strokeWidth={strokeWidth} />
        <line x1="4" y1="14" x2="18" y2="14" stroke="#6ee7b7" strokeWidth={strokeWidth} />
        <line x1="12" y1="17" x2="18" y2="17" stroke="#10b981" strokeWidth={2} />
        {/* Payment card */}
        <rect x="22" y="2" width="8" height="6" rx="1" fill="#d1fae5" stroke="#10b981" strokeWidth={strokeWidth} />
        {/* Order button */}
        <rect x="2" y="22" width="28" height="6" rx="1" fill="#10b981" />
        <line x1="10" y1="25" x2="22" y2="25" stroke="white" strokeWidth={strokeWidth} />
      </svg>
    ),

    modal: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Background overlay */}
        <rect x="0" y="0" width="32" height="32" fill="#f5f3ff" fillOpacity="0.5" />
        {/* Modal card */}
        <rect x="4" y="6" width="24" height="20" rx="2" fill="white" stroke="#8b5cf6" strokeWidth={strokeWidth} />
        {/* Header */}
        <rect x="4" y="6" width="24" height="5" rx="2" fill="#ede9fe" />
        <line x1="7" y1="9" x2="15" y2="9" stroke="#8b5cf6" strokeWidth={strokeWidth} />
        <line x1="25" y1="8" x2="25" y2="10" stroke="#a78bfa" strokeWidth={strokeWidth} />
        <line x1="24" y1="9" x2="26" y2="9" stroke="#a78bfa" strokeWidth={strokeWidth} />
        {/* Content */}
        <line x1="7" y1="15" x2="25" y2="15" stroke="#ddd6fe" strokeWidth={strokeWidth} />
        <line x1="7" y1="19" x2="22" y2="19" stroke="#ddd6fe" strokeWidth={strokeWidth} />
        {/* Buttons */}
        <rect x="14" y="22" width="6" height="2" rx="0.5" fill="#e9d5ff" stroke="#a78bfa" strokeWidth={0.5} />
        <rect x="21" y="22" width="6" height="2" rx="0.5" fill="#8b5cf6" />
      </svg>
    ),

    other: (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
        {/* Generic page layout */}
        <rect x="2" y="2" width="28" height="6" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth={strokeWidth} />
        <rect x="2" y="10" width="10" height="18" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <rect x="14" y="10" width="16" height="8" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth={strokeWidth} />
        <rect x="14" y="20" width="16" height="8" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth={strokeWidth} />
      </svg>
    ),
  };

  return thumbnails[type] || thumbnails.other;
}
