'use client';

interface PouchProps {
  className?: string;
}

export function StandUpPouchSVG({ className = 'h-24 w-20' }: PouchProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="152" rx="38" ry="5" fill="#e2e8f0" />
      <path
        d="M20 40 C20 40 18 140 25 145 C32 150 88 150 95 145 C102 140 100 40 100 40"
        fill="url(#sup-grad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <path
        d="M25 145 C32 138 88 138 95 145 C88 150 32 150 25 145Z"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect x="28" y="38" width="64" height="4" rx="2" fill="#64748b" />
      <rect x="28" y="34" width="64" height="4" rx="2" fill="#94a3b8" />
      <path d="M24 34 L96 34 L100 40 L20 40 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M18 37 L24 37" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 1" />
      <path
        d="M35 50 C35 50 32 120 36 130"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />
      <rect
        x="38"
        y="60"
        width="44"
        height="55"
        rx="6"
        fill="white"
        fillOpacity="0.25"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <defs>
        <linearGradient
          id="sup-grad"
          x1="20"
          y1="40"
          x2="100"
          y2="145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1f5f9" />
          <stop offset="0.5" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ThreeSideSealSVG({ className = 'h-24 w-20' }: PouchProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="152" rx="32" ry="4" fill="#e2e8f0" />
      <rect
        x="25"
        y="20"
        width="70"
        height="125"
        rx="3"
        fill="url(#tss-grad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <rect
        x="25"
        y="20"
        width="70"
        height="8"
        rx="2"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x="25"
        y="137"
        width="70"
        height="8"
        rx="2"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect x="25" y="28" width="8" height="109" fill="#e2e8f0" />
      <rect x="87" y="28" width="8" height="109" fill="#e2e8f0" />
      <path d="M22 50 L25 50" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="20" cy="50" r="2" fill="#94a3b8" />
      <rect
        x="38"
        y="45"
        width="44"
        height="80"
        rx="4"
        fill="white"
        fillOpacity="0.2"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <path
        d="M40 35 C40 35 38 100 40 125"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <defs>
        <linearGradient
          id="tss-grad"
          x1="25"
          y1="20"
          x2="95"
          y2="145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EightSideSealSVG({ className = 'h-24 w-20' }: PouchProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="153" rx="36" ry="5" fill="#e2e8f0" />
      <path
        d="M22 30 L22 140 L40 150 L80 150 L98 140 L98 30 Z"
        fill="url(#ess-grad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <path
        d="M22 30 L22 140 L40 150 L40 40 Z"
        fill="#cbd5e1"
        fillOpacity="0.5"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <path
        d="M98 30 L98 140 L80 150 L80 40 Z"
        fill="#cbd5e1"
        fillOpacity="0.5"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <path d="M40 150 L80 150 L98 140 L22 140 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      <path d="M22 30 L40 40 L80 40 L98 30 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <rect x="40" y="38" width="40" height="3" rx="1.5" fill="#64748b" />
      <rect
        x="45"
        y="55"
        width="30"
        height="70"
        rx="4"
        fill="white"
        fillOpacity="0.2"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <path
        d="M48 50 L48 125"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <defs>
        <linearGradient
          id="ess-grad"
          x1="22"
          y1="30"
          x2="98"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#d1d5db" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GussetedBagSVG({ className = 'h-24 w-20' }: PouchProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="152" rx="35" ry="4" fill="#e2e8f0" />
      <path
        d="M28 25 L28 145 L92 145 L92 25 Z"
        fill="url(#gb-grad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <path d="M28 25 L28 145 L18 140 L18 30 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      <path d="M92 25 L92 145 L102 140 L102 30 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      <path d="M28 30 L28 140" stroke="#b0b8c4" strokeWidth="0.8" strokeDasharray="4 3" />
      <path d="M92 30 L92 140" stroke="#b0b8c4" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect
        x="18"
        y="22"
        width="84"
        height="8"
        rx="2"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x="38"
        y="45"
        width="44"
        height="80"
        rx="4"
        fill="white"
        fillOpacity="0.2"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <path
        d="M40 35 L40 130"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <defs>
        <linearGradient
          id="gb-grad"
          x1="28"
          y1="25"
          x2="92"
          y2="145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fef3c7" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FlatBottomBagSVG({ className = 'h-24 w-20' }: PouchProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="153" rx="38" ry="5" fill="#e2e8f0" />
      <path
        d="M20 35 L20 130 L35 148 L85 148 L100 130 L100 35 Z"
        fill="url(#fb-grad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <path
        d="M20 130 L35 148 L85 148 L100 130 Z"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <path d="M25 132 L95 132" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 2" />
      <path d="M20 35 L20 130" stroke="#b0b8c4" strokeWidth="1" />
      <path d="M100 35 L100 130" stroke="#b0b8c4" strokeWidth="1" />
      <rect
        x="20"
        y="30"
        width="80"
        height="8"
        rx="2"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect x="30" y="36" width="60" height="3" rx="1.5" fill="#64748b" />
      <circle cx="75" cy="50" r="4" fill="#94a3b8" />
      <circle cx="75" cy="50" r="2" fill="#64748b" />
      <rect
        x="32"
        y="55"
        width="56"
        height="65"
        rx="4"
        fill="white"
        fillOpacity="0.2"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <path
        d="M35 45 L35 120"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <defs>
        <linearGradient
          id="fb-grad"
          x1="20"
          y1="35"
          x2="100"
          y2="148"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1f5f9" />
          <stop offset="0.6" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FlatPouchSVG({ className = 'h-24 w-20' }: PouchProps) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="150" rx="34" ry="4" fill="#e2e8f0" />
      <path
        d="M25 20 C20 20 18 25 18 30 L18 140 C18 145 22 148 25 148 L95 148 C98 148 102 145 102 140 L102 30 C102 25 100 20 95 20 Z"
        fill="url(#fp-grad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line x1="60" y1="20" x2="60" y2="148" stroke="#94a3b8" strokeWidth="2" />
      <line
        x1="57"
        y1="20"
        x2="57"
        y2="148"
        stroke="#b0b8c4"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <line
        x1="63"
        y1="20"
        x2="63"
        y2="148"
        stroke="#b0b8c4"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <path d="M25 20 L95 20" stroke="#94a3b8" strokeWidth="2.5" />
      <path d="M25 23 L95 23" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 1" />
      <path d="M25 148 L95 148" stroke="#94a3b8" strokeWidth="2.5" />
      <rect
        x="30"
        y="40"
        width="22"
        height="90"
        rx="4"
        fill="white"
        fillOpacity="0.2"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <rect
        x="68"
        y="40"
        width="22"
        height="90"
        rx="4"
        fill="white"
        fillOpacity="0.2"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <path
        d="M35 30 L35 135"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <defs>
        <linearGradient
          id="fp-grad"
          x1="18"
          y1="20"
          x2="102"
          y2="148"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** 仅 4 种袋型插图 */
export const POUCH_ILLUSTRATIONS: Record<string, React.FC<PouchProps>> = {
  'stand-up': StandUpPouchSVG,
  gusseted: GussetedBagSVG,
  'flat-pouch': FlatPouchSVG,
  'flat-bottom': FlatBottomBagSVG,
};
