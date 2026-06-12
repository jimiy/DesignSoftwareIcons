// IconGenerator.tsx – Full-featured icon generator UI
import { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import {
  themesData,
  themeGroups,
  THEME_EMOJI,
  getThemeGroupId,
  keywordToIconMap,
  PRESET_GRADIENTS,
} from "./iconData";
import { smoothPoints, strokesToSvgContent, generateProceduralIcon } from "./sketchUtils";
import { downloadAsPng, downloadAsSvg, buildSvgMarkup } from "./ToolIcons"; // reuse existing utilities

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

// Helper to retrieve a Lucide component by its export name
function getLucideComponent(name: string): any {
  const Comp = (LucideIcons as any)[name];
  return Comp ? Comp : null;
}

// Dictionary mapping Chinese concept keywords to Lucide icon export names
const CHINESE_TO_LUCIDE: Record<string, string> = {
  // Animals
  "猫": "Cat", "狗": "Dog", "鱼": "Fish", "鸟": "Bird", "兔子": "Rabbit", "虫": "Bug",
  // Food & Drink
  "咖啡": "Coffee", "披萨": "Pizza", "蛋糕": "Cake", "苹果": "Apple", "啤酒": "Beer", "汉堡": "Burger", "水": "GlassWater", "冰淇淋": "IceCream", "餐具": "Utensils", "厨师": "ChefHat",
  // Office & Tech
  "电脑": "Laptop", "笔记本": "Laptop", "手机": "Smartphone", "平板": "Tablet", "键盘": "Keyboard", "鼠标": "Mouse", "打印机": "Printer", "耳机": "Headphones", "音箱": "Speaker", "芯片": "Cpu", "cpu": "Cpu", "数据库": "Database", "终端": "Terminal", "命令行": "Terminal", "服务器": "Server", "文件夹": "Folder", "文件": "FileText", "文档": "FileText", "邮件": "Mail", "信箱": "Mail", "邮箱": "Mail", "日历": "Calendar", "日程": "Calendar", "计算器": "Calculator",
  // Home & Weather
  "房": "Home", "家": "Home", "灯": "Lightbulb", "电灯": "Lightbulb", "电视": "Tv", "锁": "Lock", "安全锁": "Lock", "钥匙": "Key", "闹钟": "Clock", "钟": "Clock", "时钟": "Clock", "太阳": "Sun", "晴": "Sun", "月亮": "Moon", "夜": "Moon", "云": "Cloud", "雨": "CloudRain", "雪": "CloudSnow", "闪电": "Zap", "电": "Zap", "雷": "CloudLightning", "风": "Wind", "树": "Trees", "森林": "Trees", "花": "Flower", "叶": "Leaf", "绿叶": "Leaf",
  // Tools & Science
  "设置": "Settings", "齿轮": "Settings", "搜索": "Search", "放大镜": "Search", "垃圾桶": "Trash2", "删除": "Trash2", "清理": "Trash2", "剪刀": "Scissors", "刷子": "Brush", "画笔": "Paintbrush", "锤子": "Hammer", "扳手": "Wrench", "指南针": "Compass", "罗盘": "Compass", "显微镜": "Microscope", "化学": "FlaskConical", "烧杯": "FlaskConical", "地球": "Globe", "世界": "Globe", "书": "BookOpen", "阅读": "BookOpen",
  // Finance & Commerce
  "钱包": "Wallet", "卡": "CreditCard", "银行卡": "CreditCard", "信用卡": "CreditCard", "金币": "Coins", "硬币": "Coins", "钱": "Coins", "购物车": "ShoppingCart", "买": "ShoppingCart", "购物袋": "ShoppingBag", "商店": "Store", "店铺": "Store", "标签": "Tag", "价格": "Tag", "礼物": "Gift", "礼品": "Gift", "奖杯": "Trophy", "冠军": "Trophy", "皇冠": "Crown", "国王": "Crown", "星星": "Star", "收藏": "Star",
  // Social & Communication
  "聊天": "MessageSquare", "消息": "MessageSquare", "微信": "MessageSquare", "短信": "MessageSquare", "电话": "Phone", "通话": "Phone", "用户": "Users", "人": "Users", "团队": "Users", "心": "Heart", "爱心": "Heart", "喜欢": "Heart", "铃铛": "Bell", "通知": "Bell", "提醒": "Bell", "分享": "Share2", "链接": "Link", "网址": "Link", "盾牌": "Shield", "安全": "Shield", "防御": "Shield",
  // Media
  "播放": "Play", "暂停": "Pause", "音乐": "Music", "歌": "Music", "音符": "Music", "麦克风": "Mic", "话筒": "Mic", "录音": "Mic", "视频": "Video", "摄像": "Video", "相机": "Camera", "拍照": "Camera", "照相": "Camera", "照片": "Image", "图片": "Image", "相册": "Image",
  // Transportation & Navigation
  "飞机": "Plane", "航空": "Plane", "火车": "Train", "高铁": "Train", "汽车": "Car", "车": "Car", "单车": "Bicycle", "自行车": "Bicycle", "地图": "Map", "定位": "MapPin", "地标": "MapPin", "导航": "Navigation", "指南": "Navigation", "向上": "ArrowUp", "向下": "ArrowDown", "向左": "ArrowLeft", "向右": "ArrowRight"
};

// Helper to resolve Lucide component name by query keyword (English fuzzy/exact, Chinese dictionary match/substring)
const resolveLucideName = (term: string): string | null => {
  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) return null;

  // 1. Check direct English match (case-insensitive) in LucideIcons
  const englishMatch = Object.keys(LucideIcons).find(
    (key) => key.toLowerCase() === cleanTerm
  );
  if (englishMatch) return englishMatch;

  // 2. Check direct Chinese match in our dictionary
  if (CHINESE_TO_LUCIDE[cleanTerm]) {
    const name = CHINESE_TO_LUCIDE[cleanTerm];
    if ((LucideIcons as any)[name]) return name;
  }

  // 3. Check substring match in Chinese dictionary (e.g. "小猫" contains "猫")
  const containingKey = Object.keys(CHINESE_TO_LUCIDE).find(
    (key) => cleanTerm.includes(key)
  );
  if (containingKey) {
    const name = CHINESE_TO_LUCIDE[containingKey];
    if ((LucideIcons as any)[name]) return name;
  }

  // Check if dictionary keys contain search term
  const containedKey = Object.keys(CHINESE_TO_LUCIDE).find(
    (key) => key.includes(cleanTerm)
  );
  if (containedKey) {
    const name = CHINESE_TO_LUCIDE[containedKey];
    if ((LucideIcons as any)[name]) return name;
  }

  // 4. Try fuzzy match with English Lucide keys (e.g. if user types "arrow" and we have "ArrowUp")
  const fuzzyEnglishMatch = Object.keys(LucideIcons).find(
    (key) => key.toLowerCase().includes(cleanTerm)
  );
  if (fuzzyEnglishMatch) return fuzzyEnglishMatch;

  return null;
};

export function IconGenerator() {
  // -------------------- State --------------------
  const [selectedTheme, setSelectedTheme] = useState(themesData[0]);
  const [selectedIcon, setSelectedIcon] = useState(selectedTheme.icons[0]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set([getThemeGroupId(themesData[0].id) ?? themeGroups[0].id])
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedIcon, setGeneratedIcon] = useState<any>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [bgStyle, setBgStyle] = useState("gradient"); // gradient | solid | none
  const [gradient, setGradient] = useState(PRESET_GRADIENTS[0].colors);
  const [solidColor, setSolidColor] = useState("#3b82f6");
  const [badge, setBadge] = useState("");

  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "svg" | "ico">("png");
  const [exportSize, setExportSize] = useState<number>(256);

  // -------------------- Theme / Icon Logic --------------------
  const handleThemeSelect = (themeId: string) => {
    const theme = themesData.find((t) => t.id === themeId) || themesData[0];
    setSelectedTheme(theme);
    setSelectedIcon(theme.icons[0]);
    setBadge(theme.icons[0].defaultBadge || "");
    setGeneratedIcon(null);
    const groupId = getThemeGroupId(theme.id);
    if (groupId) {
      setExpandedGroups((prev) => new Set([...prev, groupId]));
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const handleIconSelect = (iconId: string) => {
    const icon = selectedTheme.icons.find((i) => i.id === iconId) || selectedTheme.icons[0];
    setSelectedIcon(icon);
    setBadge(icon.defaultBadge || "");
    setGeneratedIcon(null);
  };

  const randomizeIcon = () => {
    const randIdx = Math.floor(Math.random() * selectedTheme.icons.length);
    const icon = selectedTheme.icons[randIdx];
    setSelectedIcon(icon);
    setBadge(icon.defaultBadge || "");
    setGeneratedIcon(null);
  };

  const handleSearchGenerate = () => {
    const key = searchTerm.trim();
    if (!key) return;

    const lowercaseKey = key.toLowerCase();
    if (keywordToIconMap[lowercaseKey]) {
      const map = keywordToIconMap[lowercaseKey];
      setGeneratedIcon({
        lucideName: map.lucideName,
        name: map.name,
        desc: map.desc,
        gradient: PRESET_GRADIENTS[0].colors,
      });
      return;
    }

    const resolvedLucide = resolveLucideName(key);
    if (resolvedLucide) {
      setGeneratedIcon({
        lucideName: resolvedLucide,
        name: key,
        desc: `基于提示词 "${key}" 生成的智能匹配图标`,
        gradient: PRESET_GRADIENTS[0].colors,
      });
    } else {
      const svgContent = generateProceduralIcon(key);
      setGeneratedIcon({
        lucideName: "",
        name: key,
        desc: "系统自动生成的抽象创意图标",
        gradient: PRESET_GRADIENTS[0].colors,
        svgContent,
      });
    }
  };

  // -------------------- Sketch Canvas --------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startDrawing = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setStrokes([{ points: [point], color: "#ffffff", width: 2 }]);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setStrokes((prev) => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, points: [...last.points, point] }];
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokes.forEach((s) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      s.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  }, [strokes]);

  const convertSketchToIcon = () => {
    const svgContent = strokesToSvgContent(strokes, 52);
    setGeneratedIcon({
      lucideName: "",
      name: "手绘草图",
      desc: "基于画布绘制的图标",
      gradient: PRESET_GRADIENTS[0].colors,
      svgContent,
    });
    setStrokes([]);
  };

  // Helper to resolve the SVG content (including Lucide paths)
  const getIconWithSvgContent = (icon: any) => {
    if (!icon) return null;
    if (icon.svgContent) return icon;

    if (icon.lucideName) {
      const IconComp = getLucideComponent(icon.lucideName);
      const rendered = IconComp ? IconComp.render?.({ size: 24 }, null) : null;
      const iconNode = rendered?.props?.iconNode;
      if (iconNode) {
        const paths = iconNode
          .map(([tag, attrs]: [string, any]) => {
            const attrStr = Object.entries(attrs || {})
              .filter(([key]) => key !== "key")
              .map(([key, val]) => `${key}="${val}"`)
              .join(" ");
            return `<${tag} ${attrStr} />`;
          })
          .join("\n");
        const svgContent = `<g transform="translate(10, 10) scale(1.33)" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">${paths}</g>`;
        return { ...icon, svgContent };
      }
    }
    return icon;
  };

  const pngToIco = (pngBuffer: ArrayBuffer, size: number): Blob => {
    const pngSize = pngBuffer.byteLength;
    const icoHeader = new ArrayBuffer(22);
    const view = new DataView(icoHeader);

    // ICO Header
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type (1 = ICO)
    view.setUint16(4, 1, true); // Image count (1)

    // ICO Directory Entry
    view.setUint8(6, size >= 256 ? 0 : size); // Width
    view.setUint8(7, size >= 256 ? 0 : size); // Height
    view.setUint8(8, 0); // Palette count
    view.setUint8(9, 0); // Reserved
    view.setUint16(10, 1, true); // Color planes (1)
    view.setUint16(12, 32, true); // Bits per pixel (32)
    view.setUint32(14, pngSize, true); // Size of PNG data
    view.setUint32(18, 22, true); // Offset of PNG data (22)

    return new Blob([icoHeader, pngBuffer], { type: "image/x-icon" });
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const handleExport = async () => {
    const rawTool = generatedIcon || selectedIcon;
    const tool = getIconWithSvgContent(rawTool);
    if (!tool) return;

    if (exportFormat === "svg") {
      downloadAsSvg({ ...tool, gradient });
      return;
    }

    const size = exportSize;
    const svg = buildSvgMarkup({ ...tool, gradient }, size);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      if (exportFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      if (exportFormat === "png") {
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return;
          triggerDownload(pngBlob, `${tool.name}.png`);
        }, "image/png");
      } else if (exportFormat === "jpeg") {
        canvas.toBlob((jpegBlob) => {
          if (!jpegBlob) return;
          triggerDownload(jpegBlob, `${tool.name}.jpg`);
        }, "image/jpeg", 0.95);
      } else if (exportFormat === "ico") {
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return;
          const reader = new FileReader();
          reader.onloadend = () => {
            const buffer = reader.result as ArrayBuffer;
            const icoBlob = pngToIco(buffer, size);
            triggerDownload(icoBlob, `${tool.name}.ico`);
          };
          reader.readAsArrayBuffer(pngBlob);
        }, "image/png");
      }
    };
    img.src = url;
  };

  const sizeOptions = exportFormat === "svg"
    ? []
    : exportFormat === "ico"
    ? [16, 32, 48, 64, 128, 256]
    : [16, 32, 48, 64, 128, 256, 512, 1024];

  useEffect(() => {
    if (exportFormat === "ico" && exportSize > 256) {
      setExportSize(256);
    } else if (exportFormat === "svg") {
      setExportSize(0);
    } else if (exportSize === 0) {
      setExportSize(256);
    }
  }, [exportFormat, exportSize]);

  // -------------------- Render Helpers --------------------
  const renderIcon = (icon: any) => {
    const iconWithContent = getIconWithSvgContent(icon) || icon;
    const grad = iconWithContent.gradient || iconWithContent.defaultGradient || PRESET_GRADIENTS[0].colors;
    const [c1, c2] = grad;
    const svgInner = iconWithContent.svgContent
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" fill="none" width="52" height="52">${iconWithContent.svgContent}</svg>`
      : buildSvgMarkup({ ...iconWithContent, gradient: grad, svgContent: "", glow: "", badge: undefined }, 52);
    const bgStyleObj = bgStyle === "gradient"
      ? { background: `linear-gradient(135deg, ${c1}, ${c2})` }
      : bgStyle === "solid"
      ? { background: solidColor }
      : { background: "transparent" };
      
    const isSelected = generatedIcon ? (icon === generatedIcon) : (icon.id === selectedIcon.id);
    const activeBadge = isSelected ? badge : (icon.defaultBadge || "");

    return (
      <div
        className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
        style={bgStyleObj}
      >
        <div dangerouslySetInnerHTML={{ __html: svgInner }} className="flex items-center justify-center" />
        {activeBadge && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border border-gray-900 leading-none">
            {activeBadge}
          </span>
        )}
      </div>
    );
  };

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white flex select-none">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-64 bg-gray-800 p-5 overflow-y-auto border-r border-gray-700 flex flex-col shrink-0">
          <div className="flex items-center space-x-2.5 mb-6">
            <span className="text-xl">🎨</span>
            <h2 className="text-base font-bold tracking-wider text-gray-100">主题分类</h2>
          </div>
          <ul className="space-y-2 flex-1">
            {themeGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              const hasActiveTheme = group.themeIds.includes(selectedTheme.id);
              return (
                <li key={group.id}>
                  <button
                    type="button"
                    className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm cursor-pointer ${
                      hasActiveTheme && !isExpanded
                        ? "bg-indigo-600/30 text-indigo-200"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <span className="text-base">{group.emoji}</span>
                    <span className="flex-1 text-left">{group.name}</span>
                    <span className="text-[10px] text-gray-500">{group.themeIds.length}</span>
                    <span className="text-xs text-gray-500">{isExpanded ? "▾" : "▸"}</span>
                  </button>
                  {isExpanded && (
                    <ul className="mt-1 ml-2 pl-2 border-l border-gray-700/60 space-y-0.5">
                      {group.themeIds.map((themeId) => {
                        const theme = themesData.find((t) => t.id === themeId);
                        if (!theme) return null;
                        const isActive = selectedTheme.id === theme.id;
                        return (
                          <li
                            key={theme.id}
                            className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200 text-xs font-medium ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                : "text-gray-400 hover:bg-gray-700/80 hover:text-gray-200"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleThemeSelect(theme.id);
                            }}
                          >
                            <span className="text-sm">{THEME_EMOJI[theme.id] ?? "📌"}</span>
                            <span className="truncate">{theme.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>
      )}

      {/* Main area */}
      <main className="flex-1 p-6 overflow-y-auto flex flex-col bg-gray-900/40">
        {/* Header controls */}
        <section className="flex items-center mb-6 space-x-4 bg-gray-800 p-4 rounded-xl border border-gray-700/50 shadow-md">
          <button
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition cursor-pointer font-medium text-xs flex items-center space-x-2 text-white"
            onClick={() => setShowSidebar((s) => !s)}
          >
            <span>{showSidebar ? "⬅️" : "➡️"}</span>
            <span>{showSidebar ? "隐藏侧栏" : "显示侧栏"}</span>
          </button>
          <button
            className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition cursor-pointer font-medium text-xs flex items-center space-x-2 text-white"
            onClick={randomizeIcon}
          >
            <span>🎲</span>
            <span>随机图标</span>
          </button>
          
          <div className="flex-1 flex items-center space-x-2 bg-gray-950 rounded-lg px-3 py-1.5 border border-gray-700/50">
            <span className="text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="输入关键词生成图标..."
              className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchGenerate()}
            />
          </div>
          
          <button
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition cursor-pointer font-semibold text-xs text-white"
            onClick={handleSearchGenerate}
          >
            生成图标
          </button>
        </section>

        {/* Two-column Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Side: Icon Grid & Preview */}
          <div className="lg:col-span-2 flex flex-col h-full bg-gray-800/20 border border-gray-800/60 rounded-2xl p-6 shadow-inner">
            <h3 className="text-sm font-bold mb-4 text-gray-300 flex items-center">
              <span className="mr-2">📂</span>
              {generatedIcon ? "搜索生成结果" : `${selectedTheme.name} · 图标集`}
            </h3>
            
            {/* Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {(generatedIcon ? [generatedIcon] : selectedTheme.icons).map((ic, idx) => {
                const isSelected = !generatedIcon && selectedIcon.id === ic.id;
                return (
                  <div
                    key={ic.id || idx}
                    className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                      isSelected 
                        ? "border-indigo-500 bg-gray-800 shadow-lg scale-105" 
                        : "border-transparent bg-gray-800/40 hover:bg-gray-850 hover:border-gray-700/50 hover:scale-102"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!generatedIcon) handleIconSelect(ic.id);
                    }}
                  >
                    {renderIcon(ic)}
                    <p className="mt-3 text-xs font-semibold tracking-wide text-gray-100 text-center truncate w-full">{ic.name}</p>
                    <p className="text-[10px] text-gray-400 text-center mt-1.5 leading-relaxed line-clamp-2 w-full h-8 overflow-hidden">{ic.desc}</p>
                  </div>
                );
              })}
            </section>
          </div>

          {/* Right Side: Customization & Inspector Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Customization Panel */}
            <section className="p-5 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-md">
              <h3 className="text-xs font-bold mb-4 text-gray-200 flex items-center border-b border-gray-700/50 pb-2.5">
                <span className="mr-2 text-sm">⚙️</span>外观配置
              </h3>
              
              {/* Background Style Options */}
              <div className="mb-4">
                <label className="block text-[11px] text-gray-400 mb-2 font-medium">背景风格</label>
                <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1 rounded-lg border border-gray-700/30">
                  {(["gradient", "solid", "none"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      className={`py-1.5 rounded-md text-[10px] font-semibold transition cursor-pointer text-center ${
                        bgStyle === style
                          ? "bg-gray-800 text-white shadow-sm"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      onClick={() => setBgStyle(style)}
                    >
                      {style === "gradient" ? "渐变" : style === "solid" ? "纯色" : "透明"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient Options */}
              {bgStyle === "gradient" && (
                <div className="mb-4 transition-opacity duration-300">
                  <label className="block text-[11px] text-gray-400 mb-2 font-medium">渐变色彩</label>
                  <select 
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500" 
                    value={gradient.join(",")} 
                    onChange={(e) => {
                      const [c1, c2] = e.target.value.split(",");
                      setGradient([c1, c2]);
                    }}
                  >
                    {PRESET_GRADIENTS.map((g) => (
                      <option key={g.name} value={g.colors.join(",")}>{g.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Solid Color Option */}
              {bgStyle === "solid" && (
                <div className="mb-4 transition-opacity duration-300">
                  <label className="block text-[11px] text-gray-400 mb-2 font-medium">背景颜色</label>
                  <div className="flex items-center space-x-3 bg-gray-950 p-2 border border-gray-700/50 rounded-lg">
                    <input 
                      type="color" 
                      value={solidColor} 
                      onChange={(e) => setSolidColor(e.target.value)} 
                      className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <span className="text-[11px] font-mono text-gray-300 uppercase select-all">{solidColor}</span>
                  </div>
                </div>
              )}

              {/* Badge Text Input */}
              <div className="mt-4">
                <label className="block text-[11px] text-gray-400 mb-2 font-medium">徽标文字 (可选)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 placeholder-gray-700 focus:outline-none focus:border-indigo-500" 
                  value={badge} 
                  onChange={(e) => setBadge(e.target.value)} 
                  placeholder="例如：新、Pro、VIP" 
                />
              </div>
            </section>

            {/* Sketch Canvas */}
            <section className="p-5 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-md">
              <h3 className="text-xs font-bold mb-4 text-gray-200 flex items-center border-b border-gray-700/50 pb-2.5">
                <span className="mr-2 text-sm">✍️</span>草图绘制
              </h3>
              <div className="flex flex-col items-center justify-center bg-gray-950 rounded-xl p-3 border border-gray-700/30">
                <canvas 
                  ref={canvasRef} 
                  width={200} 
                  height={200} 
                  className="border border-gray-700 bg-gray-900 rounded-lg cursor-crosshair shadow-inner" 
                  onMouseDown={startDrawing} 
                  onMouseMove={draw} 
                  onMouseUp={stopDrawing} 
                  onMouseLeave={stopDrawing} 
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button 
                  className="px-3 py-2 bg-purple-600 text-[10px] font-bold rounded-lg hover:bg-purple-500 transition cursor-pointer text-center text-white" 
                  onClick={convertSketchToIcon}
                >
                  转换为图标
                </button>
                <button 
                  className="px-3 py-2 bg-gray-700 text-[10px] font-bold rounded-lg hover:bg-gray-650 transition cursor-pointer text-center text-gray-300" 
                  onClick={() => setStrokes([])}
                >
                  清空画布
                </button>
              </div>
            </section>

            {/* Export Panel */}
            <section className="p-5 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-md">
              <h3 className="text-xs font-bold mb-4 text-gray-200 flex items-center border-b border-gray-700/50 pb-2.5">
                <span className="mr-2 text-sm">📥</span>导出设置
              </h3>
              
              {/* Format Select */}
              <div className="mb-4">
                <label className="block text-[11px] text-gray-400 mb-2 font-medium">文件格式</label>
                <div className="grid grid-cols-4 gap-1.5 bg-gray-950 p-1 rounded-lg border border-gray-700/30">
                  {(["png", "jpeg", "svg", "ico"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      className={`py-1.5 rounded-md text-[10px] font-semibold transition cursor-pointer text-center ${
                        exportFormat === fmt
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      onClick={() => setExportFormat(fmt)}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Select */}
              {exportFormat !== "svg" && (
                <div className="mb-4 transition-all duration-300">
                  <label className="block text-[11px] text-gray-400 mb-2 font-medium">图片尺寸 (像素)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer border text-center ${
                          exportSize === sz
                            ? "bg-blue-600 text-white border-blue-500 shadow"
                            : "bg-gray-950 text-gray-400 border-gray-700/40 hover:bg-gray-900 hover:text-gray-200"
                        }`}
                        onClick={() => setExportSize(sz)}
                      >
                        {sz} × {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {exportFormat === "svg" && (
                <div className="mb-4 text-[10px] text-gray-500 italic leading-relaxed">
                  * SVG 格式是矢量图，支持无损放大，无需选择分辨率尺寸。
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleExport}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-600/15 hover:from-indigo-500 hover:to-blue-500 transition duration-200 flex items-center justify-center space-x-2 cursor-pointer text-xs"
              >
                <span>📥</span>
                <span>
                  {exportFormat === "svg"
                    ? "下载 SVG 矢量图标"
                    : `下载 ${exportFormat.toUpperCase()} (${exportSize})`}
                </span>
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IconGenerator;
