var ig = angular.module("IdleGalaxy", ["initValues"]);
ig.controller("GameController", ['$scope', '$interval', 'gameData', function($scope, $interval, gameData) {

  $scope.fps = 24;
  $scope.clickAmt = 1;
  $scope.msgLog = [];
  $scope.huntTimer = {mili: 60000, current: 60000, started:false};
  $scope.killTimer = {mili: 5000, current: 5000, started:false};
  $scope.seasonTimer = {mili: 300000, current: 300000, started: true, year: 1, season: 0};
  $scope.year = 1;
  $scope.seasons = ['Spring', 'Summer', 'Autum', 'Winter'];
  $scope.season = 0;
  $scope.muteState = "Mute";
  $scope.resources = {};
  $scope.structures = {};
  $scope.upgrades = {};
  $scope.occupations = {};
  var globalProductionMultiplyer = 1;

  /************
  * New Message
  ************/
  $scope.newMsg = function(msg, sound, type) {
    type = type || "story";
    sound = sound || ding;
    if(sound != 'none')
      sound.play();
    $scope.msgLog.unshift(new Message(msg, type, whatTime()));
  };

  /************
  * Initialization
  ************/
  var init = function () {
    //if local data is present
    if(localStorage.getItem('version') == 1) {
      var temp = {};

      $scope.seasonTimer = localStorage.getObject('seasonTimer') || $scope.seasonTimer;

      $scope.muteState = localStorage.getObject('mute') || 'Mute';
      console.log($scope.muteState);
      if($scope.muteState == 'Unmute')
          Howler.mute();

      temp = localStorage.getObject('resources');
      for(item in temp)
        $scope.resources[item] = new Resource(temp[item].amt, temp[item].max, temp[item].name);

      temp = localStorage.getObject('structures');
      for(item in temp)
        $scope.structures[item] = new Structure(temp[item].owned, temp[item].priceExp, temp[item].rsrcReq, temp[item].id, temp[item].description);

      temp = localStorage.getObject('upgrades');
      for(item in temp)
        $scope.upgrades[item] = new Structure(temp[item].owned, temp[item].priceExp, temp[item].rsrcReq, temp[item].id, temp[item].description);

      $scope.occupations = localStorage.getObject('occupations');

      $scope.msgLog = localStorage.getObject('msgLog');
    }
    else { //no local data found
      $scope.msgLog = [];
      $scope.newMsg(msgs.gameStart.msg, 'none');

      $scope.resources = gameData.resources;/*{
        "Food" : new Resource(20, 300, "Food"),
        "Wood" : new Resource(200, 800, "Wood"),
        "Minerals" : new Resource(0, 700, "Minerals"),
        "Iron" : new Resource(0, 0, "Iron"),
        "Coal" : new Resource(0, 0, "Coal"),
        "Steel" : new Resource(0, 0, "Steel"),
        "Furs" : new Resource(0, 0, "Furs"),
        "Buildable Land" : new Resource(60, 60, "Buildable Land"),
        "Knowledge" : new Resource(0, 1000, "Knowledge")
      };*/

      $scope.structures = {
        "Mine" : new Structure(-1, 1.03, {
          "Wood" : {amt: 200},
          "Minerals" : {amt: 300},
          "Buildable Land" : {amt: 5},
          "Knowledge" : {amt: 200}}, "Mine", "Enables mining job"),
        "Small Farm" : new Structure(-1, 1.03, {
          "Wood" : {amt: 200},
          "Buildable Land" : {amt: 10},
          "Knowledge" : {amt: 30}}, "Small-Farm", "Enables farming job"),
        "Lumberyard" : new Structure(-1, 1.03, {
          "Wood" : {amt: 200},
          "Minerals" : {amt: 150},
          "Buildable Land" : {amt: 5},
          "Knowledge" : {amt: 200}}, "Lumberyard", "Enables Lumberjack job"),
        "Smeltry" : new Structure(-1, 1.031, {
          "Wood" : {amt: 500},
          "Minerals" : {amt: 800},
          "Buildable Land" : {amt: 5},
          "Knowledge" : {amt: 500}}, "Smeltry", "Enables blacksmith job"),
        "Hut" : new Structure(-1, 1, {
          "Wood" : {amt: 200},
          "Buildable Land" : {amt: 2},
          "Knowledge" : {amt: 50}}, "Hut", "Allows population growth"),
        "House" : new Structure(-1, 1, {
          "Wood" : {amt: 1000},
          "Minerals" : {amt: 600},
          "Iron" : {amt: 200},
          "Buildable Land" : {amt: 3},
          "Knowledge" : {amt: 1500}}, "House", "Can hold 4 people"),
        "Library" : new Structure(-1, 1.031, {
          "Wood" : {amt: 600},
          "Minerals" : {amt: 600},
          "Buildable Land" : {amt: 5},
          "Knowledge" : {amt: 600}}, "Library", "Enables Scholar job"),
        "School" : new Structure(-1, 1.031, {
          "Wood" : {amt: 1000},
          "Minerals" : {amt: 800},
          "Iron" : {amt: 200},
          "Buildable Land" : {amt: 5},
          "Knowledge" : {amt: 2000}}, "School", "Improves learning 25%"),
        "Warehouse" : new Structure(-1, 1, {
          "Wood" : {amt: 1200},
          "Minerals" : {amt: 1000},
          "Iron" : {amt: 200},
          "Buildable Land" : {amt: 8},
          "Knowledge" : {amt: 2000}}, "Warehouse", "Store more resources"),
        "Workshop" : new Structure(-1, 1.031, {
          "Wood" : {amt: 200},
          "Buildable Land" : {amt: 2},
          "Knowledge" : {amt: 500}}, "Workshop", "Enables Carpenter job")
      };

      $scope.upgrades = {
        "Agriculture" : new Structure(0, -1, {
          "Knowledge" : {amt: 10}}, "Agriculture", "Unlocks farming"),
        "Wood Tools" : new Structure(-1, -1, {
          "Knowledge" : {amt: 30}}, "Wood-Tools", "Unlocks farming"),
        "Wood Spear" : new Structure(-1, -1, {
          "Wood" : {amt: 50},
          "Knowledge" : {amt: 100}}, "Wood-Spear", "Unlocks Hunting"),
        "Wood Hoe" : new Structure(-1, -1, {
          "Wood" : {amt: 50},
          "Knowledge" : {amt: 100}}, "Wood-Hoe", "Improves farming by 10%"),
        "Stone Tools" : new Structure(-1, -1, {
          "Knowledge" : {amt: 200}}, "Stone-Tools", "Enables more Structures to be built"),
        "Stone Spear" : new Structure(-1, -1, {
          "Wood" : {amt: 100},
          "Minerals" : {amt: 100},
          "Knowledge" : {amt: 300}}, "Stone-Spear", "Improves Hunting"),
        "Stone Hoe" : new Structure(-1, -1, {
          "Wood" : {amt: 200},
          "Minerals" : {amt: 180},
          "Knowledge" : {amt: 300}}, "Stone-Hoe", "Improves farming by 15%"),
        "Stone Axe" : new Structure(-1, -1, {
          "Wood" : {amt: 200},
          "Minerals" : {amt: 180},
          "Knowledge" : {amt: 300}}, "Stone-Axe", "Improves Wood Cutting 15%"),
        "Stone Hammer" : new Structure(-1, -1, {
          "Wood" : {amt: 200},
          "Minerals" : {amt: 180},
          "Knowledge" : {amt: 300}}, "Stone-Hammer", "Improves Minning 15%"),
        "Metal Working" : new Structure(-1, -1, {
          "Knowledge" : {amt: 500}}, "Metal-Working", "Unlocks More Upgrades"),
        "Coal" : new Structure(-1, -1, {
          "Knowledge" : {amt: 800}}, "Coal", "Unlocks coal resource"),
        "Iron Tools" : new Structure(-1, -1, {
          "Knowledge" : {amt: 1000}}, "Iron-Tools", "Unlocks More Upgrades"),
        "Iron Hoe" : new Structure(-1, -1, {
          "Wood" : {amt: 300},
          "Minerals" : {amt: 200},
          "Iron" : {amt: 50},
          "Knowledge" : {amt: 1200}}, "Iron-Hoe", "Improves farming by 25%"),
        "Iron Axe" : new Structure(-1, -1, {
          "Wood" : {amt: 300},
          "Minerals" : {amt: 200},
          "Iron" : {amt: 50},
          "Knowledge" : {amt: 1200}}, "Iron-Axe", "Improves Wood Cutting by 25%"),
        "Iron Pick" : new Structure(-1, -1, {
          "Wood" : {amt: 300},
          "Minerals" : {amt: 200},
          "Iron" : {amt: 50},
          "Knowledge" : {amt: 1200}}, "Iron-Pick", "Improves Minning by 25%"),
        "Construction" : new Structure(-1, -1, {
          "Knowledge" : {amt: 1400}}, "Construction", "Unlocks More Buildings"),
        "Silos" : new Structure(-1, -1, {
          "Wood" : {amt: 200},
          "Minerals" : {amt: 200},
          "Iron" : {amt: 100},
          "Knowledge" : {amt: 1500}}, "Silos", "Farms store twice as much food"),
        "Bellows" : new Structure(-1, -1, {
          "Knowledge" : {amt: 1500}}, "Bellows", "Blacksmiths are more efficent"),
        "Steel" : new Structure(-1, -1, {
          "Knowledge" : {amt: 2000}}, "Steel", "Unlocks More Buildings"),
        "Steel Hoe" : new Structure(-1, -1, {
          "Wood" : {amt: 300},
          "Minerals" : {amt: 200},
          "Steel" : {amt: 50},
          "Knowledge" : {amt: 2200}}, "Steel-Hoe", "Improves farming by 35%"),
        "Steel Axe" : new Structure(-1, -1, {
          "Wood" : {amt: 300},
          "Minerals" : {amt: 200},
          "Steel" : {amt: 50},
          "Knowledge" : {amt: 2200}}, "Steel-Axe", "Improves Wood Cutting by 35%"),
        "Steel Pick" : new Structure(-1, -1, {
          "Wood" : {amt: 300},
          "Minerals" : {amt: 200},
          "Steel" : {amt: 50},
          "Knowledge" : {amt: 2200}}, "Steel-Pick", "Improves Minning by 35%"),
      };

      $scope.occupations = {'Farmer': {amt: 0, max: 1, multi: 1, produce:{"Food": 0.04}},
                            'Miner': {amt: 0, max: 0, multi: 1, produce:{"Minerals": 0.015}},
                            'Lumberjack': {amt: 0, max: 1, multi: 1, produce:{"Wood": 0.03, "Buildable Land": .0002}},
                            'Blacksmith': {amt: 0, max: 0, multi: 1, produce:{"Minerals": -0.01, "Wood": -0.02, "Iron": 0.005, "Coal": 0.001}},
                            'Steelsmith': {amt: 0, max: 0, multi: 1, produce:{"Iron": -0.01, "Coal": -0.02, "Steel": 0.005}},
                            'Hunter': {amt: 0, max: 0, multi: 1, produce:{"Furs": 0.001, "Food": 0.02}},
                            'Scholar': {amt: 0, max: 0, multi: 1, produce:{"Knowledge": 0.005}},
                            'Freeloader': {amt: 0, max: 0, multi: 1, produce:{"Food": 0.0, "Knowledge": -0.0025}},
                            'total': {amt: 0, max: 0, multi: 1, produce:{"Food": -0.02, "Knowledge": 0.0025}}};

      $scope.muteState = "Mute";

    }
    //Buildings
    $scope.structures["Mine"].additionalBuyEvents = function(multi) {
      $scope.resources["Minerals"].max+= 100 * multi;
      $scope.occupations["Miner"].max+=5 * multi;
      $scope.occupations["Miner"].multi *= 1.05;
    };
    $scope.structures["Small Farm"].additionalBuyEvents = function(multi) {
      $scope.resources["Food"].max+=100 * multi;
      $scope.occupations["Farmer"].max+=5 * multi;
      $scope.occupations["Farmer"].multi *= 1.05;
    };
    $scope.structures["Lumberyard"].additionalBuyEvents = function(multi) {
      $scope.resources["Wood"].max+=100 * multi;
      $scope.occupations["Lumberjack"].max+=5 * multi;
      $scope.occupations["Lumberjack"].multi *= 1.05;
    };
    $scope.structures["Smeltry"].additionalBuyEvents = function(multi) {
      $scope.resources["Iron"].max+=50 * multi;
      $scope.occupations["Blacksmith"].max+=2 * multi;
    };
    $scope.structures["Hut"].additionalBuyEvents = function(multi) {
      if(multi > 0) {
        $scope.occupations["total"].max+=1;
        $scope.occupations["Freeloader"].max+=1;
      }
    };
    $scope.structures["House"].additionalBuyEvents = function(multi) {
      if(multi > 0) {
        $scope.occupations["total"].max+=4;
        $scope.occupations["Freeloader"].max+=4;
      }
    };
    $scope.structures["Warehouse"].additionalBuyEvents = function(multi) {
      $scope.resources["Food"].max+=120 * multi;
      $scope.resources["Wood"].max+=100 * multi;
      $scope.resources["Minerals"].max+=100 * multi;
      $scope.resources["Iron"].max+=50 * multi;
      $scope.resources["Furs"].max+=25 * multi;
    };
    $scope.structures["Library"].additionalBuyEvents = function(multi) {
      $scope.resources["Knowledge"].max+=500 * multi;
      $scope.occupations["Scholar"].max+=2 * multi;
      if(multi > 0)
        $scope.occupations["Scholar"].multi*=1.05;
      else
        $scope.occupations["Scholar"].multi/=1.05;
    };
    $scope.structures["School"].additionalBuyEvents = function(multi) {
      $scope.resources["Knowledge"].max+=1000;
      $scope.occupations["Scholar"].max+=5;
      if(multi > 0)
        $scope.occupations["Scholar"].multi*=1.25;
      else
        $scope.occupations["Scholar"].multi/=1.25;
    };
    //Upgrades
    $scope.upgrades["Agriculture"].additionalBuyEvents = function(multi) {
      $scope.upgrades["Wood Tools"].owned = 0;
      $scope.structures["Small Farm"].owned = 0;
      $scope.structures["Hut"].owned = 0;
    };
    $scope.upgrades["Wood Tools"].additionalBuyEvents = function(multi) {
      $scope.upgrades["Stone Tools"].owned = 0;
      $scope.upgrades["Wood Hoe"].owned = 0;
      $scope.upgrades["Wood Spear"].owned = 0;
    };
    $scope.upgrades["Wood Hoe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Farmer"].multi *= 1.1;
    };
    $scope.upgrades["Wood Spear"].additionalBuyEvents = function(multi) {
      $scope.resources["Furs"].max += 50;
      $scope.occupations["Hunter"].max += 10;
    };
    $scope.upgrades["Stone Tools"].additionalBuyEvents = function(multi) {
      $scope.upgrades["Stone Hoe"].owned = 0;
      $scope.upgrades["Stone Axe"].owned = 0;
      $scope.upgrades["Stone Hammer"].owned = 0;
      $scope.upgrades["Metal Working"].owned = 0;
      $scope.structures["Mine"].owned = 0;
      $scope.structures["Lumberyard"].owned = 0;
    };
    $scope.upgrades["Stone Spear"].additionalBuyEvents = function(multi) {
      $scope.occupations["Hunter"].multi *= 1.15;
      $scope.occupations["Hunter"].max += 5;
    };
    $scope.upgrades["Stone Axe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Lumberjack"].multi *= 1.15;
    };
    $scope.upgrades["Stone Hoe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Farmer"].multi *= 1.15;
    };
    $scope.upgrades["Stone Hammer"].additionalBuyEvents = function(multi) {
      $scope.occupations["Miner"].multi *= 1.15;
    };
    $scope.upgrades["Metal Working"].additionalBuyEvents = function(multi) {
      $scope.upgrades["Coal"].owned = 0;
      $scope.upgrades["Iron Tools"].owned = 0;
      $scope.structures["Library"].owned = 0;
    };
    $scope.upgrades["Coal"].additionalBuyEvents = function(multi) {
      $scope.structures["Smeltry"].owned = 0;
      $scope.resources["Coal"].max = 200;
      $scope.occupations["Miner"].produce["Coal"] = 0.003;
      $scope.upgrades["Steel"].owned = 0;
    };
    $scope.upgrades["Iron Tools"].additionalBuyEvents = function(multi) {
      $scope.structures["Warehouse"].owned = 0;
      $scope.structures["House"].owned = 0;
      $scope.upgrades["Iron Hoe"].owned = 0;
      $scope.upgrades["Iron Axe"].owned = 0;
      $scope.upgrades["Iron Pick"].owned = 0;
      $scope.upgrades["Construction"].owned = 0;
    };
    $scope.upgrades["Iron Hoe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Farmer"].multi *= 1.25;
    };
    $scope.upgrades["Iron Axe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Lumberjack"].multi *= 1.25;
    };
    $scope.upgrades["Iron Pick"].additionalBuyEvents = function(multi) {
      $scope.occupations["Miner"].multi *= 1.25;
    };
    $scope.upgrades["Construction"].additionalBuyEvents = function(multi) {
      $scope.upgrades["Silos"].owned = 0;
      $scope.structures["School"].owned = 0;
    };
    $scope.upgrades["Silos"].additionalBuyEvents = function(multi) {
      $scope.resources["Food"].max += ($scope.structures["Small Farm"].owned * 100);
    };
    $scope.upgrades["Steel"].additionalBuyEvents = function(multi) {
      $scope.occupations["Steelsmith"].max += 2;
      $scope.resources["Steel"].max = 100;
      $scope.upgrades["Steel Hoe"].owned = 0;
      $scope.upgrades["Steel Axe"].owned = 0;
      $scope.upgrades["Steel Pick"].owned = 0;
    };
    $scope.upgrades["Steel Hoe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Farmer"].multi *= 1.35;
    };
    $scope.upgrades["Steel Axe"].additionalBuyEvents = function(multi) {
      $scope.occupations["Lumberjack"].multi *= 1.35;
    };
    $scope.upgrades["Steel Pick"].additionalBuyEvents = function(multi) {
      $scope.occupations["Miner"].multi *= 1.35;
    };

  };
  init();

  /*************
  * Hire Someone
  **************/
  $scope.assignJob = function(job) {
    if($scope.occupations["Freeloader"].amt > 0 && $scope.occupations[job].amt < $scope.occupations[job].max) {
      $scope.occupations[job].amt++;
      $scope.occupations["Freeloader"].amt--;
    }
  };

  /*************
  * Fire Someone
  **************/
  $scope.unassignJob = function(job) {
    if($scope.occupations[job].amt > 0) {
      $scope.occupations[job].amt--;
      $scope.occupations["Freeloader"].amt++;
    }
  };

  /*************
  * getMaxPop
  **************/
  $scope.getMaxPop = function() {
    return Math.max($scope.structures["Hut"].owned, 0) + Math.max($scope.structures["House"].owned * 4, 0);
  };

  /************
  * Cap a Nigga
  *************/
  killSomeone = function(msg) {
    msg = msg || msgs.starved.msg;
    if($scope.occupations["total"].amt > 0) {
      for(item in $scope.occupations) {
        if($scope.occupations[item].amt > 0 && item != 'total') {
          $scope.occupations[item].amt--;
          $scope.occupations["total"].amt--;
          break;
        }
      }
      $scope.newMsg(msg, dingLow);
    }
  };

  /********************************
  * Calculate Resource Gain PerTick
  *********************************/
  calcGainPerTick = function() {
    temp = {};
    for(job in $scope.occupations) {
      for(resrc in $scope.occupations[job].produce) {
        amt = $scope.occupations[job].amt * $scope.occupations[job].produce[resrc] * $scope.occupations[job].multi * globalProductionMultiplyer;
        if(typeof(temp[resrc]) == 'undefined')
          temp[resrc] = 0;
        if(resrc == "Knowledge" && ($scope.resources[resrc].max <= $scope.resources[resrc].amt)) {
          temp[resrc] += amt / 2;//Knowledge gained at half rate when limit is reached
          $scope.resources[resrc].max += amt / 2;
        }
        else
          temp[resrc] += amt;
      }
    }
    if($scope.resources["Wood"].amt == 0 || $scope.resources["Minerals"].amt == 0)
      temp["Iron"] = 0;//only produce iron when wood and minerals are present
    if($scope.resources["Wood"].max > $scope.resources["Wood"].amt)//only create buildable land when wood is being chopped
      $scope.resources["Buildable Land"].max += temp["Buildable Land"];
    for(resrc in temp)//apply all the gains that were calculated
      $scope.resources[resrc].perTick = temp[resrc];
  };


  /*************
  * objectKeys
  **************/
  $scope.objectKeys = function(obj){
    return Object.keys(obj);
  }


  /*************
  * Go Hunting
  **************/
  $scope.hunt = function() {
    fur = Math.ceil(Math.random() * (3 - 1) + 1);//(min - max) + min
    food = Math.ceil(Math.random() * 40);
    $scope.resources["Furs"].amt += fur;
    $scope.resources["Food"].amt += food;
    $scope.resources["Knowledge"].amt += Math.random() * 20;
    $scope.huntTimer.started = true;
    $scope.newMsg("You return from your hunt with " + fur + " fur and " + food + " food.", hunt);
  };

  /*******************
  * Gather Resources
  ******************/
  var clickElements = 1;
  $scope.gatherRsrc = function(rsrcStr, jobStr) {
    if($scope.resources[rsrcStr].amt < $scope.resources[rsrcStr].max) {
      var rsrc = +($scope.occupations[jobStr].multi).toFixed(3);
      var know = +(($scope.occupations[jobStr].multi + $scope.occupations['Scholar'].multi) * 0.125).toFixed(3);
      var land = +($scope.occupations["Lumberjack"].multi * 0.01).toFixed(3);
      $scope.resources[rsrcStr].amt += rsrc;
      $scope.resources["Knowledge"].amt += know;
      if(rsrcStr === 'Wood' && chop.pos() == 0) {
        chop.play();
        $scope.resources["Buildable Land"].max += land;
        $scope.resources["Buildable Land"].amt += land;
      }
      if(rsrcStr === 'Food' && woosh.pos() == 0)
        woosh.play();
      if(rsrcStr === 'Minerals' && pick.pos() == 0)
        pick.play();
      if(clickElements > 10)
        $("#clicks" +  (clickElements - 10)).remove();
      $("." + rsrcStr).append("<span id='clicks" + clickElements++ + "' class='clicks' style='left:" + Math.ceil(Math.random()*50) + "px'>+" + rsrc + " " + rsrcStr + "</br>+" + know + " Knowledge</span>");
    }
  };

  /**************
  * Mute / Unmute
  ***************/
  $scope.muteToggle = function() {
    if($scope.muteState === "Unmute") {
      Howler.unmute();
      $scope.muteState = "Mute";
    }
    else {
      Howler.mute();
      $scope.muteState = "Unmute";
    }
  };

  /***************************
  * Get Unread Message Number
  ***************************/
  $scope.getUnread = function() {
    num = 0;
    for(i = 0; i < $scope.msgLog.length; i++)
      if($scope.msgLog[i].read === false)
        num++;
    return num;
  };

  /*******************
  * Timer Functions
  *********************/
  var timerTick = function(timer, doThis) {
    timer.current -= 1000/$scope.fps;
    if(timer.current <= 0) {
      timerReset(timer);
      doThis();
    }
  };
  //reset timer
  var timerReset = function(timer) {
    timer.started = false;
    timer.current = timer.mili;
  };

  //calculate day based on milliseconds (~3 sec per day)
  $scope.getDay = function(time) {
    return 1 + Math.floor((time.mili - time.current) / 1000 / 3);
  };

  /**********
  * Game Loop
  ***********/
  var timer = $interval(function () {
    //people move in at random intervals
    if($scope.structures["Hut"].owned > $scope.occupations["total"].amt && Math.random() > .997) {
      $scope.occupations["total"].amt++;
      $scope.occupations["Freeloader"].amt++;
      $scope.newMsg(msgs.newGuy.msg);
    }
    //time passes
    timerTick($scope.seasonTimer, function() {
      if ($scope.seasonTimer.season == 3) {
        $scope.seasonTimer.season = 0;
        $scope.seasonTimer.year++;
      }
      else
        $scope.seasonTimer.season++;
    });
    //hunt button has been clicked
    if($scope.huntTimer.started){
      $scope.huntTimer.current -= 1000/$scope.fps;
      if($scope.huntTimer.current <= 0){
        $scope.huntTimer.started = false;
        $scope.huntTimer.current = $scope.huntTimer.mili;
      }
    }
    //people starve to death
    if($scope.resources["Food"].amt == 0 && $scope.occupations["total"].amt > 0) {
      $scope.killTimer.started = true;
      timerTick($scope.killTimer, killSomeone);
    }
    else if($scope.killTimer.started)
      timerReset($scope.killTimer.started);
    //calculate resources gained
    calcGainPerTick();
    //keep resources within max limit
    for(item in $scope.resources) {
      $scope.resources[item].amt += $scope.resources[item].perTick;
      $scope.resources[item].amt = Math.max(Math.min($scope.resources[item].amt, $scope.resources[item].max), 0);
    }
    //fire people
    for(item in $scope.occupations) {
      while($scope.occupations[item].max < $scope.occupations[item].amt)
        unassignJob(item);
    }
    //people move away
    while($scope.getMaxPop() < $scope.occupations["total"].amt) {
      console.log($scope.getMaxPop() + " " + $scope.occupations["total"].amt);
      killSomeone(msgs.movedOut.msg);
    }
    //seasons affect food preduction
    if($scope.seasonTimer.season == 3)
        $scope.resources["Food"].perTick /= 2;
    if($scope.seasonTimer.season == 0)
        $scope.resources["Food"].perTick *= 1.5;

  }, 1000 / $scope.fps, 0);


  /**********
  * Save Game
  ***********/
  $scope.saveGame = function(msg) {
    msg = msg || 0;
    if(msg)
      $scope.newMsg('Game Saved');
    localStorage.setItem('version', 1);
    localStorage.setObject('resources', $scope.resources);
    localStorage.setObject('structures', $scope.structures);
    localStorage.setObject('upgrades', $scope.upgrades);
    localStorage.setObject('occupations', $scope.occupations);
    localStorage.setObject('msgLog', $scope.msgLog);
    localStorage.setObject('seasonTimer', $scope.seasonTimer);
    localStorage.setObject('mute', $scope.muteState);
  };
  var autoSaveTimer = $interval(function () { $scope.saveGame(); }, 60000, 0);


  /**********
  * Reset Game (work in progress)
  ***********/
  $scope.resetGame = function() {
    localStorage.removeItem('version');
    localStorage.removeItem('resources');
    localStorage.removeItem('structures');
    localStorage.removeItem('upgrades');
    localStorage.removeItem('occupations');
    localStorage.removeItem('msgLog');
    localStorage.removeItem('seasonTimer');
    localStorage.removeItem('mute');
    timerReset($scope.huntTimer);
    $scope.newMsg(msgs.reset.msg, 'none', 'gameInfo');
    init();
  };

  /***********************
  * Destroy Timers on exit
  ***********************/
  $scope.$on('$destroy', function () {
    if (angular.isDefined(timer)) {
      $interval.cancel(timer);
      timer = undefined;
    }
    if (angular.isDefined(autoSaveTimer)) {
      $interval.cancel(autoSaveTimer);
      autoSaveTimer = undefined;
    }
  });

}]);//end of $scope


/******************
* Local Storage Fix
******************/
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

/******************
* What Time Is It!?
******************/
var whatTime = function() {
  return new Date().toLocaleString('en-US', { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })
};

var pick = new Howl({urls: ['sounds/pickaxe.wav']});
var woosh = new Howl({urls: ['sounds/Woosh.wav']});
var chop = new Howl({urls: ['sounds/woodchop.wav']});
var ding = new Howl({urls: ['sounds/ding.wav']});
var dingLow = new Howl({urls: ['sounds/dingLow.wav']});
var hunt = new Howl({urls: ['sounds/BowFire.wav']});

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip({ animation: true, html:true, placement:'right' });
});
