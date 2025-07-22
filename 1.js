
var convert = function (s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;

  let result = '';
  const cycleLen = 2 * numRows - 2; // 一个完整周期的长度

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j + i < s.length; j += cycleLen) {
      // 添加垂直列上的字符
      result += s[j + i];

      // 添加斜线上的字符（如果存在）
      if (i !== 0 && i !== numRows - 1 && j + cycleLen - i < s.length) {
        result += s[j + cycleLen - i];
      }
    }
    console.log(result);
  }

  return result;
};
convert("PAYPALISHIRING", 3)
