// ----- Setup-----
// $(window).unload(function(){
//     saveLifeData();
// });

window.onload = function() {
  setup(880)
  window.bar = new Bar();
  window.person = new Person("26-2-1990");
  if($("#login")){
    loadLifeData();
    console.log("loading after login");
  }
};

// --- PERSON Object -----

function Person(birthdate){
  this.birthdate = _.map(birthdate.split("-"),function(part){
    return parseInt(part);
  });
  this.birthdateObj = new Date(this.birthdate[2],this.birthdate[1], this.birthdate[0]);
  this.pos = this.setCurrentMarker();
  this.renderMarkerLine(this.pos * 880);
}

Person.prototype.setCurrentMarker = function(){

  var date  = new Date(),
      year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate(),
      end = _.clone(this.birthdate);

      end[2] = end[2] + 80;
      window.time = new Time(day,month,year);
      time.unit = 1;
      time.period = 960;
      return days_between(date, this.birthdateObj) / 29200;
};

Person.prototype.renderMarkerLine = function(position){
  var marker = paper.path("M" + position + " 0 l 0 200");
  marker.attr({stroke: 'black', 'stroke-width': 1});
  var currentLine = $('#current_label')
  currentLine.css("margin-left", this.pos * 870)
};


// ---- BAR Object ------

function Bar(){
  this.nodes = [];
  this.connections = [];
  this.events();
  this.nodeCounter = 0;
  // assign this.nodeCounter in import/populate function
}

Bar.prototype.createNode = function(nodeOptions){
  $("circle").unbind("click");
  this.nodes.push(new Node(nodeOptions));
  $(".popup").remove();

};

Bar.prototype.createConnection = function(node1, node2){
  var connection = paper.connection(node1, node2, "blue");
  this.connections.push(connection);
  node1.ref.connections.push(connection);
  node2.ref.connections.push(connection);
};

Bar.prototype.removeConnection = function(node1,node2){
  _.each(bar.connections, function(conn, i){
   if(conn.from.ref.id === node1.id || conn.to.ref.id === node1.id){
     if(node2.id === conn.from.ref.id || node2.id === conn.to.ref.id){
        node2.removeConnectionReference(node1.id);
        node1.removeConnectionReference(node2.id);
        $(conn.line)[0].remove();
        bar.connections.splice(i,1);
     }
   }
  });
  autoSave();
};
Bar.prototype.deleteNode = function(nodeToBeDeleted){
  _.each(this.nodes,function(node,i){
    if(node.id === nodeToBeDeleted.id){

      nodeToBeDeleted.elem.remove();
      bar.nodes.splice(i,1);
    }
  });
  $(".popup").remove();
};


Bar.prototype.events = function(){
  var that = this;
  paper.canvas.setAttribute('preserveAspectRatio', 'none');
  cover.click(function(e){
    if($(".popup").length){
      remove()
    } else {
      var nodeOptions = {id: that.nodeCounter, x: e.layerX, y: e.layerY};
      bar.createNode(nodeOptions);
      that.nodeCounter++;
    }
    autoSave();
  });
};

Bar.prototype.findNodeById = function(id) {
  for(var i = 0; i < this.nodes.length; i++) {
    if(this.nodes[i].id === id) return this.nodes[i];
  }
};

// ----- NODE Object -----

function Node(options) {
  this.id = options.id;
  this.x = options.x / time.unit;
  this.y = options.y;
  this.r = 8;
  this.connections = [];
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
}

Node.prototype.render = function(multi){
  this.elem = paper.circle(this.x *  multi, this.y, this.r);
  var fill = this.completed ? "#3F6D61" : "#424791";
  this.elem.attr({fill: fill,stroke:'none'});
  this.elem.ref = this;
  this.events();
};

Node.prototype.events = function(){
  this.elem.drag(move,start,this.end);
  this.elem.mouseup(function(event){
    nodeInfo(this,event);
  });
};

Node.prototype.end = function(){
  this.ref.x = this.attrs.cx/time.unit;
  this.ref.y = this.attrs.cy;
  autoSave();
};

Node.prototype.complete = function(){
  this.completed = true;
  this.elem.attr({fill:"#3F6D61"});
  autoSave();
};

Node.prototype.saveText = function(text){
  this.title = text;
  autoSave();
};

Node.prototype.saveReflection = function(text){
  this.reflection = text;
  autoSave();
}

Node.prototype.deleteNode = function(){
  _.each(_.clone(this.connections), function(connection){
    bar.removeConnection(connection.to.ref, connection.from.ref);
  });
  bar.deleteNode(this);
  autoSave();
};

Node.prototype.removeConnectionReference = function(id){
  var that = this;
  _.each(this.connections,function(connection,i){
    if(connection.to.ref.id === id || connection.from.ref.id === id){
      that.connections.splice(i,1);
    }
  });
};


// ----- NODE Drag helpers -----

function start(){
  this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
  this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
}

function move(dx, dy) {
  var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
  this.attr(att);
  for (var i = bar.connections.length; i--;) {
    paper.connection(bar.connections[i]);
  }
  paper.safari();
}

// -----TIME Controller ---

function Time(day,month,year){
  this.day = day;
  this.month = month;
  this.year = year;
  this.events();
}

Time.prototype.events = function(){
  $("#month").click(function(e){
    time.scale("month");
    highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("months")
  });

  $("#year").click(function(e){
    time.scale("year");
    highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("years")
  });
  $("#5year").click(function(e){
    time.scale("5year");
    highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("5")
  });
  $("#10year").click(function(e){
    time.scale("10year");
    highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("decades")
  });
  $("#life").click(function(e){
    time.scale("life");
    highlightText(e.target);
    $(".time").hide();
    $("#current_label").show();
  })
  $("#arrow_left").click(function(){
    if(!$("svg").is(':animated') ) {
      timeKeeper.updateCount("left");
      shiftTime(1);
    };
  })
  $("#arrow_right").click(function(){
    if(!$("svg").is(':animated') ) {
      timeKeeper.updateCount("right");
      shiftTime(-1);
    };
  });
  $("#arrow_left").click(function(){
    if(!$("svg").is(':animated')){shiftTime(1);}
  });
  $("#arrow_right").click(function(){
    if(!$("svg").is(':animated') ) {shiftTime(-1);}
  });
};

Time.prototype.scale = function(unit){
  if(unit === "month"){
    scaleBar(844800,960);
    this.unit = 960;
    this.period = 1;
    $(".arrow").show();
    this.shift = Math.round(844800 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if(unit === "year"){
    scaleBar(70400,80);
    this.unit = 80;
    this.period = 12;
    $(".arrow").show();
    this.shift = Math.round(70400 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if(unit === "5year"){
    scaleBar(14080,16);
    this.unit = 16;
    this.period = 60;
    $(".arrow").show();
    this.shift = Math.round(14080 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if(unit === "10year"){
    scaleBar(7040,8);
    this.unit = 8;
    this.period = 120;
    $(".arrow").show();
    this.shift = Math.round(7040 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if (unit === "life"){
    scaleBar(880,1);
    this.unit = 1;
    this.period = 960;
    $(".arrow").hide();
    person.renderMarkerLine(person.pos * 880);
  }
};
