import type { Theme, ThemeIcon } from "./iconData";
import { THEME_EMOJI } from "./iconData";

export interface IconSearchResult {
  themeId: string;
  themeName: string;
  themeEmoji: string;
  icon: ThemeIcon;
  score: number;
}

function matchScore(text: string, query: string): number {
  const lower = text.toLowerCase();
  if (lower === query) return 100;
  if (lower.startsWith(query)) return 80;
  if (lower.includes(query)) return 50;
  return 0;
}

/** 在全库主题中搜索图标（名称、描述、Lucide 名、分类名） */
export function searchIcons(query: string, themes: Theme[]): IconSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: IconSearchResult[] = [];

  for (const theme of themes) {
    const emoji = THEME_EMOJI[theme.id] ?? "📌";
    const themeTexts = [theme.name, theme.englishName, theme.description];

    for (const icon of theme.icons) {
      const fields = [
        { text: icon.name, weight: 3 },
        { text: icon.desc, weight: 2 },
        { text: icon.lucideName, weight: 2 },
        ...themeTexts.map((t) => ({ text: t, weight: 1 })),
      ];

      let score = 0;
      for (const { text, weight } of fields) {
        score = Math.max(score, matchScore(text, q) * weight);
      }

      // 多关键字：空格分隔，每个词都需命中至少一个字段
      const tokens = q.split(/\s+/).filter(Boolean);
      if (tokens.length > 1) {
        const allMatch = tokens.every((token) =>
          fields.some(({ text }) => text.toLowerCase().includes(token))
        );
        if (!allMatch) score = 0;
        else if (score === 0) score = 30;
      }

      if (score > 0) {
        results.push({
          themeId: theme.id,
          themeName: theme.name,
          themeEmoji: emoji,
          icon,
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/** 搜索匹配的主题 id 集合，用于侧栏高亮 */
export function searchMatchingThemeIds(query: string, themes: Theme[]): Set<string> {
  return new Set(searchIcons(query, themes).map((r) => r.themeId));
}
