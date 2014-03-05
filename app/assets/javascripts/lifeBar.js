// ----- Setup-----
// $(window).unload(function(){
//     saveLifeData();
// });

window.onload = function() {
  helpers.setup(880)
  window.lifeBar = new LifeBar();
  window.person = new Person("26-2-1990");
  new IntroController();
  if($("#logged-in").length){
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

  var today  = new Date(),
      year = today.getFullYear(),
      month = today.getMonth(),
      day = today.getDate(),
      end = _.clone(this.birthdate);

      end[2] = end[2] + 80;
      window.time = new Time(day,month,year);
      time.unit = 1;
      time.period = 960;
      return helpers.days_between(today, this.birthdateObj) / 29200;
};

Person.prototype.renderMarkerLine = function(position){
  var marker = paper.path("M" + position + " 0 l 0 200");
  marker.attr({stroke: 'black', 'stroke-width': 1});
  var currentLine = $('#current_label')
  currentLine.css("margin-left", this.pos * 870)
};


// ---- BAR Object ------

function LifeBar(){
  this.goals = [];
  this.connections = [];
  this.events();
  this.goalCounter = 0;
  // assign this.goalCounter in import/populate function
}

LifeBar.prototype.createGoal = function(goalOptions){
  $("circle").unbind("click");
  this.goals.push(new Goal(goalOptions));
  $(".popup").remove();

};

LifeBar.prototype.createConnection = function(goal1, goal2){
  var connection = paper.connection(goal1, goal2, "#00756F");
  this.connections.push(connection);
  goal1.model.connections.push(connection);
  goal2.model.connections.push(connection);
};

LifeBar.prototype.removeConnection = function(goal1,goal2){
  _.each(lifeBar.connections, function(conn, i){
   if(conn.from.model.id === goal1.id || conn.to.model.id === goal1.id){
     if(goal2.id === conn.from.model.id || goal2.id === conn.to.model.id){
        goal2.removeConnectionReference(goal1.id);
        goal1.removeConnectionReference(goal2.id);
        $(conn.line)[0].remove();
        lifeBar.connections.splice(i,1);
     }
   }
  });
  autoSave();
};
LifeBar.prototype.deleteGoal = function(goalToBeDeleted){
  _.each(this.goals,function(goal,i){
    if(goal.id === goalToBeDeleted.id){

      goalToBeDeleted.elem.remove();
      lifeBar.goals.splice(i,1);
    }
  });
  $(".popup").remove();
};


LifeBar.prototype.events = function(){
  var that = this;
  paper.canvas.setAttribute('preserveAspectRatio', 'none');
  cover.click(function(e){
    if($(".popup").length){
      helpers.removeAndSave()
    } else {
      if (e.offsetX){
        var goalOptions = {id: that.goalCounter, x: e.offsetX, y: e.offsetY};
      }else{
        var goalOptions = {id: that.goalCounter, x: e.layerX, y: e.layerY};
      }
      
      lifeBar.createGoal(goalOptions);
      that.goalCounter++;
    }
    autoSave();
  });
};

LifeBar.prototype.findGoalById = function(id) {
 return _.find(this.goals,function(goal){return goal.id === id});
};

// ----- NODE Object -----

function Goal(options) {
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

Goal.prototype.render = function(multi){
  this.elem = paper.circle(this.x *  multi, this.y, this.r);
  var fill = this.completed ? "#048204" : "#0000FF";
  this.elem.attr({fill: fill,stroke:'none'});
  this.elem.model = this;
  this.events();
};

Goal.prototype.events = function(){
  this.elem.drag(move,start,this.end);
  this.elem.mouseup(function(event){
    helpers.goalInfo(this,event);
  });
};

Goal.prototype.end = function(){
  this.model.x = this.attrs.cx/time.unit;
  this.model.y = this.attrs.cy;
  autoSave();
};

Goal.prototype.complete = function(){
  this.completed = true;
  this.elem.attr({fill:"#048204"});
  autoSave();
};

Goal.prototype.saveText = function(text){
  this.title = text;
  autoSave();
};

Goal.prototype.saveReflection = function(text){
  this.reflection = text;
  autoSave();
}

Goal.prototype.deleteGoal = function(){
  _.each(_.clone(this.connections), function(connection){
    lifeBar.removeConnection(connection.to.model, connection.from.model);
  });
  lifeBar.deleteGoal(this);
  autoSave();
};

Goal.prototype.removeConnectionReference = function(id){
  var that = this;
  _.each(this.connections,function(connection,i){
    if(connection.to.model.id === id || connection.from.model.id === id){
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
  for (var i = lifeBar.connections.length; i--;) {
    paper.connection(lifeBar.connections[i]);
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
    helpers.highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("months")
  });

  $("#year").click(function(e){
    time.scale("year");
    helpers.highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("years")
  });
  $("#5year").click(function(e){
    time.scale("5year");
    helpers.highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("5")
  });
  $("#10year").click(function(e){
    time.scale("10year");
    helpers.highlightText(e.target);
    $(".time").show();
    $("#current_label").hide();
    window.timeKeeper = new labelTime("decades")
  });
  $("#life").click(function(e){
    time.scale("life");
    helpers.highlightText(e.target);
    $(".time").hide();
    $("#current_label").show();
  })
  $("#arrow_left").click(function(){
    if(!$("svg").is(':animated') ) {
      timeKeeper.updateCount("left");
      helpers.shiftTime(1);
    };
  })
  $("#arrow_right").click(function(){
    if(!$("svg").is(':animated') ) {
      timeKeeper.updateCount("right");
      helpers.shiftTime(-1);
    };
  });
  $("#arrow_left").click(function(){
    if(!$("svg").is(':animated')){helpers.shiftTime(1);}
  });
  $("#arrow_right").click(function(){
    if(!$("svg").is(':animated') ) {helpers.shiftTime(-1);}
  });
};

Time.prototype.scale = function(unit){
  if(unit === "month"){
    helpers.scaleBar(844800,960);
    this.unit = 960;
    this.period = 1;
    $(".arrow").show();
    this.shift = Math.round(844800 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if(unit === "year"){
    helpers.scaleBar(70400,80);
    this.unit = 80;
    this.period = 12;
    $(".arrow").show();
    this.shift = Math.round(70400 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if(unit === "5year"){
    helpers.scaleBar(14080,16);
    this.unit = 16;
    this.period = 60;
    $(".arrow").show();
    this.shift = Math.round(14080 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if(unit === "10year"){
    helpers.scaleBar(7040,8);
    this.unit = 8;
    this.period = 120;
    $(".arrow").show();
    this.shift = Math.round(7040 * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }else if (unit === "life"){
    helpers.scaleBar(880,1);
    this.unit = 1;
    this.period = 960;
    $(".arrow").hide();
    person.renderMarkerLine(person.pos * 880);
  }
};
