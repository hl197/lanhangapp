// 航空主题配色 — 蓝航蓝图
export const COLORS = {
  primary: "#1E3A5F",
  primaryLight: "#3D7AB5",
  primaryBg: "#E8F0F8",
  background: "#F0F4F8",
  surface: "#FFFFFF",
  text: "#1A2A3A",
  textSecondary: "#6B7B8D",
  textHint: "#9CAAB8",
  error: "#DC2626",
  success: "#059669",
  warning: "#D97706",
  border: "#E5E7EB",
  cardShadow: "rgba(26, 51, 80, 0.06)",
};

export const CATEGORY_STYLES: Record<
  string,
  { primary: string; bg: string; light: string }
> = {
  计算机科学: { primary: "#1E3A5F", bg: "#E8F0F8", light: "#3D7AB5" },
  文学: { primary: "#6B2D3B", bg: "#FDF8F5", light: "#A05060" },
  历史: { primary: "#5C3D2E", bg: "#FAF7F0", light: "#8B6B55" },
  经济管理: { primary: "#2C5F7C", bg: "#F0F6FA", light: "#4A8BA8" },
  自然科学: { primary: "#2C5F7C", bg: "#F0F6FA", light: "#4A8BA8" },
  哲学: { primary: "#5C3D2E", bg: "#FAF7F0", light: "#8B6B55" },
  艺术: { primary: "#6B2D3B", bg: "#FDF8F5", light: "#A05060" },
  教育: { primary: "#1E3A5F", bg: "#E8F0F8", light: "#3D7AB5" },
  语言: { primary: "#2C5F7C", bg: "#F0F6FA", light: "#4A8BA8" },
  医学: { primary: "#2C5F7C", bg: "#F0F6FA", light: "#4A8BA8" },
  工程技术: { primary: "#1E3A5F", bg: "#E8F0F8", light: "#3D7AB5" },
  其他: { primary: "#6B7B8D", bg: "#F0F4F8", light: "#9CAAB8" },
};

export const BOOK_CATEGORIES = [
  "计算机科学",
  "文学",
  "历史",
  "经济管理",
  "自然科学",
  "哲学",
  "艺术",
  "教育",
  "语言",
  "医学",
  "工程技术",
  "其他",
] as const;
