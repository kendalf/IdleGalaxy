var Structure = function(owned, priceExp, rsrcReq, id, description, storage) {

  this.owned = owned;
  this.priceExp = priceExp;
  this.rsrcReq = rsrcReq;
  this.id = id;
  this.description = description || "";
  this.storage = storage || 0;

  this.displayRsrcTooltip = function(rsrcObj) {
    return rsrcObj.calcTimeToAmt(this.rsrcReq[rsrcObj.name].amt) + " Sec";
  };

  this.displayInfo = function(item, amt) {
    if(amt >= this.rsrcReq[item].amt)
      return this.rsrcReq[item].amt + " / " + this.rsrcReq[item].amt;
    return amt.toFixed(0) + " / " + this.rsrcReq[item].amt;
  };

  this.getPercent = function(itemKey, playerResourceAmt) {
    if(playerResourceAmt >= this.rsrcReq[itemKey].amt)
      return 100;
    return (playerResourceAmt / this.rsrcReq[itemKey].amt) * 100;
  };

  this.barColor = function(itemKey, playerResourceObj) {
    per = this.getPercent(itemKey, playerResourceObj.amt);
    if(this.rsrcReq[itemKey].amt > playerResourceObj.max)
      return "red";
    if(per === 100)
      return "green";
    else
      return "#05A";//blue
  };

  this.canNotBuy = function(resources) {
    var cant = 0;
    for (item in this.rsrcReq) {
      cant += resources[item].max < this.rsrcReq[item].amt;
    }
    return cant > 0;
  };


  this.canBuy = function(resources) {
    if(!this.additionalBuyConditions())
      return false;
    var cant = 0;
    for (item in this.rsrcReq) {
      cant += resources[item].amt < this.rsrcReq[item].amt;
    }
    return cant === 0;
  };

  this.buy = function(resources) {
    if(this.canBuy(resources)) {
      for (item in this.rsrcReq) {
        if(item != "Knowledge")
          resources[item].amt -= this.rsrcReq[item].amt;
        this.rsrcReq[item].amt = Math.round(Math.pow(this.rsrcReq[item].amt, this.priceExp));
      }
      this.owned++;
      this.additionalBuyEvents(1);
    }
  };

  this.destroy = function(resources) {
    if (this.owned > 0) {
      for (item in this.rsrcReq) {
        if(item != "Knowledge") {
          if(item != "Buildable Land")
            resources[item].amt += this.rsrcReq[item].amt * 0.5;
          else
            resources[item].amt += this.rsrcReq[item].amt;
        }
      }
      this.owned--;
      this.additionalBuyEvents(-1);
    }
  };

  this.additionalBuyConditions = function() { return true;};
  this.additionalBuyEvents = function(multi) {};

  this.toggleInfo = function() {
    $('#' + this.id).toggle('fast', function() {
      $('#' + this.id).toggleClass('hide');
      $('#' + this.id + "-container").toggleClass('structInfoExpand');
    });
  };

};
