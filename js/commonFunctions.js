formatNum = function(num) {
  str = num.toString();
  if(str.indexOf('.') != -1) {
    if(str[str.indexOf('.') + 1] === '0' && str[str.indexOf('.') + 2] === '0')
      return num.toFixed(0);
    else
      return num.toFixed(2);
  }
  else
    return num;
};