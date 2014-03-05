save = function(lifeBar) {
  var lifeBarJSON = {};
  saveGoals(lifeBar, lifeBarJSON);
  saveConnections(lifeBar, lifeBarJSON);
  return lifeBarJSON;
}

saveGoals = function(lifeBar, lifeBarJSON) {
  var exportedGoals = [];
  var maxId = 0;
  for(var i = 0; i < lifeBar.goals.length; i++) {
    var goalData = {};
    goalData.id = lifeBar.goals[i].id;
    goalData.x = lifeBar.goals[i].x;
    goalData.y = lifeBar.goals[i].y;
    goalData.title = lifeBar.goals[i].title;
    goalData.completed = lifeBar.goals[i].completed;
    goalData.reflection = lifeBar.goals[i].reflection;
    exportedGoals.push(goalData);
    if(goalData.id > maxId) {
      maxId = goalData.id;
    };
  }
  lifeBarJSON.maxId = maxId;
  lifeBarJSON.goals = exportedGoals;
};

saveConnections = function(lifeBar, lifeBarJSON) {
  var exportedConnections = [];
  for(var i = 0; i < lifeBar.connections.length; i++) {
    var connectionData = {};
    connectionData.from = lifeBar.connections[i].from.model.id;
    connectionData.to = lifeBar.connections[i].to.model.id;
    exportedConnections.push(connectionData);
  }
  lifeBarJSON.connections = exportedConnections;
}


populate = function(lifeBar, data) {
  if(data.goals){ populateGoals(lifeBar, data); }
  if(data.connections) { populateConnections(lifeBar, data); }
}

populateGoals = function(lifeBar, data) {
  if(data === {}) { // figure out what non-existent object from mongodb will be here
    return;
  }
  lifeBar.goalCounter = data.maxId + 1;
  for(var i = 0; i < data.goals.length; i++) {
    lifeBar.createGoal(data.goals[i]);
  }
}

populateConnections = function(lifeBar, data) {
  for(var i = 0; i < data.connections.length; i++) {
    var fromgoal = lifeBar.findGoalById(data.connections[i].from);
    var togoal = lifeBar.findGoalById(data.connections[i].to);
    lifeBar.createConnection(fromgoal.elem, togoal.elem);
  }
}

window.autoSave = function() {
  if ($("#logged-in").length) {
    console.log("autosave");
    saveLifeData();
  };
};

saveLifeData = function(){
  data = {life_data: save(lifeBar)};
  $.ajax({
    async:false,
    type: "POST",
    url: '/save',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json"
  });
}

loadLifeData = function() {
  $.ajax({
    type: "GET",
    url: '/load',
    dataType: "json",
    success: function(data) {
      populate(window.lifeBar, data);
    }
  })
}
