var Resource = function(amt, max, name) {

  this.amt = amt;
  this.max = max;
  this.name = name;
  this.perTick = 0;

  this.displayPerSec = function(fps) {
    return (this.perTick*fps).toFixed(3) + " Per/Sec";
  };

  this.calcTimeToAmt = function(amt, fps) {
    fps = fps || 24;
    if(this.perTick > 0)
      return amt / (this.perTick*fps);
    else
      return 0;
  };

  this.getPercent = function(precision) {
    precision = precision || 0;
    return ((this.amt / this.max) * 100).toFixed(precision);
  };

  this.display = function(precision) {
    precision = precision || 0;
    return this.name + ": " + this.truncate(this.amt, precision) + " / " + Math.floor(this.max);
  };

  this.truncate = function(num, precision) {
    num = num.toString();
    if(num.indexOf(".") < 1)
      return Number(num);
    if(precision == 0)
      num = num.slice(0, (num.indexOf("."))+1);
    return Number(num).toFixed(precision);
  };

  this.barColor = function() {
    if(this.name == "Knowledge")
      return "#05A";//blue
    per = this.getPercent();
    if(per <= 15)
      return "red";
    if(per >= 99)
      return "#05A";
    if(per >= 90)
      return "#DD8347"; //orange
    if(per >= 80)
      return "#ACAC19"; //yellow
    else
      return "green";
  };

};
