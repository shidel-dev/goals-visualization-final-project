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

  // Below probably belongs in a 'life bar' view model
  this.pos = this.setCurrentMarker();
  this.renderMarkerLine(this.pos * 880);
}

Person.prototype.endDate = function(){
}

Person.prototype.setCurrentMarker = function(){

  // rename to today
  var date  = new Date(),
      year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate(),
      end = _.clone(this.birthdate);

      end[2] = end[2] + 80;
      // Could window.time be it's own object? Maybe TimeSpan? TimeUnit?
      window.time = new Time(day,month,year);
      time.unit = 1;
      time.period = 960;
      return days_between(date, this.birthdateObj) / 29200;
};

// move to TimeSpanView/Bar? (name...?)
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
  // why the unbind?
  $("circle").unbind("click");
  this.nodes.push(new Node(nodeOptions));
  // delete?
  $(".popup").remove();
};

Bar.prototype.createConnection = function(node1, node2){
  var connection = paper.connection(node1, node2, "#00756F");
  this.connections.push(connection);
  node1.model.connections.push(connection);
  node2.model.connections.push(connection);
};

Bar.prototype.removeConnection = function(node1,node2){
  _.each(this.connections, function(conn, i){
   // if(conn.connected_to(node1)) && conn.conected_to(node2)) {
   if(conn.from.model.id === node1.id || conn.to.model.id === node1.id){
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
  // a global...stinky
  cover.click(function(e){
    if($(".popup").length){
      remove()
    } else {
      var nodeOptions = {id: that.nodeCounter, x: e.offsetX, y: e.offsetY};
      bar.createNode(nodeOptions);
      that.nodeCounter++;
    }
    autoSave();
  });
};

Bar.prototype.findNodeById = function(id) {
  // use underscore
  for(var i = 0; i < this.nodes.length; i++) {
    if(this.nodes[i].id === id) return this.nodes[i];
  }
};

// ----- NODE Object -----

function Node(options) {
  this.id = options.id;
  // find a way to not need a 'time' global, pass it in or maybe this is a mis-mash
  // of node data and presentation data
  //
  // store only options.x here, calculate the 'x' pixel position given the currrent
  // timeframe/lifebar window
  this.x = options.x / time.unit;
  this.y = options.y;
  this.r = 8;
  this.connections = [];
  this.title = options.title;
  this.reflection = options.reflection || "";
  this.completed = options.completed || false;
  this.connected = false;
  this.render(time.unit);
}

Node.prototype.render = function(multi){
  this.elem = paper.circle(this.x *  multi, this.y, this.r);
  var fill = this.completed ? "#048204" : "#0000FF";
  this.elem.attr({fill: fill,stroke:'none'});
  this.elem.ref = this;
  this.events();
};

Node.prototype.events = function(){
  this.elem.drag(move,start, this.end.bind(this));
  this.elem.mouseup(function(event){
    // global, eww
    nodeInfo(this,event);
  });
};

Node.prototype.end = function(event){
  this.x = this.elem.cx/time.unit;
  this.y = this.elem.cy;
  autoSave();
};

Node.prototype.complete = function(){
  this.completed = true;
  this.elem.attr({fill:"#048204"});
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

function TimeNavView(el, day,month,year){
  this.$el = el;
  this.day = day;
  this.month = month;
  this.year = year;
  this.events();
}

Time.prototype.MONTH = "month";
Time.prototype.YEAR = "month";

Time.prototype.bindEvents = function(){
  this.$el.find("#month").click(changeScale(this.MONTH));
  this.$el.find("#year").click(changeScale(this.YEAR));
}

Time.prototype.changeScale(scale) {
  time.scale(scale)
  highlightText(this.$el.find("." + scale));
  $(".time").show();
  $("#current_label").hide();
  window.timeKeeper = new labelTime(scale);
}

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
    // all magic numbers should be constants like this.MONTH
    scaleBar(this.PIXELS_IN_MONTH,960);
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


model.set('complete', true);

function GoalsView(model) {
  this.model = model;
  this.events {
    'model:change', 'render'
  }
}

GoalsView.prototype.render = function() {

}
