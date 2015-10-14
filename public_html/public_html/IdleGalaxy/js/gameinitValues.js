angular.module("initValues", [])
	.value("gameData", {
    resources: {
      "Food" : new Resource(20, 300, "Food"),
      "Wood" : new Resource(200, 800, "Wood"),
      "Minerals" : new Resource(0, 700, "Minerals"),
      "Iron" : new Resource(0, 0, "Iron"),
      "Coal" : new Resource(0, 0, "Coal"),
      "Steel" : new Resource(0, 0, "Steel"),
      "Furs" : new Resource(0, 0, "Furs"),
      "Buildable Land" : new Resource(60, 60, "Buildable Land"),
      "Knowledge" : new Resource(0, 1000, "Knowledge")
	  }

});
