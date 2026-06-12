/**
 * 社交与媒体、创意与娱乐 — 各拓展 4 个子分类 × 10 图标
 */
import { writeFileSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const lucide = require("lucide-react");
const __dir = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dir, "../src/app/components/iconDataSocialCreative.ts");

const G = {
  blue: ["#3b82f6", "#1d4ed8"],
  indigo: ["#6366f1", "#4f46e5"],
  purple: ["#8b5cf6", "#6d28d9"],
  pink: ["#ec4899", "#be185d"],
  red: ["#ef4444", "#b91c1c"],
  orange: ["#f97316", "#c2410c"],
  amber: ["#f59e0b", "#d97706"],
  yellow: ["#eab308", "#ca8a04"],
  green: ["#10b981", "#047857"],
  teal: ["#06b6d4", "#0891b2"],
  slate: ["#64748b", "#334155"],
  dark: ["#1e293b", "#0f172a"],
  rose: ["#f43f5e", "#be123c"],
  cyan: ["#38bdf8", "#0284c7"],
  lime: ["#84cc16", "#65a30d"],
};

function pickIcon(candidates) {
  for (const name of candidates) {
    if (lucide[name]) return name;
  }
  return "Circle";
}

const SPEC = [
  {
    groupId: "connect",
    themeEmojis: ["💭", "🔴", "🎙️", "✨"],
    themes: [
      {
        id: "soc-forum",
        name: "社区论坛",
        englishName: "Community Forum",
        description: "帖子讨论与社区互动图标",
        icon: "MessagesSquare",
        prefix: "sfrm",
        icons: [
          { name: "话题帖", lucide: ["MessagesSquare"], desc: "热门讨论主题帖", g: "blue" },
          { name: "回复楼", lucide: ["MessageSquareReply"], desc: "楼层回复互动", g: "teal" },
          { name: "置顶公告", lucide: ["Pin"], desc: "版主置顶通知", g: "amber" },
          { name: "版主徽章", lucide: ["Badge"], desc: "社区管理员标识", g: "indigo" },
          { name: "点赞支持", lucide: ["ThumbsUp"], desc: "赞同优质内容", g: "green" },
          { name: "收藏帖子", lucide: ["Bookmark"], desc: "稍后阅读收藏", g: "purple" },
          { name: "标签分类", lucide: ["Tags"], desc: "话题标签归档", g: "cyan" },
          { name: "搜索帖子", lucide: ["Search"], desc: "全文检索历史", g: "slate" },
          { name: "举报屏蔽", lucide: ["ShieldAlert"], desc: "违规内容处理", g: "red" },
          { name: "用户头像", lucide: ["CircleUser"], desc: "社区成员资料", g: "pink" },
        ],
      },
      {
        id: "soc-live",
        name: "直播互动",
        englishName: "Live Streaming",
        description: "实时直播与观众互动图标",
        icon: "Radio",
        prefix: "sliv",
        icons: [
          { name: "直播中", lucide: ["Radio"], desc: "实时信号播出", g: "red", badge: "LIVE" },
          { name: "视频画面", lucide: ["Video"], desc: "高清直播推流", g: "purple" },
          { name: "弹幕评论", lucide: ["MessageSquare"], desc: "实时弹幕互动", g: "blue" },
          { name: "礼物打赏", lucide: ["Gift"], desc: "观众礼物支持", g: "pink" },
          { name: "爱心点赞", lucide: ["Heart"], desc: "直播间点赞", g: "red" },
          { name: "观众人数", lucide: ["Users"], desc: "在线观看统计", g: "teal" },
          { name: "分享直播间", lucide: ["Share2"], desc: "邀请好友观看", g: "green" },
          { name: "麦克风", lucide: ["Mic"], desc: "主播语音解说", g: "purple" },
          { name: "摄像头", lucide: ["Webcam"], desc: "镜头实时采集", g: "slate" },
          { name: "录屏回放", lucide: ["MonitorPlay"], desc: "直播录像回看", g: "indigo" },
        ],
      },
      {
        id: "soc-podcast",
        name: "播客电台",
        englishName: "Podcast & Radio",
        description: "音频节目与电台收听图标",
        icon: "Podcast",
        prefix: "spod",
        icons: [
          { name: "播客节目", lucide: ["Podcast"], desc: "订阅音频节目", g: "purple" },
          { name: "电台广播", lucide: ["Radio"], desc: "调频电台收听", g: "amber" },
          { name: "耳机收听", lucide: ["Headphones"], desc: "私密沉浸聆听", g: "slate" },
          { name: "播放列表", lucide: ["ListMusic"], desc: "节目单顺序播放", g: "blue" },
          { name: "单曲循环", lucide: ["Repeat"], desc: "重复播放模式", g: "teal" },
          { name: "随机播放", lucide: ["Shuffle"], desc: "打乱节目顺序", g: "green" },
          { name: "音量调节", lucide: ["Volume2"], desc: "声音大小控制", g: "indigo" },
          { name: "下载离线", lucide: ["Download"], desc: "缓存节目离线", g: "cyan" },
          { name: "节目封面", lucide: ["Disc"], desc: "专辑封面展示", g: "dark" },
          { name: "主持人", lucide: ["Mic2"], desc: "主播嘉宾访谈", g: "rose" },
        ],
      },
      {
        id: "soc-creator",
        name: "内容创作",
        englishName: "Content Creation",
        description: "自媒体与短视频创作图标",
        icon: "Sparkles",
        prefix: "scr8",
        icons: [
          { name: "创意火花", lucide: ["Sparkles"], desc: "灵感创作起点", g: "pink" },
          { name: "短视频", lucide: ["Clapperboard"], desc: "竖屏短片拍摄", g: "purple" },
          { name: "文案编辑", lucide: ["Type"], desc: "标题正文撰写", g: "blue" },
          { name: "封面设计", lucide: ["Image"], desc: "吸睛封面制作", g: "green" },
          { name: "数据增长", lucide: ["TrendingUp"], desc: "粉丝播放增长", g: "green", badge: "UP" },
          { name: "话题标签", lucide: ["Hash"], desc: "热门话题标记", g: "indigo" },
          { name: "定时发布", lucide: ["CalendarClock"], desc: "预约发布时间", g: "amber" },
          { name: "素材库", lucide: ["FolderOpen"], desc: "创作素材管理", g: "slate" },
          { name: "剪辑时间轴", lucide: ["LayoutList"], desc: "视频剪辑编排", g: "cyan" },
          { name: "粉丝互动", lucide: ["HeartHandshake"], desc: "与粉丝建立连接", g: "rose" },
        ],
      },
    ],
  },
  {
    groupId: "creative",
    themeEmojis: ["🎵", "📷", "✂️", "🎭"],
    themes: [
      {
        id: "cre-music",
        name: "音乐演奏",
        englishName: "Music Performance",
        description: "乐器演奏与音乐创作图标",
        icon: "Music",
        prefix: "cmus",
        icons: [
          { name: "音符旋律", lucide: ["Music"], desc: "乐谱旋律创作", g: "pink" },
          { name: "钢琴键盘", lucide: ["Piano"], desc: "键盘乐器演奏", g: "slate" },
          { name: "吉他弹奏", lucide: ["Guitar"], desc: "弦乐指弹伴奏", g: "amber" },
          { name: "架子鼓", lucide: ["Drum"], desc: "节奏打击乐器", g: "red" },
          { name: "演唱会", lucide: ["MicVocal"], desc: "现场声乐演唱", g: "purple" },
          { name: "乐谱笔记", lucide: ["Notebook"], desc: "手写谱面记录", g: "blue" },
          { name: "混音台", lucide: ["SlidersHorizontal"], desc: "音轨均衡调节", g: "indigo" },
          { name: "耳机监听", lucide: ["Headphones"], desc: "录音棚监听", g: "slate" },
          { name: "黑胶唱片", lucide: ["Disc"], desc: "复古唱片播放", g: "dark" },
          { name: "节拍器", lucide: ["Timer"], desc: "练习节奏把控", g: "teal" },
        ],
      },
      {
        id: "cre-photo",
        name: "摄影影像",
        englishName: "Photography",
        description: "摄影拍摄与后期处理图标",
        icon: "Camera",
        prefix: "cpho",
        icons: [
          { name: "单反相机", lucide: ["Camera"], desc: "专业摄影机身", g: "slate" },
          { name: "镜头变焦", lucide: ["ZoomIn"], desc: "远近焦段切换", g: "blue" },
          { name: "闪光灯", lucide: ["Zap"], desc: "补光闪光拍摄", g: "amber" },
          { name: "相册图库", lucide: ["Images"], desc: "照片批量管理", g: "green" },
          { name: "滤镜调色", lucide: ["Palette"], desc: "色调风格渲染", g: "pink" },
          { name: "裁剪构图", lucide: ["Crop"], desc: "画面比例调整", g: "slate" },
          { name: "对焦框", lucide: ["Scan"], desc: "精准对焦区域", g: "cyan" },
          { name: "延时摄影", lucide: ["Clock"], desc: "长曝光慢门", g: "indigo" },
          { name: "全景拍摄", lucide: ["Maximize2"], desc: "宽幅场景记录", g: "teal" },
          { name: "导出分享", lucide: ["Share2"], desc: "成片发布传播", g: "purple" },
        ],
      },
      {
        id: "cre-craft",
        name: "手工DIY",
        englishName: "Crafts & DIY",
        description: "手工制作与创意手作图标",
        icon: "Scissors",
        prefix: "ccrf",
        icons: [
          { name: "剪刀裁剪", lucide: ["Scissors"], desc: "布料纸张裁切", g: "red" },
          { name: "胶水粘合", lucide: ["Droplet"], desc: "手工胶合固定", g: "cyan" },
          { name: "针线缝纫", lucide: ["Pen"], desc: "刺绣缝纫工艺", g: "pink" },
          { name: "颜料上色", lucide: ["Paintbrush"], desc: "手绘涂色装饰", g: "purple" },
          { name: "木工雕刻", lucide: ["Hammer"], desc: "木器敲打塑形", g: "amber" },
          { name: "折纸造型", lucide: ["Origami"], desc: "纸张折叠艺术", g: "green" },
          { name: "陶艺塑形", lucide: ["Cylinder"], desc: "陶泥手工成型", g: "orange" },
          { name: "编织毛线", lucide: ["Ribbon"], desc: "针织编织作品", g: "rose" },
          { name: "工具箱", lucide: ["Briefcase"], desc: "手作工具收纳", g: "slate" },
          { name: "成品展示", lucide: ["Package"], desc: "手作礼物包装", g: "amber" },
        ],
      },
      {
        id: "cre-show",
        name: "演出表演",
        englishName: "Performance & Show",
        description: "舞台演出与文艺表演图标",
        icon: "Theater",
        prefix: "cshw",
        icons: [
          { name: "戏剧舞台", lucide: ["Theater"], desc: "剧场舞台表演", g: "purple" },
          { name: "马戏帐篷", lucide: ["Tent"], desc: "巡回马戏演出", g: "red" },
          { name: "魔术表演", lucide: ["Wand"], desc: "魔术道具变幻", g: "indigo" },
          { name: "舞蹈律动", lucide: ["Activity"], desc: "肢体舞蹈节奏", g: "pink" },
          { name: "喜剧笑脸", lucide: ["Smile"], desc: "脱口秀欢乐", g: "amber" },
          { name: "Tickets入场", lucide: ["Ticket"], desc: "演出门票检票", g: "orange" },
          { name: "舞台灯光", lucide: ["Zap"], desc: "追光氛围照明", g: "yellow" },
          { name: "观众席", lucide: ["Users"], desc: "台下观众互动", g: "teal" },
          { name: "节目单", lucide: ["ClipboardList"], desc: "演出流程安排", g: "blue" },
          { name: "谢幕奖杯", lucide: ["Trophy"], desc: "表演荣誉嘉奖", g: "amber" },
        ],
      },
    ],
  },
];

const themes = [];
const themeEmoji = {};
const groupThemeIds = {};

for (const group of SPEC) {
  groupThemeIds[group.groupId] = [];
  for (let ti = 0; ti < group.themes.length; ti++) {
    const t = group.themes[ti];
    groupThemeIds[group.groupId].push(t.id);
    themeEmoji[t.id] = group.themeEmojis[ti];
    const icons = t.icons.map((ic, i) => {
      const lucideName = pickIcon(ic.lucide);
      const entry = {
        id: `${t.prefix}-${i + 1}`,
        name: ic.name,
        lucideName,
        desc: ic.desc,
        defaultGradient: G[ic.g] || G.blue,
      };
      if (ic.badge) entry.defaultBadge = ic.badge;
      return entry;
    });
    themes.push({
      id: t.id,
      name: t.name,
      englishName: t.englishName,
      description: t.description,
      icon: pickIcon([t.icon]),
      icons,
    });
  }
}

function serializeTheme(theme) {
  const iconsStr = theme.icons
    .map((ic) => {
      const badge = ic.defaultBadge ? `, defaultBadge: "${ic.defaultBadge}"` : "";
      return `      { id: "${ic.id}", name: "${ic.name}", lucideName: "${ic.lucideName}", desc: "${ic.desc}", defaultGradient: ["${ic.defaultGradient[0]}", "${ic.defaultGradient[1]}"]${badge} }`;
    })
    .join(",\n");
  return `  {
    id: "${theme.id}",
    name: "${theme.name}",
    englishName: "${theme.englishName}",
    description: "${theme.description}",
    icon: "${theme.icon}",
    icons: [
${iconsStr},
    ],
  }`;
}

const file = `/** 社交与媒体、创意与娱乐 — 各拓展 4 子分类 × 10 图标 */
export const socialCreativeThemesData = [
${themes.map(serializeTheme).join(",\n")},
];

export const socialCreativeThemeEmoji: Record<string, string> = ${JSON.stringify(themeEmoji, null, 2)};

export const socialCreativeGroupThemeIds: Record<string, string[]> = ${JSON.stringify(groupThemeIds, null, 2)};
`;

writeFileSync(outPath, file, "utf8");
console.log(`Generated ${themes.length} themes (${themes.length * 10} icons) -> ${outPath}`);
