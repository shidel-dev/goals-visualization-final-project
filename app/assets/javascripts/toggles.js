function TimeView(interval) {
  this.$el = $("#num");
  this.moves = 0;
  this.interval = interval;
  $("#right-arrow").on("click", function(interval){
      person.updatePosition("right");
      timePlace.updateView("right");
    });

  $("#left-arrow").on("click", function(interval){
      person.updatePosition("left");
      timePlace.updateView("left");
  });
}

TimeView.prototype.updateView = function(direction) {
  this.$el.empty();
  var str = this.interval.substring(0, this.interval.length - 1);
  if (direction === "right") {
    this.moves += 1;
    if (this.moves === 0) {
      this.$el.empty();
      this.$el.append("current " + str + " from today");
    } else if (this.moves < 0) {
      this.$el.empty();
      this.$el.append(Math.abs(this.moves) + " " + this.interval + " ago from today");
    } else if (this.moves > 0) {
      this.$el.append(Math.abs(this.moves) + " " + this.interval + " from today");
    }
  } else if (direction === "left") {
    this.moves -= 1;
    if (this.moves === 0) {
      this.$el.empty();
      this.$el.append("current " + str + " from today");
    } else if (this.moves < 0) {
      this.$el.empty();
      this.$el.append(Math.abs(this.moves) + " " + this.interval + " ago from today");
    } else if (this.moves > 0) {
      this.$el.append(Math.abs(this.moves) + " " + this.interval + " from today");
    }
  }
}