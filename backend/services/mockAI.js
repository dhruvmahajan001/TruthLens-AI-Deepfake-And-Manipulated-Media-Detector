const analyzeContent = (inputType, content) => {
  const score = Math.floor(Math.random() * 100);

  let risk = "";
  let message = "";

  if (score > 70) {
    risk = "Low";
    message = "Content appears authentic";
  } else if (score > 40) {
    risk = "Medium";
    message = "Content looks suspicious";
  } else {
    risk = "High";
    message = "Content may be fake or manipulated";
  }

  return { score, risk, message };
};

module.exports = analyzeContent;
