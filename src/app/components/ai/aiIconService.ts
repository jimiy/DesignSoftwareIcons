import * as LucideIcons from "lucide-react";
import type { AiGenerationMode, AiSettings } from "./aiSettings";

export interface AiGeneratedIcon {
  name: string;
  desc: string;
  lucideName?: string;
  svgContent?: string;
  imageUrl?: string;
  gradient?: [string, string];
  defaultGradient?: [string, string];
  defaultBadge?: string;
  source: "ai-smart" | "ai-svg" | "ai-image";
  aiPrompt?: string;
}

export class AiServiceError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "AiServiceError";
    this.status = status;
  }
}

/** 规范化 OpenAI 兼容 Base URL */
export function normalizeBaseUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, "");
  if (/\/chat\/completions$/i.test(u)) {
    u = u.replace(/\/chat\/completions$/i, "");
  }
  if (/\/images\/generations$/i.test(u)) {
    u = u.replace(/\/images\/generations$/i, "");
  }
  if (!/\/v\d+$/i.test(u) && !u.endsWith("/v1")) {
    u = `${u}/v1`;
  }
  return u.replace(/\/+$/, "");
}

function isValidLucide(name: string): boolean {
  return Boolean((LucideIcons as Record<string, unknown>)[name]);
}

function parseJsonFromContent(content: string): Record<string, unknown> {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new AiServiceError("AI 返回内容无法解析为 JSON");
  }
}

function normalizeGradient(value: unknown): [string, string] | undefined {
  if (!Array.isArray(value) || value.length < 2) return undefined;
  const c1 = String(value[0]);
  const c2 = String(value[1]);
  if (!/^#[0-9a-fA-F]{3,8}$/.test(c1) || !/^#[0-9a-fA-F]{3,8}$/.test(c2)) return undefined;
  return [c1, c2];
}

async function chatCompletion(
  settings: AiSettings,
  messages: { role: string; content: string }[],
  jsonMode = false
): Promise<string> {
  const base = normalizeBaseUrl(settings.baseUrl);
  const body: Record<string, unknown> = {
    model: settings.chatModel,
    messages,
    temperature: 0.65,
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      `请求失败 (${res.status})`;
    throw new AiServiceError(msg, res.status);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new AiServiceError("AI 未返回有效内容");
  }
  return content;
}

const SMART_SYSTEM = `你是专业应用图标设计助手。根据用户描述，返回 JSON（不要 markdown）：
{
  "name": "中文图标名（2-8字）",
  "desc": "中文功能描述（15-40字）",
  "lucideName": "Lucide 图标 PascalCase 名称，如 Heart、Camera、Settings",
  "gradient": ["#起始色", "#结束色"],
  "badge": "可选徽标如 Pro、新、VIP，无则空字符串"
}
规则：lucideName 必须是 lucide-react 库中真实存在的图标名；gradient 使用协调的十六进制色；风格现代扁平。`;

const SVG_SYSTEM = `你是 SVG 图标设计师。根据描述生成应用图标内层 SVG 元素（不要外层 <svg> 标签）。
返回 JSON：
{
  "name": "中文图标名",
  "desc": "中文描述",
  "gradient": ["#色1", "#色2"],
  "svgContent": "仅内层元素，viewBox 0-52，使用白色描边 stroke='white' fill 适当，线条圆润",
  "badge": "可选"
}
svgContent 只包含 path/circle/rect/line 等，适合 52x52 圆角应用图标。`;

async function generateSmartIcon(
  prompt: string,
  settings: AiSettings
): Promise<AiGeneratedIcon> {
  const style = settings.styleHint.trim();
  const userContent = style
    ? `用户需求：${prompt}\n风格要求：${style}`
    : `用户需求：${prompt}`;

  const content = await chatCompletion(
    settings,
    [
      { role: "system", content: SMART_SYSTEM },
      { role: "user", content: userContent },
    ],
    true
  );

  const parsed = parseJsonFromContent(content);
  let lucideName = String(parsed.lucideName || "").trim();
  if (!isValidLucide(lucideName)) {
    lucideName = "";
  }

  const gradient = normalizeGradient(parsed.gradient);
  const badge = String(parsed.badge || "").trim();

  return {
    name: String(parsed.name || prompt).slice(0, 32),
    desc: String(parsed.desc || `AI 智能匹配：${prompt}`),
    lucideName: lucideName || undefined,
    gradient,
    defaultGradient: gradient,
    defaultBadge: badge || undefined,
    source: "ai-smart",
    aiPrompt: prompt,
  };
}

async function generateSvgIcon(
  prompt: string,
  settings: AiSettings
): Promise<AiGeneratedIcon> {
  const style = settings.styleHint.trim();
  const userContent = style
    ? `图标主题：${prompt}\n风格：${style}`
    : `图标主题：${prompt}`;

  const content = await chatCompletion(
    settings,
    [
      { role: "system", content: SVG_SYSTEM },
      { role: "user", content: userContent },
    ],
    true
  );

  const parsed = parseJsonFromContent(content);
  let svgContent = String(parsed.svgContent || "").trim();
  svgContent = svgContent
    .replace(/^<svg[^>]*>/i, "")
    .replace(/<\/svg>$/i, "")
    .trim();

  if (!svgContent) {
    throw new AiServiceError("AI 未生成有效 SVG 内容");
  }

  const gradient = normalizeGradient(parsed.gradient);

  return {
    name: String(parsed.name || prompt).slice(0, 32),
    desc: String(parsed.desc || `AI 原创 SVG：${prompt}`),
    svgContent,
    gradient,
    defaultGradient: gradient,
    defaultBadge: String(parsed.badge || "").trim() || undefined,
    source: "ai-svg",
    aiPrompt: prompt,
  };
}

async function generateImageIcon(
  prompt: string,
  settings: AiSettings
): Promise<AiGeneratedIcon> {
  if (!settings.imageModel.trim()) {
    throw new AiServiceError("请配置图像生成模型（如 dall-e-3）");
  }

  const base = normalizeBaseUrl(settings.baseUrl);
  const style = settings.styleHint.trim();
  const fullPrompt = style
    ? `App icon, square with rounded corners: ${prompt}. Style: ${style}. No text, centered symbol, high quality.`
    : `App icon, square with rounded corners: ${prompt}. Flat modern design, no text, centered symbol.`;

  const res = await fetch(`${base}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: settings.imageModel,
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      `图像生成失败 (${res.status})`;
    throw new AiServiceError(msg, res.status);
  }

  const b64 = data?.data?.[0]?.b64_json;
  const url = data?.data?.[0]?.url;
  const imageUrl = b64
    ? `data:image/png;base64,${b64}`
    : url;

  if (!imageUrl) {
    throw new AiServiceError("图像 API 未返回图片数据");
  }

  return {
    name: prompt.slice(0, 32),
    desc: `AI 图像生成：${prompt}`,
    imageUrl,
    source: "ai-image",
    aiPrompt: prompt,
  };
}

function pickMode(settings: AiSettings, prompt: string): AiGenerationMode {
  if (settings.generationMode !== "auto") return settings.generationMode;
  if (settings.imageModel.trim() && prompt.length > 24) {
    return "image";
  }
  if (prompt.length > 10) {
    return "svg";
  }
  return "smart";
}

export async function testAiConnection(settings: AiSettings): Promise<string> {
  const content = await chatCompletion(
    settings,
    [
      { role: "user", content: "回复 OK 两个字母，不要其他内容" },
    ],
    false
  );
  return content.trim().slice(0, 80);
}

export async function generateIconWithAi(
  prompt: string,
  settings: AiSettings
): Promise<AiGeneratedIcon> {
  const key = prompt.trim();
  if (!key) throw new AiServiceError("请输入生成描述");

  const mode = pickMode(settings, key);

  if (mode === "image") {
    return generateImageIcon(key, settings);
  }
  if (mode === "svg") {
    return generateSvgIcon(key, settings);
  }
  return generateSmartIcon(key, settings);
}
