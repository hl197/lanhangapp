export const BASE_THEME = {
  primary: "#1E3A5F",
  primaryLight: "#3D7AB5",
  primaryBg: "#E8F0F8",
  bg: "#F0F4F8",
  card: "#FFFFFF",
  text: "#1A2A3A",
  textSecondary: "#6B7B8D",
  textHint: "#9CAAB8",
  navBg: "#1A3350",
  availableBg: "#E8F0F8",
  availableText: "#2D5A87",
  borrowedBg: "#FEF3E4",
  borrowedText: "#B8780A",
};

export const CATEGORY_THEMES = {
  航空宇航: {
    primary: "#1E3A5F",
    light: "#3D7AB5",
    bg: "#F0F4F8",
    cardGradient: "linear-gradient(150deg, #E8F0F8, #DCE8F4)",
    decoration: "aviation",
  },
  人文历史: {
    primary: "#5C3D2E",
    light: "#C9A96E",
    bg: "#FAF7F0",
    cardGradient: "linear-gradient(150deg, #FAF7F0, #F5EDD8)",
    decoration: "history",
  },
  自然科学: {
    primary: "#2C5F7C",
    light: "#5AA3BF",
    bg: "#FAFBFC",
    cardGradient: "linear-gradient(150deg, #FFFFFF, #F4F8FA)",
    decoration: "science",
  },
  文学艺术: {
    primary: "#6B2D3B",
    light: "#C06070",
    bg: "#FDF8F5",
    cardGradient: "linear-gradient(150deg, #FDF5F6, #FAE8EC)",
    decoration: "literature",
  },
};

export function getCategoryTheme(categoryName) {
  return CATEGORY_THEMES[categoryName] || CATEGORY_THEMES["航空宇航"];
}
