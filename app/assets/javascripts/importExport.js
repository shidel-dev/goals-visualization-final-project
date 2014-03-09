save = function(lifeBar) {
  var lifeBarJSON = {};
  saveGoals(lifeBar, lifeBarJSON);
  saveConnections(lifeBar, lifeBarJSON);
  return lifeBarJSON;
}

saveGoals = function(lifeBar, lifeBarJSON) {
  var exportedGoals = [];
  var maxId = 0;
   _.each(lifeBar.goals, function(goal){
    var goalData = {};
    goalData.id = goal.id;
    goalData.x = goal.x;
    goalData.y = goal.y;
    goalData.title = goal.title;
    goalData.completed = goal.completed;
    goalData.reflection = goal.reflection;
    exportedGoals.push(goalData);
    if(goalData.id > maxId) {
      maxId = goalData.id;
    };
  })
  lifeBarJSON.maxId = maxId;
  lifeBarJSON.goals = exportedGoals;
};

saveConnections = function(lifeBar, lifeBarJSON) {
  var exportedConnections = [];
  _.each(lifeBar.connections, function(connection){
    var connectionData = {};
    connectionData.from = connection.from.model.id;
    connectionData.to = connection.to.model.id;
    exportedConnections.push(connectionData);
  })
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
  _.each(data.goals,function(goal) {
    lifeBar.createGoal(goal);
  })
}

populateConnections = function(lifeBar, data) {
  _.each(data.connections, function(connection) {
    var fromgoal = lifeBar.findGoalById(connection.from);
    var togoal = lifeBar.findGoalById(connection.to);
    lifeBar.createConnection(fromgoal.elem, togoal.elem);
  })
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
