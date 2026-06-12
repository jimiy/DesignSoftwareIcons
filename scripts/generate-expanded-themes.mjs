/**
 * Generates iconDataExpanded.ts — 6 groups × 5 themes × 10 icons
 */
import { writeFileSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const lucide = require("lucide-react");
const __dir = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dir, "../src/app/components/iconDataExpanded.ts");

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

/** @type {Array<{groupId:string,groupName:string,groupEmoji:string,themes:Array<{id:string,name:string,englishName:string,description:string,icon:string,prefix:string,icons:Array<{name:string,lucide:string[],desc:string,g?:string,badge?:string}>}>}>} */
const SPEC = [
  {
    groupId: "animals",
    groupName: "动物与宠物",
    groupEmoji: "🐾",
    themes: [
      {
        id: "ani-pets",
        name: "萌宠日常",
        englishName: "Pets & Companions",
        description: "猫狗兔等家庭萌宠互动图标",
        icon: "Cat",
        prefix: "apet",
        icons: [
          { name: "家猫", lucide: ["Cat"], desc: "慵懒家猫陪伴", g: "amber" },
          { name: "忠犬", lucide: ["Dog"], desc: "忠诚守护伙伴", g: "orange" },
          { name: "小兔", lucide: ["Rabbit"], desc: "软萌跳跃宠物", g: "pink" },
          { name: "金鱼", lucide: ["Fish"], desc: "观赏鱼缸精灵", g: "cyan" },
          { name: "鸟笼", lucide: ["Bird"], desc: "鸣禽与鹦鹉", g: "green" },
          { name: "仓鼠", lucide: ["Squirrel"], desc: "小巧活泼宠物", g: "amber" },
          { name: "乌龟", lucide: ["Turtle"], desc: "慢节奏长寿宠", g: "green" },
          { name: "蜗牛", lucide: ["Snail"], desc: "慢生活治愈系", g: "teal" },
          { name: "爪印", lucide: ["PawPrint"], desc: "宠物足迹留念", g: "pink" },
          { name: "宠物碗", lucide: ["Utensils"], desc: "定时投喂提醒", g: "slate" },
        ],
      },
      {
        id: "ani-wild",
        name: "野生动物",
        englishName: "Wild Animals",
        description: "森林草原野生动物图标",
        icon: "Trees",
        prefix: "awld",
        icons: [
          { name: "松鼠", lucide: ["Squirrel"], desc: "林间敏捷跳跃", g: "amber" },
          { name: "野兔", lucide: ["Rabbit"], desc: "草原奔跑生灵", g: "green" },
          { name: "飞鸟", lucide: ["Bird"], desc: "天空自由翱翔", g: "blue" },
          { name: "游鱼", lucide: ["Fish"], desc: "溪流野生鱼群", g: "cyan" },
          { name: "昆虫", lucide: ["Bug"], desc: "微观生态链", g: "lime" },
          { name: "龟甲", lucide: ["Turtle"], desc: "湿地缓慢爬行", g: "teal" },
          { name: "密林", lucide: ["Trees"], desc: "野生动物栖息地", g: "green" },
          { name: "山峰", lucide: ["Mountain"], desc: "高山猛兽领地", g: "slate" },
          { name: "足迹", lucide: ["Footprints"], desc: "追踪动物痕迹", g: "amber" },
          { name: "望远镜", lucide: ["Binoculars"], desc: "远距生态观察", g: "indigo" },
        ],
      },
      {
        id: "ani-sea",
        name: "海洋生物",
        englishName: "Marine Life",
        description: "深海浅海海洋生物图标",
        icon: "Fish",
        prefix: "asea",
        icons: [
          { name: "热带鱼", lucide: ["Fish"], desc: "珊瑚礁观赏鱼", g: "cyan" },
          { name: "海浪", lucide: ["Waves"], desc: "潮汐涌动浪花", g: "blue" },
          { name: "船锚", lucide: ["Anchor"], desc: "港口停泊定位", g: "slate" },
          { name: "帆船", lucide: ["Sailboat"], desc: "近海扬帆航行", g: "teal" },
          { name: "远洋轮", lucide: ["Ship"], desc: "深海科考航行", g: "indigo" },
          { name: "贝壳", lucide: ["Shell"], desc: "海滩拾贝纪念", g: "pink" },
          { name: "水滴", lucide: ["Droplet"], desc: "海水纯净度", g: "cyan" },
          { name: "地球水域", lucide: ["Globe"], desc: "全球海洋覆盖", g: "blue" },
          { name: "潜水", lucide: ["Glasses"], desc: "水下潜游装备", g: "teal" },
          { name: "指南针", lucide: ["Compass"], desc: "海上导航定位", g: "amber" },
        ],
      },
      {
        id: "ani-bird",
        name: "飞禽鸟类",
        englishName: "Birds & Aviary",
        description: "候鸟鸣禽与观鸟图标",
        icon: "Bird",
        prefix: "abrd",
        icons: [
          { name: "麻雀", lucide: ["Bird"], desc: "城市常见飞鸟", g: "amber" },
          { name: "羽翼", lucide: ["Feather"], desc: "轻盈飞翔翅膀", g: "blue" },
          { name: "日出观鸟", lucide: ["Sunrise"], desc: "清晨林间观鸟", g: "orange" },
          { name: "月亮夜栖", lucide: ["Moon"], desc: "夜行鸟类栖息", g: "indigo" },
          { name: "树梢", lucide: ["TreePine"], desc: "枝头筑巢地点", g: "green" },
          { name: "森林", lucide: ["Trees"], desc: "鸟类天然家园", g: "lime" },
          { name: "双筒镜", lucide: ["Binoculars"], desc: "远距离观鸟", g: "slate" },
          { name: "相机抓拍", lucide: ["Camera"], desc: "记录飞鸟瞬间", g: "purple" },
          { name: "风向标", lucide: ["Wind"], desc: "气流飞行辅助", g: "teal" },
          { name: "地图迁徙", lucide: ["Map"], desc: "候鸟迁徙路线", g: "green" },
        ],
      },
      {
        id: "ani-bug",
        name: "昆虫爬虫",
        englishName: "Insects & Reptiles",
        description: "昆虫与小型爬行动物图标",
        icon: "Bug",
        prefix: "abug",
        icons: [
          { name: "甲虫", lucide: ["Bug"], desc: "微观昆虫世界", g: "lime" },
          { name: "蜗牛慢爬", lucide: ["Snail"], desc: "湿润慢行者", g: "green" },
          { name: "乌龟爬行", lucide: ["Turtle"], desc: "甲壳爬行动物", g: "teal" },
          { name: "叶片", lucide: ["Leaf"], desc: "昆虫栖息叶片", g: "green" },
          { name: "花朵", lucide: ["Flower"], desc: "授粉昆虫乐园", g: "pink" },
          { name: "放大镜", lucide: ["Search"], desc: "微观昆虫观察", g: "slate" },
          { name: "显微镜", lucide: ["Microscope"], desc: "实验室标本", g: "purple" },
          { name: "试管", lucide: ["FlaskConical"], desc: "昆虫样本保存", g: "cyan" },
          { name: "记录本", lucide: ["Notebook"], desc: "田野调查笔记", g: "amber" },
          { name: "标本夹", lucide: ["ClipboardList"], desc: "分类归档记录", g: "slate" },
        ],
      },
    ],
  },
  {
    groupId: "architecture",
    groupName: "建筑与工程",
    groupEmoji: "🏗️",
    themes: [
      {
        id: "bld-landmark",
        name: "地标建筑",
        englishName: "Landmarks",
        description: "著名建筑与城市地标图标",
        icon: "Landmark",
        prefix: "blmk",
        icons: [
          { name: "地标塔", lucide: ["Landmark"], desc: "城市象征建筑", g: "slate" },
          { name: "古典城堡", lucide: ["Castle"], desc: "历史古堡遗迹", g: "purple" },
          { name: "摩天楼", lucide: ["Building2"], desc: "高层商务大厦", g: "blue" },
          { name: "办公楼", lucide: ["Building"], desc: "企业总部大楼", g: "indigo" },
          { name: "工厂烟囱", lucide: ["Factory"], desc: "工业制造园区", g: "slate" },
          { name: "仓储物流", lucide: ["Warehouse"], desc: "大型货物仓库", g: "amber" },
          { name: "银行大厦", lucide: ["Landmark"], desc: "金融核心建筑", g: "green" },
          { name: "学校校舍", lucide: ["School"], desc: "校园教学楼群", g: "blue" },
          { name: "医院大楼", lucide: ["Hospital"], desc: "医疗救治中心", g: "red" },
          { name: "宗教殿堂", lucide: ["Church"], desc: "教堂庙宇建筑", g: "purple" },
        ],
      },
      {
        id: "bld-construct",
        name: "施工建设",
        englishName: "Construction",
        description: "工地施工与建造过程图标",
        icon: "Hammer",
        prefix: "bcon",
        icons: [
          { name: "施工锤", lucide: ["Hammer"], desc: "敲击加固作业", g: "amber" },
          { name: "安全帽", lucide: ["HardHat"], desc: "工地安全防护", g: "orange" },
          { name: "路障锥", lucide: ["TrafficCone"], desc: "施工区域警示", g: "orange" },
          { name: "工程建造", lucide: ["Construction"], desc: "大型基建项目", g: "slate" },
          { name: "扳手工具", lucide: ["Wrench"], desc: "机械安装调试", g: "slate" },
          { name: "电钻", lucide: ["Drill"], desc: "墙面打孔作业", g: "blue" },
          { name: "斧头", lucide: ["Axe"], desc: "木料切割加工", g: "amber" },
          { name: "铁镐", lucide: ["Pickaxe"], desc: "地基开挖工具", g: "slate" },
          { name: "铁砧", lucide: ["Anvil"], desc: "金属锻造平台", g: "dark" },
          { name: "围栏", lucide: ["Fence"], desc: "工地边界围挡", g: "green" },
        ],
      },
      {
        id: "bld-interior",
        name: "室内空间",
        englishName: "Interior Design",
        description: "家装室内与软装图标",
        icon: "Sofa",
        prefix: "bint",
        icons: [
          { name: "沙发", lucide: ["Sofa"], desc: "客厅休闲座椅", g: "amber" },
          { name: "床铺", lucide: ["Bed"], desc: "卧室休息空间", g: "indigo" },
          { name: "台灯", lucide: ["Lamp"], desc: "局部氛围照明", g: "amber" },
          { name: "落地灯", lucide: ["LampFloor"], desc: "角落柔和灯光", g: "orange" },
          { name: "书架", lucide: ["BookOpen"], desc: "墙面收纳展示", g: "slate" },
          { name: "窗帘", lucide: ["Blinds"], desc: "遮光隐私调节", g: "purple" },
          { name: "地毯", lucide: ["RectangleHorizontal"], desc: "地面软装铺设", g: "rose" },
          { name: "花瓶", lucide: ["Flower"], desc: "桌面花艺装饰", g: "pink" },
          { name: "挂画", lucide: ["Frame"], desc: "墙面艺术点缀", g: "purple" },
          { name: "浴室", lucide: ["Bath"], desc: "卫浴清洁空间", g: "cyan" },
        ],
      },
      {
        id: "bld-urban",
        name: "城市规划",
        englishName: "Urban Planning",
        description: "市政交通与城市布局图标",
        icon: "Map",
        prefix: "burb",
        icons: [
          { name: "城市地图", lucide: ["Map"], desc: "城区规划蓝图", g: "green" },
          { name: "路标", lucide: ["Signpost"], desc: "道路方向指引", g: "blue" },
          { name: "精准定位", lucide: ["MapPinned"], desc: "地块坐标标记", g: "red" },
          { name: "公交线路", lucide: ["Bus"], desc: "公共交通网络", g: "green" },
          { name: "地铁轨道", lucide: ["Train"], desc: "地下轨道交通", g: "indigo" },
          { name: "交通灯", lucide: ["TrafficCone"], desc: "路口秩序管理", g: "orange" },
          { name: "加油站", lucide: ["Fuel"], desc: "能源补给站点", g: "amber" },
          { name: "停车场", lucide: ["Car"], desc: "车辆停放区域", g: "slate" },
          { name: "网格布局", lucide: ["Grid3x3"], desc: "街区网格规划", g: "slate" },
          { name: "分区图层", lucide: ["Layers"], desc: "功能分区叠加", g: "purple" },
        ],
      },
      {
        id: "bld-infra",
        name: "基础设施",
        englishName: "Infrastructure",
        description: "水电管网与公共设施图标",
        icon: "Plug",
        prefix: "binf",
        icons: [
          { name: "电力插座", lucide: ["Plug"], desc: "供电接口节点", g: "amber" },
          { name: "水管阀门", lucide: ["Droplets"], desc: "供水管网控制", g: "cyan" },
          { name: "路由器", lucide: ["Router"], desc: "通信网络枢纽", g: "blue" },
          { name: "服务器", lucide: ["Server"], desc: "数据中心机房", g: "slate" },
          { name: "集装箱", lucide: ["Container"], desc: "货运周转单元", g: "orange" },
          { name: "叉车", lucide: ["Forklift"], desc: "仓储搬运设备", g: "amber" },
          { name: "货运卡车", lucide: ["Truck"], desc: "公路货物运输", g: "slate" },
          { name: "消防栓", lucide: ["FireExtinguisher"], desc: "消防安全设施", g: "red" },
          { name: "警报器", lucide: ["Siren"], desc: "公共预警系统", g: "red" },
          { name: "路灯", lucide: ["Lightbulb"], desc: "夜间道路照明", g: "amber" },
        ],
      },
    ],
  },
  {
    groupId: "fashion",
    groupName: "时尚美妆",
    groupEmoji: "👗",
    themes: [
      {
        id: "fsh-cloth",
        name: "服饰穿搭",
        englishName: "Clothing",
        description: "日常穿搭与服装品类图标",
        icon: "Shirt",
        prefix: "fclo",
        icons: [
          { name: "T恤衫", lucide: ["Shirt"], desc: "休闲上衣搭配", g: "blue" },
          { name: "礼服裙", lucide: ["Shirt"], desc: "正式场合着装", g: "purple" },
          { name: "围巾", lucide: ["Ribbon"], desc: "秋冬保暖配饰", g: "rose" },
          { name: "皇冠", lucide: ["Crown"], desc: "高端奢华系列", g: "amber" },
          { name: "徽章", lucide: ["Badge"], desc: "品牌标识刺绣", g: "indigo" },
          { name: "尺码尺", lucide: ["Ruler"], desc: "合身尺寸测量", g: "slate" },
          { name: "剪刀裁剪", lucide: ["Scissors"], desc: "定制剪裁工艺", g: "slate" },
          { name: "针线", lucide: ["Pen"], desc: "手工缝纫细节", g: "pink" },
          { name: "衣架", lucide: ["Shirt"], desc: "衣柜陈列收纳", g: "slate" },
          { name: "购物袋", lucide: ["ShoppingBag"], desc: "新品购买带走", g: "pink" },
        ],
      },
      {
        id: "fsh-access",
        name: "珠宝配饰",
        englishName: "Accessories",
        description: "首饰手表与精致配饰图标",
        icon: "Gem",
        prefix: "facc",
        icons: [
          { name: "宝石", lucide: ["Gem"], desc: "璀璨钻石珠宝", g: "purple" },
          { name: "手表", lucide: ["Watch"], desc: "精致腕间时计", g: "slate" },
          { name: "眼镜", lucide: ["Glasses"], desc: "时尚镜框搭配", g: "slate" },
          { name: "丝带", lucide: ["Ribbon"], desc: "礼盒装饰丝带", g: "pink" },
          { name: "奖章", lucide: ["Medal"], desc: "荣誉勋章配饰", g: "amber" },
          { name: "星星", lucide: ["Star"], desc: "闪耀点缀元素", g: "amber" },
          { name: "皇冠头饰", lucide: ["Crown"], desc: "华贵头冠饰品", g: "yellow" },
          { name: "钥匙扣", lucide: ["Key"], desc: "随身小物挂件", g: "amber" },
          { name: "礼盒", lucide: ["Gift"], desc: "首饰精美包装", g: "red" },
          { name: "标签", lucide: ["Tag"], desc: "品牌吊牌价格", g: "orange" },
        ],
      },
      {
        id: "fsh-beauty",
        name: "美容护肤",
        englishName: "Beauty & Skincare",
        description: "护肤彩妆与美容护理图标",
        icon: "Sparkles",
        prefix: "fbea",
        icons: [
          { name: "闪耀", lucide: ["Sparkles"], desc: "肌肤光泽焕亮", g: "pink" },
          { name: "化妆刷", lucide: ["Brush"], desc: "彩妆上妆工具", g: "rose" },
          { name: "镜子", lucide: ["Scan"], desc: "妆容检查镜", g: "slate" },
          { name: "水滴精华", lucide: ["Droplet"], desc: "保湿精华液", g: "cyan" },
          { name: "花瓣面膜", lucide: ["Flower"], desc: "植物护肤面膜", g: "pink" },
          { name: "香水", lucide: ["Sprout"], desc: "芬芳香氛喷雾", g: "purple" },
          { name: "指甲", lucide: ["Hand"], desc: "美甲护理服务", g: "rose" },
          { name: "吹风机", lucide: ["Wind"], desc: "发型吹干造型", g: "teal" },
          { name: "梳子", lucide: ["AlignJustify"], desc: "梳理顺滑发丝", g: "slate" },
          { name: "浴缸", lucide: ["Bath"], desc: "SPA放松护理", g: "cyan" },
        ],
      },
      {
        id: "fsh-shoes",
        name: "鞋靴箱包",
        englishName: "Shoes & Bags",
        description: "鞋履箱包与出行搭配图标",
        icon: "Backpack",
        prefix: "fsho",
        icons: [
          { name: "背包", lucide: ["Backpack"], desc: "日常通勤背包", g: "blue" },
          { name: "行李箱", lucide: ["Luggage"], desc: "旅行拉杆箱包", g: "slate" },
          { name: "购物袋", lucide: ["ShoppingBag"], desc: "逛街购物手提", g: "pink" },
          { name: "公文包", lucide: ["Briefcase"], desc: "商务皮质手袋", g: "slate" },
          { name: "包裹", lucide: ["Package"], desc: "快递鞋盒包装", g: "amber" },
          { name: "鞋印", lucide: ["Footprints"], desc: "步行足迹记录", g: "green" },
          { name: "尺码", lucide: ["Ruler"], desc: "鞋码精准测量", g: "slate" },
          { name: "标签价", lucide: ["Tag"], desc: "新品吊牌价格", g: "orange" },
          { name: "星星好评", lucide: ["Star"], desc: "买家五星评价", g: "amber" },
          { name: "礼物盒", lucide: ["Gift"], desc: "节日赠礼包装", g: "red" },
        ],
      },
      {
        id: "fsh-trend",
        name: "潮流街拍",
        englishName: "Street Fashion",
        description: "街拍潮流与时尚活动图标",
        icon: "Camera",
        prefix: "ftrd",
        icons: [
          { name: "街拍相机", lucide: ["Camera"], desc: "捕捉街头造型", g: "slate" },
          { name: "闪光灯", lucide: ["Flashlight"], desc: "夜间补光拍摄", g: "amber" },
          { name: "视频街拍", lucide: ["Video"], desc: "动态穿搭记录", g: "purple" },
          { name: "分享潮流", lucide: ["Share2"], desc: "社交平台发布", g: "blue" },
          { name: "点赞热度", lucide: ["Heart"], desc: "穿搭受欢迎度", g: "red" },
          { name: "话题标签", lucide: ["Hash"], desc: "潮流话题标记", g: "indigo" },
          { name: "麦克风", lucide: ["Mic"], desc: "时尚采访录音", g: "purple" },
          { name: "舞台走秀", lucide: ["Zap"], desc: "秀场灯光焦点", g: "amber" },
          { name: "奖杯", lucide: ["Trophy"], desc: "设计大赛获奖", g: "yellow" },
          { name: "日历活动", lucide: ["Calendar"], desc: "时装周日程", g: "blue" },
        ],
      },
    ],
  },
  {
    groupId: "farm",
    groupName: "农业田园",
    groupEmoji: "🌾",
    themes: [
      {
        id: "frm-crop",
        name: "农作物",
        englishName: "Crops",
        description: "粮食果蔬与经济作物图标",
        icon: "Wheat",
        prefix: "fcrop",
        icons: [
          { name: "小麦", lucide: ["Wheat"], desc: "金黄麦穗丰收", g: "amber" },
          { name: "苹果", lucide: ["Apple"], desc: "果园红富士", g: "red" },
          { name: "樱桃", lucide: ["Cherry"], desc: "初夏浆果采摘", g: "rose" },
          { name: "葡萄", lucide: ["Grape"], desc: "藤蔓挂果成熟", g: "purple" },
          { name: "柑橘", lucide: ["Citrus"], desc: "柑橘类水果", g: "orange" },
          { name: "胡萝卜", lucide: ["Carrot"], desc: "根茎蔬菜种植", g: "orange" },
          { name: "沙拉菜", lucide: ["Salad"], desc: "绿叶蔬菜组合", g: "green" },
          { name: "饼干谷", lucide: ["Cookie"], desc: "谷物烘焙原料", g: "amber" },
          { name: "糖果", lucide: ["Candy"], desc: "甜蜜农产品加工", g: "pink" },
          { name: "种子", lucide: ["Sprout"], desc: "播种育苗起点", g: "lime" },
        ],
      },
      {
        id: "frm-garden",
        name: "园艺花卉",
        englishName: "Gardening",
        description: "庭院园艺与花卉培育图标",
        icon: "Flower",
        prefix: "fgar",
        icons: [
          { name: "盛开", lucide: ["Flower"], desc: "庭院鲜花绽放", g: "pink" },
          { name: "嫩苗", lucide: ["Sprout"], desc: "新芽破土生长", g: "lime" },
          { name: "绿叶", lucide: ["Leaf"], desc: "健康叶片繁茂", g: "green" },
          { name: "松树", lucide: ["TreePine"], desc: "常青景观树木", g: "green" },
          { name: "阔叶树", lucide: ["TreeDeciduous"], desc: "四季变换乔木", g: "lime" },
          { name: "浇水", lucide: ["Droplets"], desc: "定时灌溉养护", g: "cyan" },
          { name: "阳光", lucide: ["Sun"], desc: "光合作用能量", g: "amber" },
          { name: "铲子", lucide: ["Shovel"], desc: "松土翻耕工具", g: "slate" },
          { name: "剪刀", lucide: ["Scissors"], desc: "修剪枝叶造型", g: "slate" },
          { name: "花盆", lucide: ["Sprout"], desc: "盆栽绿植摆放", g: "green" },
        ],
      },
      {
        id: "frm-tool",
        name: "农机工具",
        englishName: "Farm Tools",
        description: "农业生产机械与农具图标",
        icon: "Tractor",
        prefix: "ftool",
        icons: [
          { name: "拖拉机", lucide: ["Tractor"], desc: "田间牵引动力", g: "green" },
          { name: "铁锹", lucide: ["Shovel"], desc: "翻土挖坑农具", g: "slate" },
          { name: "斧头", lucide: ["Axe"], desc: "砍伐清理林木", g: "amber" },
          { name: "铁镐", lucide: ["Pickaxe"], desc: "坚硬土壤开垦", g: "slate" },
          { name: "锤子", lucide: ["Hammer"], desc: "搭建农舍围栏", g: "amber" },
          { name: "扳手", lucide: ["Wrench"], desc: "机械维修保养", g: "slate" },
          { name: "电钻", lucide: ["Drill"], desc: "设备安装打孔", g: "blue" },
          { name: "货车", lucide: ["Truck"], desc: "农产品运输", g: "slate" },
          { name: "叉车", lucide: ["Forklift"], desc: "粮仓装卸搬运", g: "orange" },
          { name: "围栏", lucide: ["Fence"], desc: "牧场边界划分", g: "green" },
        ],
      },
      {
        id: "frm-livestock",
        name: "畜牧养殖",
        englishName: "Livestock",
        description: "家禽牲畜与养殖管理图标",
        icon: "Egg",
        prefix: "flive",
        icons: [
          { name: "鸡蛋", lucide: ["Egg"], desc: "家禽产蛋收获", g: "amber" },
          { name: "鸡腿", lucide: ["Drumstick"], desc: "禽类肉制品", g: "orange" },
          { name: "牛奶", lucide: ["Milk"], desc: "牧场鲜奶采集", g: "blue" },
          { name: "狗看护", lucide: ["Dog"], desc: "牧场巡逻守护", g: "amber" },
          { name: "猫捕鼠", lucide: ["Cat"], desc: "粮仓防鼠卫士", g: "slate" },
          { name: "兔子", lucide: ["Rabbit"], desc: "小型牲畜养殖", g: "pink" },
          { name: "鱼池", lucide: ["Fish"], desc: "水产池塘养殖", g: "cyan" },
          { name: "鸟禽", lucide: ["Bird"], desc: "散养家禽群体", g: "green" },
          { name: "饲料", lucide: ["Wheat"], desc: "谷物饲料配比", g: "amber" },
          { name: "储罐", lucide: ["Cylinder"], desc: "饲料储存容器", g: "slate" },
        ],
      },
      {
        id: "frm-rural",
        name: "田园风光",
        englishName: "Rural Scenery",
        description: "乡村自然与田园生活图标",
        icon: "Mountain",
        prefix: "frur",
        icons: [
          { name: "远山", lucide: ["Mountain"], desc: "层峦叠嶂远景", g: "slate" },
          { name: "森林", lucide: ["Trees"], desc: "乡间茂密树林", g: "green" },
          { name: "日出", lucide: ["Sunrise"], desc: "清晨田间晨曦", g: "orange" },
          { name: "彩虹", lucide: ["Rainbow"], desc: "雨后天空奇观", g: "purple" },
          { name: "云朵", lucide: ["Cloud"], desc: "田园天空云彩", g: "blue" },
          { name: "微风", lucide: ["Wind"], desc: "麦浪随风摇曳", g: "teal" },
          { name: "小溪", lucide: ["Waves"], desc: "灌溉水渠溪流", g: "cyan" },
          { name: "帐篷", lucide: ["Tent"], desc: "乡间露营体验", g: "green" },
          { name: "篝火", lucide: ["Flame"], desc: "夜晚篝火晚会", g: "orange" },
          { name: "小径", lucide: ["Route"], desc: "田间漫步小路", g: "lime" },
        ],
      },
    ],
  },
  {
    groupId: "law",
    groupName: "法律政务",
    groupEmoji: "⚖️",
    themes: [
      {
        id: "law-doc",
        name: "法律文书",
        englishName: "Legal Documents",
        description: "合同诉状与公证文书图标",
        icon: "ScrollText",
        prefix: "ldoc",
        icons: [
          { name: "卷宗", lucide: ["ScrollText"], desc: "案件卷宗归档", g: "slate" },
          { name: "合同", lucide: ["FileText"], desc: "双方协议签署", g: "blue" },
          { name: "印章", lucide: ["Stamp"], desc: "官方盖章认证", g: "red" },
          { name: "签名", lucide: ["Pen"], desc: "手写签字确认", g: "indigo" },
          { name: "书签", lucide: ["BookMarked"], desc: "法条重点标记", g: "amber" },
          { name: "档案夹", lucide: ["Folder"], desc: "分类存放文书", g: "slate" },
          { name: "剪贴", lucide: ["Clipboard"], desc: "庭审记录板", g: "slate" },
          { name: "清单", lucide: ["ClipboardList"], desc: "证据材料列表", g: "blue" },
          { name: "加密", lucide: ["FileKey"], desc: "涉密文件保护", g: "purple" },
          { name: "公证", lucide: ["BadgeCheck"], desc: "法律效力认证", g: "green" },
        ],
      },
      {
        id: "law-gov",
        name: "政府机构",
        englishName: "Government",
        description: "政务办公与公共服务图标",
        icon: "Landmark",
        prefix: "lgov",
        icons: [
          { name: "政府大楼", lucide: ["Landmark"], desc: "行政服务中心", g: "slate" },
          { name: "身份证", lucide: ["IdCard"], desc: "公民身份凭证", g: "blue" },
          { name: "徽章", lucide: ["Badge"], desc: "公务人员标识", g: "indigo" },
          { name: "公告", lucide: ["Megaphone"], desc: "政策信息发布", g: "orange" },
          { name: "报纸", lucide: ["Newspaper"], desc: "政务公开通报", g: "slate" },
          { name: "邮箱", lucide: ["Mail"], desc: "政务信件收发", g: "blue" },
          { name: "电话", lucide: ["Phone"], desc: "市民服务热线", g: "green" },
          { name: "日历", lucide: ["Calendar"], desc: "政务工作日程", g: "amber" },
          { name: "用户", lucide: ["Users"], desc: "公务员团队", g: "teal" },
          { name: "握手", lucide: ["Handshake"], desc: "政企合作签约", g: "green" },
        ],
      },
      {
        id: "law-justice",
        name: "公共秩序",
        englishName: "Public Order",
        description: "执法安保与秩序维护图标",
        icon: "Scale",
        prefix: "ljust",
        icons: [
          { name: "天平", lucide: ["Scale"], desc: "公正司法象征", g: "amber" },
          { name: "法槌", lucide: ["Gavel"], desc: "庭审宣判敲击", g: "slate" },
          { name: "盾牌", lucide: ["Shield"], desc: "执法力量保护", g: "blue" },
          { name: "警铃", lucide: ["Siren"], desc: "紧急事件警报", g: "red" },
          { name: "救护车", lucide: ["Ambulance"], desc: "医疗急救响应", g: "red" },
          { name: "灭火器", lucide: ["FireExtinguisher"], desc: "消防安全处置", g: "red" },
          { name: "监控", lucide: ["Cctv"], desc: "公共区域监控", g: "slate" },
          { name: "指纹", lucide: ["Fingerprint"], desc: "身份生物识别", g: "purple" },
          { name: "钥匙", lucide: ["Key"], desc: "门禁权限管理", g: "amber" },
          { name: "锁", lucide: ["Lock"], desc: "重要场所封锁", g: "slate" },
        ],
      },
      {
        id: "law-vote",
        name: "选举投票",
        englishName: "Elections & Voting",
        description: "民主选举与民意投票图标",
        icon: "Vote",
        prefix: "lvote",
        icons: [
          { name: "投票箱", lucide: ["Vote"], desc: "选票投入箱中", g: "blue" },
          { name: "勾选", lucide: ["CheckSquare"], desc: "候选人勾选", g: "green" },
          { name: "旗帜", lucide: ["Flag"], desc: "竞选宣传旗帜", g: "red" },
          { name: "演讲", lucide: ["Megaphone"], desc: "竞选公开演讲", g: "orange" },
          { name: "人群", lucide: ["Users"], desc: "选民集会参与", g: "teal" },
          { name: "统计", lucide: ["BarChart"], desc: "票数实时统计", g: "indigo" },
          { name: "饼图", lucide: ["PieChart"], desc: "得票比例分析", g: "purple" },
          { name: "趋势", lucide: ["TrendingUp"], desc: "支持率变化", g: "green" },
          { name: "日历", lucide: ["CalendarDays"], desc: "投票日安排", g: "amber" },
          { name: "奖章", lucide: ["Medal"], desc: "当选胜利纪念", g: "yellow" },
        ],
      },
      {
        id: "law-aid",
        name: "维权援助",
        englishName: "Legal Aid",
        description: "法律援助与权益保护图标",
        icon: "HeartHandshake",
        prefix: "laid",
        icons: [
          { name: "爱心援助", lucide: ["HeartHandshake"], desc: "公益法律援助", g: "pink" },
          { name: "咨询", lucide: ["MessageCircle"], desc: "在线法律咨询", g: "blue" },
          { name: "电话热线", lucide: ["Phone"], desc: "维权热线拨打", g: "green" },
          { name: "搜索", lucide: ["Search"], desc: "法条案例检索", g: "slate" },
          { name: "帮助", lucide: ["LifeBuoy"], desc: "紧急求助指引", g: "cyan" },
          { name: "信息", lucide: ["Info"], desc: "权益须知说明", g: "blue" },
          { name: "警告", lucide: ["AlertTriangle"], desc: "侵权风险提醒", g: "amber" },
          { name: "禁止", lucide: ["Ban"], desc: "违法行为警示", g: "red" },
          { name: "认证", lucide: ["BadgeCheck"], desc: "维权成功认证", g: "green" },
          { name: "礼物", lucide: ["Gift"], desc: "调解和解赠礼", g: "pink" },
        ],
      },
    ],
  },
  {
    groupId: "space",
    groupName: "天文航天",
    groupEmoji: "🚀",
    themes: [
      {
        id: "spc-planet",
        name: "行星星系",
        englishName: "Planets & Galaxies",
        description: "太阳系与深空天体图标",
        icon: "Globe",
        prefix: "spla",
        icons: [
          { name: "地球", lucide: ["Globe"], desc: "蓝色家园星球", g: "blue" },
          { name: "地球仪", lucide: ["Globe2"], desc: "三维星球模型", g: "teal" },
          { name: "月亮", lucide: ["Moon"], desc: "夜空中卫星", g: "indigo" },
          { name: "星月", lucide: ["MoonStar"], desc: "星月交辉夜空", g: "purple" },
          { name: "太阳", lucide: ["Sun"], desc: "恒星能量核心", g: "amber" },
          { name: "星辰", lucide: ["Star"], desc: "遥远恒星光芒", g: "yellow" },
          { name: "轨道", lucide: ["Orbit"], desc: "行星运行轨迹", g: "purple" },
          { name: "原子", lucide: ["Atom"], desc: "宇宙微观结构", g: "cyan" },
          { name: "彗星", lucide: ["Sparkles"], desc: "划过天际彗星", g: "pink" },
          { name: "银河", lucide: ["Sparkles"], desc: "璀璨星河星系", g: "indigo" },
        ],
      },
      {
        id: "spc-craft",
        name: "航天器",
        englishName: "Spacecraft",
        description: "火箭飞船与空间站图标",
        icon: "Rocket",
        prefix: "scrf",
        icons: [
          { name: "火箭", lucide: ["Rocket"], desc: "运载火箭升空", g: "red" },
          { name: "卫星", lucide: ["Satellite"], desc: "轨道通信卫星", g: "blue" },
          { name: "空间站", lucide: ["Box"], desc: "近地轨道驻留", g: "slate" },
          { name: "探测器", lucide: ["Radar"], desc: "深空探测设备", g: "teal" },
          { name: "燃料罐", lucide: ["Cylinder"], desc: "推进剂储存", g: "orange" },
          { name: "芯片", lucide: ["Cpu"], desc: "航天电子核心", g: "purple" },
          { name: "天线", lucide: ["Radio"], desc: "地面信号接收", g: "green" },
          { name: "雷达", lucide: ["Radar"], desc: "远程目标追踪", g: "cyan" },
          { name: "电池", lucide: ["Battery"], desc: "舱内能源供应", g: "green" },
          { name: "太阳能板", lucide: ["Sun"], desc: "光伏发电系统", g: "amber" },
        ],
      },
      {
        id: "spc-observe",
        name: "天文观测",
        englishName: "Astronomy",
        description: "望远镜与天文台观测图标",
        icon: "Telescope",
        prefix: "sobs",
        icons: [
          { name: "望远镜", lucide: ["Telescope"], desc: "光学天文观测", g: "indigo" },
          { name: "双筒镜", lucide: ["Binoculars"], desc: "野外星空观测", g: "slate" },
          { name: "相机", lucide: ["Camera"], desc: "深空摄影记录", g: "slate" },
          { name: "显微镜", lucide: ["Microscope"], desc: "陨石样本分析", g: "purple" },
          { name: "指南针", lucide: ["Compass"], desc: "星图方位定位", g: "amber" },
          { name: "地图", lucide: ["Map"], desc: "星图坐标标注", g: "green" },
          { name: "笔记本", lucide: ["Notebook"], desc: "观测日志记录", g: "blue" },
          { name: "时钟", lucide: ["Clock"], desc: "观测时间窗口", g: "slate" },
          { name: "月亮相位", lucide: ["Moon"], desc: "月相变化周期", g: "indigo" },
          { name: "日出", lucide: ["Sunrise"], desc: "地平线曙光", g: "orange" },
        ],
      },
      {
        id: "spc-explore",
        name: "太空探索",
        englishName: "Space Exploration",
        description: "载人航天与行星探测图标",
        icon: "Rocket",
        prefix: "sexp",
        icons: [
          { name: "发射", lucide: ["Rocket"], desc: "点火升空瞬间", g: "red" },
          { name: "轨道运行", lucide: ["Orbit"], desc: "环绕地球飞行", g: "purple" },
          { name: "着陆", lucide: ["MapPin"], desc: "行星表面着陆", g: "green" },
          { name: "漫游车", lucide: ["Car"], desc: "外星地表探测", g: "slate" },
          { name: "样本", lucide: ["FlaskConical"], desc: "采集岩石样本", g: "cyan" },
          { name: "宇航员", lucide: ["User"], desc: "载人航天任务", g: "blue" },
          { name: "团队", lucide: ["Users"], desc: "航天任务编队", g: "teal" },
          { name: "目标", lucide: ["Target"], desc: "探测任务目标", g: "red" },
          { name: "旗帜", lucide: ["Flag"], desc: "登陆点标记", g: "red" },
          { name: "奖杯", lucide: ["Trophy"], desc: "探索成就荣誉", g: "amber" },
        ],
      },
      {
        id: "spc-satellite",
        name: "卫星导航",
        englishName: "Satellite Navigation",
        description: "GPS导航与遥感通信图标",
        icon: "Satellite",
        prefix: "ssat",
        icons: [
          { name: "导航卫星", lucide: ["Satellite"], desc: "全球定位系统", g: "blue" },
          { name: "GPS定位", lucide: ["Navigation"], desc: "实时坐标导航", g: "green" },
          { name: "地图定位", lucide: ["MapPinned"], desc: "精准地点标记", g: "red" },
          { name: "路线", lucide: ["Route"], desc: "最优路径规划", g: "teal" },
          { name: "信号", lucide: ["Wifi"], desc: "卫星信号强度", g: "blue" },
          { name: "云端", lucide: ["Cloud"], desc: "遥感数据上云", g: "cyan" },
          { name: "下载", lucide: ["CloudDownload"], desc: "地图数据更新", g: "blue" },
          { name: "上传", lucide: ["CloudUpload"], desc: "遥测数据回传", g: "indigo" },
          { name: "雷达扫描", lucide: ["Radar"], desc: "地表遥感扫描", g: "teal" },
          { name: "链接", lucide: ["Link"], desc: "天地链路通信", g: "slate" },
        ],
      },
    ],
  },
];

const SUB_THEME_EMOJI = {
  animals: ["🐱", "🌲", "🐟", "🦅", "🐛"],
  architecture: ["🏛️", "🔨", "🛋️", "🗺️", "🔌"],
  fashion: ["👔", "💎", "💄", "👟", "📸"],
  farm: ["🌽", "🌸", "🚜", "🥚", "🏞️"],
  law: ["📜", "🏛️", "⚖️", "🗳️", "🤝"],
  space: ["🪐", "🚀", "🔭", "🌌", "📡"],
};

const missingIcons = [];
const themes = [];
const themeGroups = [];
const themeEmoji = {};

for (const group of SPEC) {
  const themeIds = [];
  for (let ti = 0; ti < group.themes.length; ti++) {
    const t = group.themes[ti];
    themeIds.push(t.id);
    themeEmoji[t.id] = SUB_THEME_EMOJI[group.groupId]?.[ti] ?? group.groupEmoji;
    const icons = t.icons.map((ic, i) => {
      const lucideName = pickIcon(ic.lucide);
      if (!lucide[ic.lucide[0]]) missingIcons.push(`${t.id}:${ic.name}:${ic.lucide[0]}`);
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
  themeGroups.push({
    id: group.groupId,
    name: group.groupName,
    emoji: group.groupEmoji,
    themeIds,
  });
}

if (missingIcons.length) {
  console.warn("Icons not found (fallback used):", missingIcons.slice(0, 20));
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

const file = `/** 拓展主题：6 大类 × 5 子分类 × 10 图标 */
export const expandedThemesData = [
${themes.map(serializeTheme).join(",\n")},
];

export const expandedThemeGroups = ${JSON.stringify(themeGroups, null, 2)};

export const expandedThemeEmoji: Record<string, string> = ${JSON.stringify(themeEmoji, null, 2)};
`;

writeFileSync(outPath, file, "utf8");
console.log(`Generated ${themes.length} themes, ${themes.length * 10} icons -> ${outPath}`);
