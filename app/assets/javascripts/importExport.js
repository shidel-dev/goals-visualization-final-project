save = function(bar) {
  var barJSON = {};
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
  return barJSON;
};


populate = function(bar, data) {
  if(data === {}) { // figure out what non-existent object from mongodb will be here
    return;
  }
  bar.nodeCounter = data.maxId + 1;
  for(var i = 0; i < data.nodes.length; i++) {
    bar.createNode(data.nodes[i]);
  }
}
