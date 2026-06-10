import { useState, useRef, useCallback } from "react";

interface Tool {
  id: number;
  name: string;
  desc: string;
  svgContent: string;
  gradient: [string, string];
  glow: string;
  badge?: string;
}

// Returns full SVG markup for a tool icon (with background gradient)
export function buildSvgMarkup(tool: Tool, size = 200): string {
  const [c1, c2] = tool.gradient;
  const scale = size / 52;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.1)"/>
    </linearGradient>
    <clipPath id="rounded"><rect width="${size}" height="${size}" rx="${size * 0.23}" ry="${size * 0.23}"/></clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.23}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" rx="${size * 0.23}" fill="url(#shine)"/>
  <g transform="translate(${(size - 52 * scale) / 2} ${(size - 52 * scale) / 2}) scale(${scale})">
    ${tool.svgContent}
  </g>
</svg>`;
}

export async function downloadAsPng(tool: Tool, size = 512) {
  const svg = buildSvgMarkup(tool, size);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(pngBlob);
      a.download = `${tool.name}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  };
  img.src = url;
}

export function downloadAsSvg(tool: Tool) {
  const svg = buildSvgMarkup(tool, 512);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${tool.name}.svg`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// SVG inner paths only (no outer svg tag, no defs with gradient ids that clash)
const toolDefs: Omit<Tool, "glow">[] = [
  {
    id: 1,
    name: "文件管理器",
    desc: "浏览和整理文件",
    gradient: ["#60a5fa", "#3b82f6"],
    svgContent: `
      <rect x="6" y="20" width="40" height="24" rx="4" fill="white" fill-opacity="0.25"/>
      <path d="M6 20 Q6 14 12 14 L22 14 Q26 14 28 18 L28 20 Z" fill="white" fill-opacity="0.9"/>
      <rect x="6" y="20" width="40" height="24" rx="4" fill="white" fill-opacity="0.1"/>
      <rect x="13" y="26" width="16" height="2.5" rx="1.2" fill="white" fill-opacity="0.6"/>
      <rect x="13" y="31" width="22" height="2.5" rx="1.2" fill="white" fill-opacity="0.5"/>
      <rect x="13" y="36" width="12" height="2.5" rx="1.2" fill="white" fill-opacity="0.4"/>
    `,
  },
  {
    id: 2,
    name: "任务管理器",
    desc: "监控系统进程",
    gradient: ["#34d399", "#059669"],
    badge: "新",
    svgContent: `
      <rect x="8" y="10" width="36" height="32" rx="4" fill="white" fill-opacity="0.1"/>
      <line x1="8" y1="26" x2="44" y2="26" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
      <line x1="8" y1="18" x2="44" y2="18" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
      <line x1="8" y1="34" x2="44" y2="34" stroke="white" stroke-opacity="0.15" stroke-width="1"/>
      <path d="M10,36 16,28 22,32 28,20 34,24 40,14 40,40 10,40 Z" fill="white" fill-opacity="0.15"/>
      <polyline points="10,36 16,28 22,32 28,20 34,24 40,14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="28" cy="20" r="3" fill="white"/>
    `,
  },
  {
    id: 3,
    name: "注册表编辑器",
    desc: "编辑系统注册表",
    gradient: ["#f472b6", "#db2777"],
    svgContent: `
      <line x1="14" y1="12" x2="14" y2="40" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="20" x2="38" y2="20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.85"/>
      <line x1="14" y1="30" x2="38" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.75"/>
      <line x1="14" y1="38" x2="32" y2="38" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.65"/>
      <line x1="26" y1="20" x2="26" y2="26" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.6"/>
      <line x1="26" y1="26" x2="40" y2="26" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.6"/>
      <rect x="10" y="8" width="8" height="8" rx="2" fill="white" fill-opacity="0.9"/>
      <rect x="34" y="16" width="8" height="8" rx="2" fill="white" fill-opacity="0.8"/>
      <rect x="34" y="26" width="8" height="8" rx="2" fill="white" fill-opacity="0.8"/>
      <rect x="34" y="36" width="8" height="8" rx="2" fill="white" fill-opacity="0.7"/>
      <rect x="36" y="22" width="6" height="6" rx="1.5" fill="white" fill-opacity="0.55"/>
    `,
  },
  {
    id: 4,
    name: "系统信息",
    desc: "查看硬件与系统详情",
    gradient: ["#a78bfa", "#7c3aed"],
    svgContent: `
      <rect x="14" y="14" width="24" height="24" rx="3" fill="white" fill-opacity="0.2"/>
      <rect x="17" y="17" width="18" height="18" rx="2" fill="white" fill-opacity="0.2"/>
      <rect x="21" y="21" width="10" height="10" rx="1.5" fill="white" fill-opacity="0.6"/>
      <rect x="8" y="19" width="6" height="2.5" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="8" y="25" width="6" height="2.5" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="8" y="31" width="6" height="2.5" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="38" y="19" width="6" height="2.5" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="38" y="25" width="6" height="2.5" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="38" y="31" width="6" height="2.5" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="19" y="8" width="2.5" height="6" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="25" y="8" width="2.5" height="6" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="31" y="8" width="2.5" height="6" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="19" y="38" width="2.5" height="6" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="25" y="38" width="2.5" height="6" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="31" y="38" width="2.5" height="6" rx="1" fill="white" fill-opacity="0.7"/>
    `,
  },
  {
    id: 5,
    name: "磁盘清理",
    desc: "释放磁盘空间",
    gradient: ["#fbbf24", "#d97706"],
    svgContent: `
      <circle cx="26" cy="26" r="18" fill="white" fill-opacity="0.15"/>
      <circle cx="26" cy="26" r="14" fill="white" fill-opacity="0.12"/>
      <path d="M26 26 L26 8 A18 18 0 0 1 44 26 Z" fill="white" fill-opacity="0.25"/>
      <circle cx="26" cy="26" r="4" fill="white" fill-opacity="0.8"/>
      <line x1="34" y1="14" x2="40" y2="8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.9"/>
      <line x1="36" y1="17" x2="44" y2="13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.7"/>
      <line x1="36" y1="12" x2="42" y2="6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.5"/>
      <circle cx="40" cy="9" r="2.5" fill="white" fill-opacity="0.95"/>
    `,
  },
  {
    id: 6,
    name: "网络监视器",
    desc: "实时流量与连接分析",
    gradient: ["#38bdf8", "#0284c7"],
    badge: "Pro",
    svgContent: `
      <path d="M10 30 Q26 10 42 30" stroke="white" stroke-width="3" stroke-linecap="round" fill="none" stroke-opacity="0.4"/>
      <path d="M15 34 Q26 18 37 34" stroke="white" stroke-width="3" stroke-linecap="round" fill="none" stroke-opacity="0.65"/>
      <path d="M20 38 Q26 26 32 38" stroke="white" stroke-width="3" stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <circle cx="26" cy="41" r="3.5" fill="white"/>
      <rect x="8" y="44" width="5" height="4" rx="1" fill="white" fill-opacity="0.35"/>
      <rect x="16" y="41" width="5" height="7" rx="1" fill="white" fill-opacity="0.55"/>
      <rect x="24" y="37" width="5" height="11" rx="1" fill="white" fill-opacity="0.75"/>
      <rect x="32" y="33" width="5" height="15" rx="1" fill="white" fill-opacity="0.65"/>
      <rect x="40" y="30" width="5" height="18" rx="1" fill="white" fill-opacity="0.45"/>
    `,
  },
  {
    id: 7,
    name: "密码管理器",
    desc: "安全存储密码",
    gradient: ["#fb923c", "#ea580c"],
    svgContent: `
      <path d="M18 22 L18 17 Q18 9 26 9 Q34 9 34 17 L34 22" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <rect x="11" y="22" width="30" height="22" rx="5" fill="white" fill-opacity="0.22"/>
      <rect x="13" y="24" width="26" height="18" rx="4" fill="white" fill-opacity="0.12"/>
      <circle cx="26" cy="32" r="4" fill="white" fill-opacity="0.85"/>
      <rect x="24" y="33" width="4" height="5" rx="1" fill="white" fill-opacity="0.85"/>
      <circle cx="16" cy="14" r="1.5" fill="white" fill-opacity="0.45"/>
      <circle cx="36" cy="12" r="1" fill="white" fill-opacity="0.35"/>
    `,
  },
  {
    id: 8,
    name: "截图工具",
    desc: "捕获屏幕内容",
    gradient: ["#e879f9", "#a21caf"],
    svgContent: `
      <rect x="8" y="18" width="36" height="24" rx="5" fill="white" fill-opacity="0.18"/>
      <circle cx="26" cy="30" r="9" fill="white" fill-opacity="0.12"/>
      <circle cx="26" cy="30" r="6.5" fill="white" fill-opacity="0.18"/>
      <circle cx="26" cy="30" r="4" fill="white" fill-opacity="0.7"/>
      <circle cx="28" cy="28" r="1.5" fill="white" fill-opacity="0.9"/>
      <rect x="19" y="13" width="10" height="6" rx="3" fill="white" fill-opacity="0.4"/>
      <rect x="36" y="20" width="5" height="4" rx="1.5" fill="white" fill-opacity="0.5"/>
      <path d="M10 20 L10 14 L16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-opacity="0.7"/>
      <path d="M42 20 L42 14 L36 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-opacity="0.7"/>
    `,
  },
  {
    id: 9,
    name: "文本编辑器",
    desc: "代码与文本编辑",
    gradient: ["#4ade80", "#16a34a"],
    svgContent: `
      <rect x="10" y="8" width="28" height="36" rx="4" fill="white" fill-opacity="0.18"/>
      <path d="M30 8 L38 16 L30 16 Z" fill="white" fill-opacity="0.35"/>
      <rect x="15" y="20" width="18" height="2" rx="1" fill="white" fill-opacity="0.8"/>
      <rect x="15" y="25" width="18" height="2" rx="1" fill="white" fill-opacity="0.7"/>
      <rect x="15" y="30" width="12" height="2" rx="1" fill="white" fill-opacity="0.6"/>
      <rect x="34" y="30" width="4" height="14" rx="1.5" fill="white" fill-opacity="0.9" transform="rotate(-40 36 37)"/>
      <path d="M29 43 L31 38 L34 41 Z" fill="white" fill-opacity="0.8"/>
    `,
  },
  {
    id: 10,
    name: "进程监控",
    desc: "CPU与内存实时监控",
    gradient: ["#f87171", "#dc2626"],
    svgContent: `
      <path d="M10 32 A16 16 0 0 1 42 32" stroke="white" stroke-width="4" stroke-linecap="round" fill="none" stroke-opacity="0.2"/>
      <path d="M10 32 A16 16 0 0 1 36.5 18.5" stroke="white" stroke-width="4" stroke-linecap="round" fill="none" stroke-opacity="0.9"/>
      <line x1="26" y1="32" x2="34" y2="16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.95"/>
      <circle cx="26" cy="32" r="3.5" fill="white" fill-opacity="0.9"/>
      <line x1="10" y1="32" x2="12" y2="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6"/>
      <line x1="18" y1="17" x2="19.4" y2="18.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6"/>
      <line x1="26" y1="12" x2="26" y2="14.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6"/>
      <line x1="34" y1="17" x2="32.6" y2="18.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6"/>
      <line x1="42" y1="32" x2="40" y2="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6"/>
      <text x="26" y="42" text-anchor="middle" fill="white" font-size="8" font-weight="600" fill-opacity="0.85">70%</text>
    `,
  },
];

const tools: Tool[] = toolDefs.map((t) => ({
  ...t,
  glow: "",
}));

// Gradient map for Tailwind classes
const gradientClasses: Record<number, { from: string; shadow: string }> = {
  1:  { from: "from-blue-400 to-blue-600",    shadow: "rgba(59,130,246,0.5)" },
  2:  { from: "from-emerald-400 to-emerald-600", shadow: "rgba(5,150,105,0.5)" },
  3:  { from: "from-pink-400 to-pink-600",    shadow: "rgba(219,39,119,0.5)" },
  4:  { from: "from-violet-400 to-violet-600", shadow: "rgba(124,58,237,0.5)" },
  5:  { from: "from-amber-400 to-amber-600",  shadow: "rgba(217,119,6,0.5)" },
  6:  { from: "from-sky-400 to-sky-600",      shadow: "rgba(2,132,199,0.5)" },
  7:  { from: "from-orange-400 to-orange-600", shadow: "rgba(234,88,12,0.5)" },
  8:  { from: "from-fuchsia-400 to-fuchsia-600", shadow: "rgba(162,28,175,0.5)" },
  9:  { from: "from-green-400 to-green-600",  shadow: "rgba(22,163,74,0.5)" },
  10: { from: "from-red-400 to-red-600",      shadow: "rgba(220,38,38,0.5)" },
};

function IconSvgPreview({ tool }: { tool: Tool }) {
  const [c1, c2] = tool.gradient;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id={`bg-${tool.id}`} x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      {/* transparent bg, the outer div supplies the gradient */}
      <g dangerouslySetInnerHTML={{ __html: tool.svgContent }} />
    </svg>
  );
}

function DownloadMenu({
  tool,
  onClose,
}: {
  tool: Tool;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute left-1/2 -bottom-2 z-30 translate-y-full -translate-x-1/2"
      style={{ minWidth: 140 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* arrow */}
      <div
        className="mx-auto w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "6px solid rgba(15,23,42,0.95)",
          width: 0,
          height: 0,
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      <div
        className="rounded-xl overflow-hidden border border-white/10"
        style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}
      >
        <p
          className="text-white/40 px-3 pt-2.5 pb-1"
          style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          下载图标
        </p>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors text-left"
          onClick={() => { downloadAsPng(tool, 512); onClose(); }}
        >
          <span style={{ fontSize: "16px" }}>🖼️</span>
          <div>
            <p className="text-white" style={{ fontSize: "12px", fontWeight: 500 }}>PNG 格式</p>
            <p className="text-white/40" style={{ fontSize: "10px" }}>512 × 512 px</p>
          </div>
        </button>
        <div className="mx-3 border-t border-white/8" />
        <button
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors text-left"
          onClick={() => { downloadAsSvg(tool); onClose(); }}
        >
          <span style={{ fontSize: "16px" }}>✏️</span>
          <div>
            <p className="text-white" style={{ fontSize: "12px", fontWeight: 500 }}>SVG 格式</p>
            <p className="text-white/40" style={{ fontSize: "10px" }}>矢量可缩放</p>
          </div>
        </button>
        <div className="px-3 pb-2.5 pt-1">
          <button
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => { downloadAsPng(tool, 1024); onClose(); }}
          >
            <span style={{ fontSize: "14px" }}>⬆️</span>
            <p className="text-white/70" style={{ fontSize: "11px" }}>PNG 高清版 (1024px)</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToolIconGrid() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState<number | null>(null);

  const handleDownloadClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleIconClick = () => {
    setMenuOpen(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8"
      onClick={() => setMenuOpen(null)}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70" style={{ fontSize: "13px" }}>Windows 工具集 v2.0</span>
        </div>
        <h1 className="text-white mb-2" style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          系统工具集
        </h1>
        <p className="text-white/50" style={{ fontSize: "15px" }}>10 款精心设计的实用工具 · 悬停图标可下载</p>
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-5 gap-8 max-w-3xl w-full">
        {tools.map((tool) => {
          const { from, shadow } = gradientClasses[tool.id];
          const isHovered = hovered === tool.id;
          const isMenuOpen = menuOpen === tool.id;

          return (
            <div
              key={tool.id}
              className="flex flex-col items-center gap-3 relative"
              onMouseEnter={() => setHovered(tool.id)}
              onMouseLeave={() => { setHovered(null); }}
            >
              {/* Icon button */}
              <button
                onClick={handleIconClick}
                className={`
                  relative w-20 h-20 rounded-2xl
                  bg-gradient-to-br ${from}
                  flex items-center justify-center
                  transition-all duration-200 cursor-default
                  ${isHovered ? "scale-110" : "scale-100"}
                `}
                style={{
                  boxShadow: isHovered
                    ? `0 20px 40px -8px ${shadow}, 0 0 0 1px rgba(255,255,255,0.12) inset`
                    : `0 8px 20px -4px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset`,
                  border: "none",
                }}
              >
                {/* Shimmer */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />
                {/* Icon SVG */}
                <div className="relative z-10">
                  <IconSvgPreview tool={tool} />
                </div>
                {/* Hover ring */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/25 pointer-events-none" />
                )}
                {/* Badge */}
                {tool.badge && (
                  <div
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-white text-slate-900 pointer-events-none"
                    style={{ fontSize: "10px", fontWeight: 700, lineHeight: "16px" }}
                  >
                    {tool.badge}
                  </div>
                )}
              </button>

              {/* Download button — appears on hover */}
              {isHovered && (
                <button
                  className={`
                    absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full
                    flex items-center gap-1 px-3 py-1 rounded-full
                    text-white transition-all duration-150 z-20
                    ${isMenuOpen ? "bg-white/25" : "bg-white/15 hover:bg-white/25"}
                  `}
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    whiteSpace: "nowrap",
                    marginTop: "2px",
                  }}
                  onClick={(e) => handleDownloadClick(e, tool.id)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1 L5 7 M2 5 L5 8 L8 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1" y1="9" x2="9" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  下载
                </button>
              )}

              {/* Download menu */}
              {isMenuOpen && (
                <DownloadMenu
                  tool={tool}
                  onClose={() => setMenuOpen(null)}
                />
              )}

              {/* Label */}
              <div className="text-center" style={{ marginTop: isHovered ? "28px" : "0" }}>
                <p
                  className="text-white/90 transition-colors duration-150"
                  style={{ fontSize: "12px", fontWeight: 500, lineHeight: "1.3", whiteSpace: "nowrap" }}
                >
                  {tool.name}
                </p>
                <p className="text-white/40 mt-0.5" style={{ fontSize: "10px", lineHeight: "1.3" }}>
                  {tool.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom hint */}
      <p className="text-white/20 mt-14" style={{ fontSize: "12px" }}>
        悬停图标 → 点击「下载」→ 选择格式
      </p>
    </div>
  );
}
