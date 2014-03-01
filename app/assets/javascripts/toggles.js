function TimeView(interval) {
  this.$el = $("#num");
  this.moves = 0;
  this.interval = interval;
  // this.currentPosition = person.pos;
  this.currentPosition = 0;
  $("#right-arrow").on("click", function(){
      timePlace.updateView("right");
    });

  $("#left-arrow").on("click", function(){
      timePlace.updateView("left");
  });
}

TimeView.prototype.updateView = function(direction) {
  this.$el.empty();
  var str = this.interval.substring(0, this.interval.length - 1);
  if (direction === "right") {
    this.moves += 1;
    this.currentPosition += 880;
    console.log(this.currentPosition);
    paper.setViewBox(this.currentPosition, 0, 880, 0);
    console.log(person.pos);
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
    this.currentPosition -= 880;
    console.log(this.currentPosition);
    paper.setViewBox(this.currentPosition, 0, 880, 0);
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