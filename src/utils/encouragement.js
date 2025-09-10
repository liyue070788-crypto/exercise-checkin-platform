const encouragementMessages = [
  "太棒了！坚持就是胜利！💪",
  "每一次打卡都是对自己的承诺！🌟",
  "运动让生活更美好，继续加油！🏃‍♂️",
  "你的坚持令人敬佩！✨",
  "健康的身体是最好的财富！💎",
  "今天的你比昨天更强大！🚀",
  "运动是最好的投资！📈",
  "每一滴汗水都值得骄傲！💧",
  "坚持运动，遇见更好的自己！🌈",
  "你的努力终将闪闪发光！⭐",
  "运动不仅强身，更能强心！❤️",
  "每天进步一点点，就是成功！📊",
  "运动让你充满活力！⚡",
  "坚持的路上，你从不孤单！🤝",
  "健康生活从运动开始！🌱",
  "你的毅力是最美的风景！🏔️",
  "运动是生活的调味剂！🎨",
  "每次运动都是对未来的投资！💰",
  "汗水是努力最好的证明！🏆",
  "运动让你更自信！😊"
];

export const getRandomEncouragement = () => {
  const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
  return encouragementMessages[randomIndex];
};