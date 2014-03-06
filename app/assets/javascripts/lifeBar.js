// ----- Setup-----

window.onload = function() {
  helpers.setup(880);
  window.lifeBar = new LifeBar();
  IntroController.init();
  if($("#logged-in").length){
    window.person = new Person($("#birthday").data("birthday"));
    loadLifeData();
  } else {
    window.person = new Person("1990-2-26");
  }
};

// --- PERSON Object -----

function Person(birthdate){
  this.birthdate = _.map(birthdate.split("-"),function(part){
    return parseInt(part);
  });
  this.birthdateObj = new Date(this.birthdate[0],this.birthdate[1], this.birthdate[2]);
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
  var currentLine = $('#current_label');
  currentLine.css("margin-left", this.pos * 870);
};


// ---- LifeBAR Object ------

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

  var that = this;
  _.each(lifeBar.connections, function(conn, i){
      if (that.connected(goal1,goal2,conn)){
        goal2.removeConnectionReference(goal1.id);
        goal1.removeConnectionReference(goal2.id);
        $(conn.line)[0].remove();
        lifeBar.connections.splice(i,1);
     }
   });
  autoSave();
};

LifeBar.prototype.connected = function(goal1,goal2,conn){
  if(conn.from.model.id === goal1.id || conn.to.model.id === goal1.id){
    return goal2.id === conn.from.model.id || goal2.id === conn.to.model.id;
  }
  return false;
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
  var that = this,
      goalOptions;
  paper.canvas.setAttribute('preserveAspectRatio', 'none');
  cover.click(function(e){
    if($(".popup").length){
      helpers.removeAndSave();
    } else {
      if (e.offsetX){
        goalOptions = {id: that.goalCounter, x: e.offsetX, y: e.offsetY};
      }else{
        goalOptions = {id: that.goalCounter, x: e.layerX, y: e.layerY};
      }

      lifeBar.createGoal(goalOptions);
      that.goalCounter++;
    }
    autoSave();
  });
};

LifeBar.prototype.findGoalById = function(id) {
 return _.find(this.goals,function(goal){return goal.id === id;});
};

// ----- Goal Object -----

function Goal(options) {
  this.id = options.id;
  this.x = options.x / time.unit;
  this.y = options.y;
  this.r = 8;
  this.connections = [];
  this.title = options.title;
  this.reflection = options.reflection || ""; 
  this.completed = options.completed || false; 
  this.render(time.unit);
}

Goal.prototype.render = function(multi){
  this.elem = paper.circle(this.x * multi, this.y, this.r);
  var fill = this.completed ? "#048204" : "#0000FF";
  this.elem.attr({fill: fill,stroke:'none'});
  this.elem.model = this;
  this.events();
};

Goal.prototype.events = function(){
  this.elem.drag(move,start,this.end);
  this.elem.mouseup(function(event){
    helpers.hoverOut();
    helpers.goalInfo(this,event);
  });
  this.elem.hover(function(event){ helpers.hoverIn(this.model, event);},
                  function(){ helpers.hoverOut();}); 
};

Goal.prototype.end = function(){
  this.model.x = this.attrs.cx/time.unit;
  this.model.y = this.attrs.cy;
  autoSave();
};

Goal.prototype.set = function(option,value){
  this[option] = value;
  if (option === "completed" && value === true) this.elem.attr({fill:"#048204"});
  autoSave();
};

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


// ----- Goal Drag helpers -----

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


  this.CONSTANTS = { "months":{px:844800,unit:960,period:1},
    "years":{ px:70400,unit:80,period:12}, 
    "5":{px:14080,unit:16,period:60},
    "decades":{px:7040,unit:8, period:120},
    "life":{px:880,unit:1,period:960
    }   
  };
}

Time.prototype.events = function(){
  var units = [["#month","months"],["#year","years"],["#5year","5"] ,["#10year","decades"],["#life","life"]];
  _.each(units, function(unit){
    $(unit[0]).click(function(e){
      time.scale(unit[1]);
      helpers.highlightText(e.target);
      $(".time").show();
      $("#current_label").hide();
      if(unit[1] !== "life"){
        window.timeKeeper = new labelTime(unit[1]);
      }else{
        $(".time").hide();
        $("#current_label").show();
      }
    });
  });

  $("#arrow_left").click(function(){
    if(!$("svg").is(':animated') ) {
      timeKeeper.updateCount("left");
      helpers.shiftTime(1);
    }
  });
  $("#arrow_right").click(function(){
    if(!$("svg").is(':animated') ) {
      timeKeeper.updateCount("right");
      helpers.shiftTime(-1);
    }
  });
};

Time.prototype.scale = function(unit){ 
  var timeDetail = this.CONSTANTS[unit];
  helpers.scaleBar(timeDetail.px,timeDetail.unit);
  this.unit = timeDetail.unit;
  this.period = timeDetail.period;
  if(unit === 'life'){
    $(".arrow").hide();
    person.renderMarkerLine(person.pos * 880);
  }else{
     $(".arrow").show();
    this.shift = Math.round(timeDetail.px * person.pos * -1) + "px";
    $(paper.canvas).css("left",this.shift);
  }
};