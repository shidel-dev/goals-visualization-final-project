save = function(lifeBar) {
  var lifeBarJSON = {};
  saveNodes(lifeBar, lifeBarJSON);
  saveConnections(lifeBar, lifeBarJSON);
  return lifeBarJSON;
}

saveNodes = function(lifeBar, lifeBarJSON) {
  var exportedNodes = [];
  var maxId = 0;
  for(var i = 0; i < lifeBar.nodes.length; i++) {
    var nodeData = {};
    nodeData.id = lifeBar.nodes[i].id;
    nodeData.x = lifeBar.nodes[i].x;
    nodeData.y = lifeBar.nodes[i].y;
    nodeData.title = lifeBar.nodes[i].title;
    nodeData.completed = lifeBar.nodes[i].completed;
    nodeData.reflection = lifeBar.nodes[i].reflection;
    exportedNodes.push(nodeData);
    if(nodeData.id > maxId) {
      maxId = nodeData.id;
    };
  }
  lifeBarJSON.maxId = maxId;
  lifeBarJSON.nodes = exportedNodes;
};

saveConnections = function(lifeBar, lifeBarJSON) {
  var exportedConnections = [];
  for(var i = 0; i < lifeBar.connections.length; i++) {
    var connectionData = {};
    connectionData.from = lifeBar.connections[i].from.ref.id;
    connectionData.to = lifeBar.connections[i].to.ref.id;
    exportedConnections.push(connectionData);
  }
  lifeBarJSON.connections = exportedConnections;
}


populate = function(lifeBar, data) {
  populateNodes(lifeBar, data);
  populateConnections(lifeBar, data);
}

populateNodes = function(lifeBar, data) {
  if(data === {}) { // figure out what non-existent object from mongodb will be here
    return;
  }
  lifeBar.nodeCounter = data.maxId + 1;
  for(var i = 0; i < data.nodes.length; i++) {
    lifeBar.createNode(data.nodes[i]);
  }
}

populateConnections = function(lifeBar, data) {
  for(var i = 0; i < data.connections.length; i++) {
    var fromNode = lifeBar.findNodeById(data.connections[i].from);
    var toNode = lifeBar.findNodeById(data.connections[i].to);
    lifeBar.createConnection(fromNode.elem, toNode.elem);
  }
}

window.autoSave = _.debounce(saveLifeData,1000)

function saveLifeData (){
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
