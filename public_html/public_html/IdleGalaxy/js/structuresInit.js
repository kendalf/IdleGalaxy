/**************
 * Buildings
 *************/
var BUILDINGS = {
  ["Mine"] : new Structure(-1, 1.45, {
    ["Wood"] : {amt: 100},
    ["Minerals"] : {amt: 100},
    ["Knowledge"] : {amt: 100}}, "Mine", "Enables mining job"),
  ["Farm"] : new Structure(-1, 1.45, {
    ["Wood"] : {amt: 100},
    ["Knowledge"] : {amt: 100}}, "Farm", "Enables farming job"),
  ["Lumberyard"] : new Structure(-1, 1.45, {
    ["Wood"] : {amt: 100},
    ["Knowledge"] : {amt: 100}}, "Lumberyard", "Enables Lumberjack job"),
  ["Smeltry"] : new Structure(-1, 1.45, {
    ["Wood"] : {amt: 200},
    ["Minerals"] : {amt: 200},
    ["Knowledge"] : {amt: 200}}, "Smeltry", "Enables blacksmith job"),
  ["Hut"] : new Structure(0, 1.25, {
    ["Wood"] : {amt: 25},
    ["Food"] : {amt: 20},
    ["Knowledge"] : {amt: 60}}, "Hut", "Allows population growth"),
  ["Library"] : new Structure(-1, 1.35, {
    ["Wood"] : {amt: 200},
    ["Knowledge"] : {amt: 500}}, "Library", "Enables Scholar job"),
  ["Workshop"] : new Structure(-1, 1.35, {
    ["Wood"] : {amt: 200},
    ["Knowledge"] : {amt: 500}}, "Workshop", "Enables Carpenter job") 
};

/**************
 * Upgrades
 *************/
var UPGRADES = {
  ["Wood Tools"] : new Structure(0, -1, {
    ["Wood"] : {amt: 20},
    ["Knowledge"] : {amt: 30}}, "Wood-Tools", "Unlocks farming"),
  ["Wood Spear"] : new Structure(0, -1, {
    ["Wood"] : {amt: 50},
    ["Knowledge"] : {amt: 100}}, "Wood-Spear", "Unlocks Hunting"),
  ["Stone Tools"] : new Structure(-1, -1, {
    ["Wood"] : {amt: 50},
    ["Knowledge"] : {amt: 80}}, "Stone-Tools", "Enables more Structures to be built"),
  ["Stone Spear"] : new Structure(-1, -1, {
    ["Wood"] : {amt: 100},
    ["Minerals"] : {amt: 100},
    ["Knowledge"] : {amt: 150}}, "Stone-Spear", "Improves Hunting"),
  ["Iron Tools"] : new Structure(-1, -1, {
    ["Wood"] : {amt: 20},
    ["Minerals"] : {amt: 20},
    ["Iron"] : {amt: 20},
    ["Knowledge"] : {amt: 100}}, "Iron-Tools", "Unlocks Silos Upgrade"),
  ["Silos"] : new Structure(-1, -1, {
    ["Wood"] : {amt: 200},
    ["Minerals"] : {amt: 200},
    ["Iron"] : {amt: 100},
    ["Knowledge"] : {amt: 500}}, "Silos", "Farms store twice as much food")
};
