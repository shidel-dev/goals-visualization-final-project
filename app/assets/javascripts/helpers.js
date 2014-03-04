// ------Helpers --------

function setup(width) {
  window.paper = new Raphael(document.getElementById('life_bar'), width, 200);
  window.cover = paper.rect(0, 0, width, 200).attr({fill: "#f1f1f1",stroke: "#CCCCCC"});
}

Raphael.fn.connection = function (obj1, obj2, line, bg) {
  if (obj1.line && obj1.from && obj1.to) {
    line = obj1;
    obj1 = line.from.ref.elem;
    obj2 = line.to.ref.elem;
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

function scaleBar(width,multi){
  paper.remove();
  setup(width);
  $("#life_bar")
    .animate({"width": "0px", "margin-left":"+=440px"}, 500)
    .animate({"width": "880px","margin-left":"-=440px"}, 500,function(){
      _.each(bar.nodes,function(node){
        node.render(multi);
      });
      var barClone = _.clone(bar);
      bar.connections = [];
      _.each(barClone.connections, function(conn){
        bar.createConnection(conn.to.ref.elem, conn.from.ref.elem);
      });
      bar.events();
  });
}

function shiftTime(multi){
  $(".arrow").show();
  $(".time").show();
  $("svg").animate({"left":"+=" + multi * 880 + "px"}, function(){
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
}

jQuery.fn.cssNumber = function(prop){
  var v = parseInt(this.css(prop),10);
  return isNaN(v) ? 0 : v;
};



function nodeInfo(node,event){
  if ($(".popup").length){
    bar.findNodeById(parseInt($(".popup").data("id"))).saveText($("#content").html());
    $(".popup").remove();
  }
   $(".popup").remove();
  _.templateSettings.variable = "v";
  var template = _.template($("script.popupTemplate").html());
  $("#container").append(template(node.ref));
  $(".popup").css({"left" : event.pageX - 210 + "px", "top" : event.pageY - 195 + "px"})
    .drags({handle:"#head"});
  if ($(".action").length === 3){
    $(".action").css("margin-left", "34px");
  }
  $("#exit").click(remove);
  $('.action').click(handleActions);
  function handleActions(e){
    if (e.target.id === "complete") {
      node.ref.complete();
      $("#complete").remove()
      $("#foot").append("<img class='action' id='reflection' src='/icons/glyphicons_087_log_book.png'></img>")
        $("#reflection").css("margin-left", "34px").click(handleActions)
    } else if (e.target.id === "link") {
      listenForNextNode(node.ref,"link");
    } else if (e.target.id === "sever") {
      listenForNextNode(node.ref,"sever");
    } else if (e.target.id === "delete"){
      bar.findNodeById($(".popup").data("id")).deleteNode();
    } else if (e.target.id === "reflection"){
      nodeReflectionDisplay(bar.findNodeById($(".popup").data("id")));
    }
  }
}


function nodeReflectionDisplay(node) {
  _.templateSettings.variable = "v";
  var template = _.template($("script.reflectionTemplate").html());
  $("#container").append(template(node));
  $(".closeReflection").click(function(){
    node.saveReflection($("#reflectionText").val())
    $('#modal').remove()
  })
}

function remove(){
  bar.findNodeById(parseInt($(".popup").data("id"))).saveText($("#content").html());
  $(".popup").remove();
}

function listenForNextNode(oNode,action){
 $("circle").click(function(e){
    _.each( bar.nodes,function(node){
      if (e.target === node.elem[0] && e.target !== oNode.elem[0]){
        if(action === "link"){
          bar.createConnection(oNode.elem,node.elem);
          autoSave();
        }else if(action === "sever"){
          bar.removeConnection(oNode,node);
        }
        $("circle").unbind("click");
      }
    });
  });
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);

}

function highlightText(time_target) {
  $('#time_intervals p').removeClass('selected');
  $(time_target).addClass('selected');
}

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
