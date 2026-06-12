import { useState } from "react";
import {
  AiGenerationMode,
  AiProvider,
  AiSettings,
  applyProviderPreset,
  isAiConfigured,
  PROVIDER_PRESETS,
  saveAiSettings,
} from "./aiSettings";
import { AiServiceError, testAiConnection } from "./aiIconService";

interface AiSettingsPanelProps {
  settings: AiSettings;
  onChange: (settings: AiSettings) => void;
}

const MODE_OPTIONS: { value: AiGenerationMode; label: string; desc: string }[] = [
  { value: "auto", label: "智能自动", desc: "根据描述自动选择最佳方式" },
  { value: "smart", label: "图标匹配", desc: "AI 挑选 Lucide 图标 + 配色" },
  { value: "svg", label: "原创 SVG", desc: "AI 绘制独特矢量图形" },
  { value: "image", label: "AI 绘图", desc: "调用图像模型生成位图" },
];

export function AiSettingsPanel({ settings, onChange }: AiSettingsPanelProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const update = (patch: Partial<AiSettings>) => {
    const next = { ...settings, ...patch };
    onChange(next);
    saveAiSettings(next);
  };

  const handleProviderChange = (provider: AiProvider) => {
    const next = applyProviderPreset(settings, provider);
    onChange(next);
    saveAiSettings(next);
    setTestResult(null);
    setTestError(null);
  };

  const handleTest = async () => {
    if (!settings.apiKey.trim() || !settings.baseUrl.trim()) {
      setTestError("请先填写 API Key 和接口地址");
      return;
    }
    setTesting(true);
    setTestResult(null);
    setTestError(null);
    try {
      const result = await testAiConnection(settings);
      setTestResult(`连接成功：${result}`);
    } catch (e) {
      const msg =
        e instanceof AiServiceError
          ? e.message
          : e instanceof Error
          ? e.message
          : "连接失败";
      setTestError(msg);
    } finally {
      setTesting(false);
    }
  };

  const configured = isAiConfigured(settings);

  return (
    <section className="p-5 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-md">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700/50 pb-2.5">
        <h3 className="text-xs font-bold text-gray-200 flex items-center">
          <span className="mr-2 text-sm">🤖</span>AI 生成配置
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] text-gray-400">启用</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.enabled}
            className={`w-9 h-5 rounded-full transition relative ${
              settings.enabled ? "bg-indigo-600" : "bg-gray-600"
            }`}
            onClick={() => update({ enabled: !settings.enabled })}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${
                settings.enabled ? "left-4" : "left-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
              服务商
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              value={settings.provider}
              onChange={(e) => handleProviderChange(e.target.value as AiProvider)}
            >
              {(Object.keys(PROVIDER_PRESETS) as AiProvider[]).map((p) => (
                <option key={p} value={p}>{PROVIDER_PRESETS[p].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
              API 地址 (Base URL)
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="https://api.openai.com/v1"
              value={settings.baseUrl}
              onChange={(e) => update({ baseUrl: e.target.value })}
            />
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              OpenAI 兼容接口，支持 OpenAI / DeepSeek / 各类中转网关
            </p>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="sk-..."
                value={settings.apiKey}
                onChange={(e) => update({ apiKey: e.target.value })}
              />
              <button
                type="button"
                className="px-2.5 py-2 bg-gray-700 rounded-lg text-[10px] text-gray-300 hover:bg-gray-650 cursor-pointer shrink-0"
                onClick={() => setShowKey((s) => !s)}
              >
                {showKey ? "隐藏" : "显示"}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              密钥仅保存在本地浏览器，不会上传至本项目服务器
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
                对话模型
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="gpt-4o-mini"
                value={settings.chatModel}
                onChange={(e) => update({ chatModel: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
                图像模型
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="dall-e-3（可选）"
                value={settings.imageModel}
                onChange={(e) => update({ imageModel: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
              生成模式
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MODE_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`px-2 py-2 rounded-lg text-left border transition cursor-pointer ${
                    settings.generationMode === m.value
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                      : "bg-gray-950 border-gray-700/40 text-gray-400 hover:border-gray-600"
                  }`}
                  onClick={() => update({ generationMode: m.value })}
                >
                  <span className="text-[10px] font-bold block">{m.label}</span>
                  <span className="text-[9px] opacity-70 leading-tight">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">
              风格提示（可选）
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700/50 rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="例如：渐变背景、极简线条、游戏风格..."
              value={settings.styleHint}
              onChange={(e) => update({ styleHint: e.target.value })}
            />
          </div>

          <button
            type="button"
            disabled={testing}
            className="w-full py-2 bg-gray-700 rounded-lg text-[10px] font-bold text-gray-200 hover:bg-gray-650 transition cursor-pointer disabled:opacity-50"
            onClick={handleTest}
          >
            {testing ? "测试中..." : "测试 API 连接"}
          </button>

          {testResult && (
            <p className="text-[10px] text-emerald-400 leading-relaxed">{testResult}</p>
          )}
          {testError && (
            <p className="text-[10px] text-red-400 leading-relaxed">{testError}</p>
          )}

          {!configured && (
            <p className="text-[10px] text-amber-400/90 leading-relaxed">
              填写 API Key 与地址后，顶部「AI 生成」将调用大模型能力
            </p>
          )}
        </div>
      )}
    </section>
  );
}
