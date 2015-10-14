var Message = function(msg, type, time, read) {
  this.msg = msg;
  this.type = type;
  this.read = read || false;
  this.time = time || "";
};

var msgs = {
  save: new Message("Game Saved", "gameInfo"),
  reset: new Message("Game Reset", "gameInfo"),
  gameStart: new Message("You find yourself in a prarrie by a forest.", "story"),
  starved: new Message("One of your villagers has died of starvation.", "story"),
  froze: new Message("One of your villagers froze to death.", "story"),
  movedOut: new Message("One of your villagers has moved away.", "story"),
  newGuy: new Message("A new villager has moved in.", "story")
};
