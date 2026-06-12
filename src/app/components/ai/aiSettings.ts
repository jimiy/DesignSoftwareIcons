export type AiProvider = "openai" | "deepseek" | "anthropic" | "custom";
export type AiGenerationMode = "smart" | "svg" | "image" | "auto";

export interface AiSettings {
  enabled: boolean;
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
  chatModel: string;
  imageModel: string;
  generationMode: AiGenerationMode;
  /** 额外风格描述，会附加到每次生成提示词 */
  styleHint: string;
}

export interface AiProviderPreset {
  label: string;
  baseUrl: string;
  chatModel: string;
  imageModel: string;
}

export const AI_SETTINGS_STORAGE_KEY = "icon-generator-ai-settings-v1";

export const PROVIDER_PRESETS: Record<AiProvider, AiProviderPreset> = {
  openai: {
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    chatModel: "gpt-4o-mini",
    imageModel: "dall-e-3",
  },
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    chatModel: "deepseek-chat",
    imageModel: "",
  },
  anthropic: {
    label: "Anthropic (兼容网关)",
    baseUrl: "https://api.anthropic.com/v1",
    chatModel: "claude-3-5-sonnet-20241022",
    imageModel: "",
  },
  custom: {
    label: "自定义",
    baseUrl: "",
    chatModel: "",
    imageModel: "",
  },
};

export const DEFAULT_AI_SETTINGS: AiSettings = {
  enabled: false,
  provider: "openai",
  apiKey: "",
  baseUrl: PROVIDER_PRESETS.openai.baseUrl,
  chatModel: PROVIDER_PRESETS.openai.chatModel,
  imageModel: PROVIDER_PRESETS.openai.imageModel,
  generationMode: "auto",
  styleHint: "现代扁平化应用图标，圆角矩形背景，居中白色线条图标",
};

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_AI_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    return { ...DEFAULT_AI_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_AI_SETTINGS };
  }
}

export function saveAiSettings(settings: AiSettings): void {
  localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function applyProviderPreset(
  settings: AiSettings,
  provider: AiProvider
): AiSettings {
  const preset = PROVIDER_PRESETS[provider];
  return {
    ...settings,
    provider,
    baseUrl: preset.baseUrl || settings.baseUrl,
    chatModel: preset.chatModel || settings.chatModel,
    imageModel: preset.imageModel || settings.imageModel,
  };
}

export function isAiConfigured(settings: AiSettings): boolean {
  return settings.enabled && settings.apiKey.trim() && settings.baseUrl.trim();
}
