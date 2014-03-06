// ------Helpers --------
var helpers = {

  setup: function(width) {
    window.paper = new Raphael(document.getElementById('life_bar'), width, 200);
    window.cover = paper.rect(0, 0, width, 200).attr({fill: "#f1f1f1",stroke: "#CCCCCC"});
  },

  scaleBar: function(width,multi){
    paper.remove();
    this.setup(width);
    $("#life_bar")
      .animate({"width": "0px", "margin-left":"+=440px"}, 500, 'easeOutExpo')
      .animate({"width": "880px","margin-left":"-=440px"}, 500,'easeOutExpo',function(){
        _.each(lifeBar.goals,function(goal){
          goal.render(multi);
        });
        var lifeBarClone = _.clone(lifeBar);
        lifeBar.connections = [];
        _.each(lifeBarClone.connections, function(conn){
          lifeBar.createConnection(conn.to.model.elem, conn.from.model.elem);
        });
        lifeBar.events();
    });
  },

  shiftTime: function(multi){
    $(".arrow").show();
    $(".time").show();
    $("svg").animate({"left":"+=" + multi * 880 + "px"},700,'easeOutExpo', function(){
      cssNum = $("svg").cssNumber("left");
      if (cssNum > 0 ){
        $("#arrow_left").hide();
        $("#past").hide();
        $("#lower").hide();
      } else if (cssNum - 800 <= time.unit * -880){
        $("#arrow_right").hide();
        $("#future").hide();
        $("#higher").hide();
      };
    });
  },

  goalInfo: function(goal,event){
    if ($(".popup").length){
      lifeBar.findGoalById(parseInt($(".popup").data("id"))).set("title",$("#content").html());
      $(".popup").remove();
    }
    _.templateSettings.variable = "v";
    var template = _.template($("script.popupTemplate").html());
    $("#container").append(template(goal.model));
    var popup = $(".popup")
    popup.css({"left" : event.pageX - 220 + "px", "top" : event.pageY - (popup.cssNumber("height") + 10) + "px"})
      .drags({handle:"#head"});
    if ($(".action").length === 3){
      $(".action").css("margin-left", "34px");
    }
    $("#exit").click(this.removeAndSave);
    $('.action').click(this.handleActions.bind(goal));

  },


  handleActions:function(e){
  var goal = this
    if (e.target.id === "complete") {
      goal.model.set("completed", true);
      $("#complete").remove()
      $("#foot").append("<img class='action' id='reflection' src='/icons/glyphicons_087_log_book.png'></img>")
      if ($(".action").length === 3){
        $("#reflection").css("margin-left", "34px").click(helpers.handleActions.bind(this))
      }else{
        $("#reflection").css("margin-left", "21px").click(helpers.handleActions.bind(this))
      }
    } else if (e.target.id === "link" || e.target.id === "sever") {
      helpers.listenForNextGoal(goal.model,e.target.id);
    } else if (e.target.id === "delete"){
      lifeBar.findGoalById($(".popup").data("id")).deleteGoal();
    } else if (e.target.id === "reflection"){
      helpers.goalReflectionDisplay(lifeBar.findGoalById($(".popup").data("id")));
    }
  },

  hoverIn: function(goal, event){
    if (goal.title) {
      _.templateSettings.variable = "v";
      var template = _.template($("script.goalTitleTemplate").html());
      $("#container").append(template(goal));
      var bubble = $('#titleBubble');
      bubble.css({ "left" : event.pageX - 100 + "px", 
                    "top" : event.pageY - (bubble.cssNumber("height") + 25) + "px"})
    };
  },
  
  hoverOut: function(){
    $('#titleBubble').remove();
  }, 

  goalReflectionDisplay: function(goal) {
    _.templateSettings.variable = "v";
    var template = _.template($("script.reflectionTemplate").html());
    $("#container").append(template(goal));
    $(".closeReflection").click(function(){
      goal.set("reflection",$("#reflectionText").val())
      $('#modal').remove()
    })
  },

  removeAndSave: function(){
    lifeBar.findGoalById(parseInt($(".popup").data("id"))).set("title",$("#content").html());
    $(".popup").remove();
  },

  listenForNextGoal: function(oGoal,action){
   $("circle").click(function(e){
      _.each( lifeBar.goals,function(goal){
        if (e.target === goal.elem[0] && e.target !== oGoal.elem[0]){
          if(action === "link"){
            lifeBar.createConnection(oGoal.elem,goal.elem);
            autoSave();
          }else if(action === "sever"){
            lifeBar.removeConnection(oGoal,goal);
          }
          $("circle").unbind("click");
        }
      });
    });
  },

  days_between: function(date1, date2) {
      // The number of milliseconds in one day
      var ONE_DAY = 1000 * 60 * 60 * 24;
      // Convert both dates to milliseconds
      var date1_ms = date1.getTime();
      var date2_ms = date2.getTime();
      // Calculate the difference in milliseconds
      var difference_ms = Math.abs(date1_ms - date2_ms);
      // Convert back to days and return
      return Math.round(difference_ms/ONE_DAY);
  },

  highlightText: function(time_target) {
    $('#time_intervals p').removeClass('selected');
    $(time_target).addClass('selected');
  }

}

// -- Intro Controller--

var IntroController = {

  init:function(){
    this.$el = $("#intro");
    this.events();  
  }, 
  events:function(){
    this.$el.click(this.render);
  },
  render:function(){
    var template = _.template($("script.introTemplate").html());
    $("#container").append(template());
    $(".closeIntro").click(function(){
      $("#modal").remove();
    })
  }

}

// -- extend Raphael to make drawing connection easier.

  Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
      line = obj1;
      obj1 = line.from.model.elem;
      obj2 = line.to.model.elem;
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
        if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i !== 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
          dis.push(dx + dy);
          d[dis[dis.length - 1]] = [i, j];
        }
      }
    }
    if (dis.length === 0) {
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


//---- extend jQuery to return Number instead of string for css values
  jQuery.fn.cssNumber = function(prop){
    var v = parseInt(this.css(prop),10);
    return isNaN(v) ? 0 : v;
  }; 

//----extend jquery to make own draggable function

(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);


jQuery.extend(jQuery.easing, {
  easeOutExpo: function (x, t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },

});


