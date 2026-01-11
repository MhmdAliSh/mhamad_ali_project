function generateOrderCode() {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

module.exports = { generateOrderCode };
