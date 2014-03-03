save = function(bar) {
  var barJSON = {};
  saveNodes(bar, barJSON);
  saveConnections(bar, barJSON);
  return barJSON;
}

saveNodes = function(bar, barJSON) {
  var exportedNodes = [];
  var maxId = 0;
  for(var i = 0; i < bar.nodes.length; i++) {
    var nodeData = {};
    nodeData.id = bar.nodes[i].id;
    nodeData.x = bar.nodes[i].x;
    nodeData.y = bar.nodes[i].y;
    nodeData.title = bar.nodes[i].title;
    nodeData.completed = bar.nodes[i].completed;
    nodeData.reflection = bar.nodes[i].reflection;
    exportedNodes.push(nodeData);
    if(nodeData.id > maxId) {
      maxId = nodeData.id;
    };
  }
  barJSON.maxId = maxId;
  barJSON.nodes = exportedNodes;
};

saveConnections = function(bar, barJSON) {
  var exportedConnections = [];
  for(var i = 0; i < bar.connections.length; i++) {
    var connectionData = {};
    connectionData.from = bar.connections[i].from.ref.id;
    connectionData.to = bar.connections[i].to.ref.id;
    exportedConnections.push(connectionData);
  }
  barJSON.connections = exportedConnections;
}


populate = function(bar, data) {
  populateNodes(bar, data);
  populateConnections(bar, data);
}

populateNodes = function(bar, data) {
  if(data === {}) { // figure out what non-existent object from mongodb will be here
    return;
  }
  bar.nodeCounter = data.maxId + 1;
  for(var i = 0; i < data.nodes.length; i++) {
    bar.createNode(data.nodes[i]);
  }
}

populateConnections = function(bar, data) {
  for(var i = 0; i < data.connections.length; i++) {
    var fromNode = bar.findNodeById(data.connections[i].from);
    var toNode = bar.findNodeById(data.connections[i].to);
    bar.createConnection(fromNode.elem, toNode.elem);
  }
}

saveLifeData = function() {
  data = {person: save(bar)};
  console.log(data);
  $.ajax({
    type: "POST",
    url: '/save',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json"
  });
}

loadLifeData = function() {
  $.ajax({
    type: "POST",
    url: '/load',
    dataType: "json",
    error: function(){
      alert("error");
    },
    success: function(data) {
      populate(window.bar, data);
    }
  })
}
