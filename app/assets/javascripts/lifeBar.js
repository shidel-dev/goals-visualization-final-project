// ----- Setup-----

window.onload = function() {
  window.paper = new Raphael(document.getElementById('life_bar'), 880, 500);
  window.bar = new Bar();

};


// ---- Bar Object ------

function Bar(){
  this.nodes = [];
  this.connections = [];
  this.events();
};

Bar.prototype.createNode = function(x,y,r){
  $("circle").unbind("click");
  this.nodes.push(new Node(x,y,r));
  $(".popup").remove();
};

Bar.prototype.createConnection = function(node1, node2){
  var con = paper.connection(node1, node2, "blue");
  this.connections.push(con);
  node1.ref.connected = true;
  node2.ref.connected = true;
};

Bar.prototype.events = function(){
  $(paper.canvas).click(function(e){
    if(!$(e.target).parents('svg').length) bar.createNode(e.offsetX, e.offsetY, 10)
  });

};

// ----- Node Object -----

function Node(x, y, r){
  this.x = x;
  this.y = y;
  this.r = r;
  this.title = "hello"
  this.connected = false;
  this.render();
  this.events();
}; 

Node.prototype.render = function(){
  this.elem = paper.circle(this.x, this.y, this.r);
  this.elem.attr({fill:"green"});
  this.elem.ref = this;
};

Node.prototype.events = function(){
  this.elem.drag(move,start,this.end);
  this.elem.mouseup(function(event){
    nodeInfo(this,event);
  })
};

Node.prototype.end = function(e){  
  this.ref.x = this.attrs.cx;
  this.ref.y = this.attrs.cy;
}

// ----- Drag functions -----
function start(){
  this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
  this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");  
};

function move(dx, dy) {
  var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
  this.attr(att);

  for (var i = bar.connections.length; i--;) {
    paper.connection(bar.connections[i]);
  }
  paper.safari();
};


// ------Helpers --------

Raphael.fn.connection = function (obj1, obj2, line, bg) {
  if (obj1.line && obj1.from && obj1.to) {
    line = obj1;
    obj1 = line.from;
    obj2 = line.to;
  }
  var bb1 = obj1.getBBox(),
      bb2 = obj2.getBBox(),
      p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
      {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
      {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
      {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
      {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
      {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
      {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
      {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
      d = {}, dis = [];

  for (var i = 0; i < 4; i++) {
    for (var j = 4; j < 8; j++) {
      var dx = Math.abs(p[i].x - p[j].x),
        dy = Math.abs(p[i].y - p[j].y);
      if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
        dis.push(dx + dy);
        d[dis[dis.length - 1]] = [i, j];
      }
    }
  }
  if (dis.length == 0) {
    var res = [0, 4];
  } else {
    res = d[Math.min.apply(Math, dis)];
  }
  var x1 = p[res[0]].x,
      y1 = p[res[0]].y,
      x4 = p[res[1]].x,
      y4 = p[res[1]].y;
  dx = Math.max(Math.abs(x1 - x4) / 2, 10);
  dy = Math.max(Math.abs(y1 - y4) / 2, 10);
  var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
      y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
      x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
      y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
  var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
  if (line && line.line) {
    line.bg && line.bg.attr({path: path});
    line.line.attr({path: path});
  } else {
    var color = typeof line == "string" ? line : "#000";
    return {
      bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
      line: this.path(path).attr({stroke: color, fill: "none"}),
      from: obj1,
      to: obj2
    };
  }
};


function nodeInfo(node,event){
  $(".popup").remove()
  _.templateSettings.variable = "v";
  var template = _.template($("script.popupTemplate").html());
  $("#container").append(template(node.ref))
  $(".popup").css({"left" : event.x - 160 + "px", "top" : event.y - 160 + "px"})
  $("#exit").click(remove)
  $('.action').click(function(e){
    if (e.target.id === "complete") {
      alert("complete");
    } else if (e.target.id === "link") {
      listenForNextNode(node.ref)
    } else if (e.target.id === "sever") {
      alert("sever");
    };
  })
};

function remove(e){e.target.parentNode.remove()};

function listenForNextNode(oNode){
 $("circle").click(function(e){
    _.each( bar.nodes,function(node){
      if (e.target === node.elem[0] && e.target !== oNode.elem[0]){
        bar.createConnection(oNode.elem,node.elem);
        $("circle").unbind("click");
      };
    });
  });
};  


 
 
