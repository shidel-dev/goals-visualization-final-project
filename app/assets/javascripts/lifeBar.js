// ----- Setup-----

window.onload = function() {
  setup(880)
  window.bar = new Bar();
  window.person = new Person("27,03,1990");
  // loadLifeData();
};


function setup(width){
  window.paper = new Raphael(document.getElementById('life_bar'), width, 200);
  window.cover = paper.rect(0,0,width,200).attr({fill:"lightgray",stroke:"none"})
}

// --- Person Object -----
function Person(birthdate){
  this.birthdate = _.map(birthdate.split(","),function(part){
    return parseInt(part);
  })
  this.pos = this.setCurrentMarker();
  console.log(this.pos * 960)
  this.renderMarkerLine(this.pos * 960)
}

Person.prototype.setCurrentMarker = function(){

  var date  = new Date()
      year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate(),
      end = _.clone(this.birthdate)
      end[2] = end[2] + 80
      window.time = new Time(day,month,year)
      time.unit = 1;
      time.period = 960;
      return (year - this.birthdate[2]) / 80 
}

Person.prototype.renderMarkerLine = function(position){
  var marker = paper.path("M" + position + " 0 l 0 200")
  marker.attr({stroke: 'black', 'stroke-width': 1});
}

// ---- Bar Object ------

function Bar(){
  this.nodes = [];
  this.connections = [];
  this.events();
  this.nodeCounter = 0;
  // assign this.nodeCounter in import/populate function
};

Bar.prototype.createNode = function(nodeOptions){
  $("circle").unbind("click");
  this.nodes.push(new Node(nodeOptions));
  $(".popup").remove();
};

Bar.prototype.createConnection = function(node1, node2){
  var con = paper.connection(node1, node2, "blue");
  this.connections.push(con);
  node1.ref.connected = true;
  node2.ref.connected = true;
};

Bar.prototype.events = function(){
  var that = this;
  paper.canvas.setAttribute('preserveAspectRatio', 'none');
  cover.click(function(e){

    var nodeOptions = {id: that.nodeCounter, x: e.layerX, y: e.layerY};
   
      bar.createNode(nodeOptions);

      that.nodeCounter++;

  });
};

Bar.prototype.findNodeById = function(id) {
  for(var i = 0; i < this.nodes.length; i++) {
    if(this.nodes[i].id === id) return this.nodes[i];
  }
}

// ----- Node Object -----

function Node(options) {
  // x, y, r, id, title, completed, reflection
  this.id = options.id;
  this.x = options.x / time.unit;
  this.y = options.y;
  this.r = 4;
  this.title = options.title;
  if(options.reflection) {
    this.reflection = options.reflection;
  } else {
    this.reflection = "";
  }
  if(options.completed) {
    this.completed = options.completed;
  } else {
    this.completed = false;
  }
  this.connected = false;
  this.render(time.unit);
}; 

Node.prototype.render = function(multi){
  this.elem = paper.circle(this.x *  multi, this.y, this.r);
  this.elem.attr({fill:"green",stroke:'none'});
  this.elem.ref = this;
  this.events();
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

// -----Time Controller ---

function Time(day,month,year){
  this.day = day;
  this.month = month;
  this.year = year;
  this.events()
}

Time.prototype.events = function(){
  $("#year").click(function(e){
    time.scale("year")
  })

  $("#life").click(function(){
    time.scale("life")
  })

}


Time.prototype.scale = function(unit){

  if(unit === "year"){
    scaleBar(70400,80);
    this.unit = 80;
    this.period = 12
    $(paper.canvas).css("left","-23280px")
  }else if (unit === "life"){
    scaleBar(880,1);
    this.unit = 1;
    this.period = 960

    person.renderMarkerLine(person.pos * this.period)
  }
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
    // $(bar.connections[i].line.node).remove()
    // paper.connection({from:bar.connections[i].from.ref.elem, to:bar.connections[i].to.ref.elem});
    paper.connection(bar.connections[i]);
  }
  paper.safari();
};


// ------Helpers --------

Raphael.fn.connection = function (obj1, obj2, line, bg) {
  if (obj1.line && obj1.from && obj1.to) {
    line = obj1;
    obj1 = line.from.ref.elem;
    obj2 = line.to.ref.elem;
  }
  console.log(obj1)
  console.log(obj2)
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


function scaleBar(width,multi){
  paper.remove();
  setup(width);
  paper.height = "200px"
  $("#life_bar").css("height", "200px")

  _.each(bar.nodes,function(node){
    node.render(multi);
  })
  var barClone = _.clone(bar)
  bar.connections = []
  console.log(barClone)
  console.log(bar)
  _.each(barClone.connections, function(conn){
    bar.createConnection(conn.to.ref.elem, conn.from.ref.elem)
  })
  // _.each(bar.connections,function(conn){
  //   paper.connection(conn.from.ref.elem, conn.to.ref.elem, "blue");
  // })
  bar.events();
};


function nodeInfo(node,event){
  console.log(event)
  $(".popup").remove();
  _.templateSettings.variable = "v";
  var template = _.template($("script.popupTemplate").html());
  $("#container").append(template(node.ref))
  $(".popup").css({"left" : event.pageX - 160 + "px", "top" : event.pageY - 160 + "px"})
  $("#exit").click(remove);
  $('.action').click(function(e){
    if (e.target.id === "complete") {
      alert("complete");
    } else if (e.target.id === "link") {
      listenForNextNode(node.ref);
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
