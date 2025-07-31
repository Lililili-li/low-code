var twoSum = function (numbers, target) {
  const n = numbers.length
  let left = 0
  let right = left + 1
  while (left < n) {
    if (numbers[left] + numbers[right] === target) {
      return [left + 1, right + 1]
    }
    if (right > n) {
      left++
      right = left + 1
    } else {
      right++
    }
  }
  return []
};
console.log(twoSum([-1,0], -1));


