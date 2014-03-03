function labelTime(interval){
	this.counter = 0;
	this.interval = interval;
	$('#lower').html("&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;Present");
	if (this.interval === "5") {
		$('#higher').html(this.interval + ' years from today' );	
	} else {
		$('#higher').html('1 ' + this.depluralize() + ' from today' );
	};
};

labelTime.prototype.updateCount = function(direction){
	if (direction == "right") {
		this.counter += 1;
		(this.interval === "5") ? this.renderFive() : this.renderLabel();
	} else if (direction == "left") {
		this.counter -= 1;
		(this.interval === "5") ? this.renderFive() : this.renderLabel();
	}
}

labelTime.prototype.depluralize = function() {
	return this.interval.substring(0,this.interval.length - 1)
}

labelTime.prototype.renderLabel = function(){
	var num = Math.abs(this.counter)
	var ago = " ago from today";
	var from = " from today";

	if (this.counter < 0) {
		$('#lower').html(num + " " + this.interval + ago);
		$('#higher').html((num + 1) + " " + this.interval + ago);
		if (this.counter == -1) {
			$('#lower').html(num + " " + this.depluralize() + ago);
			$('#higher').html("&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;Present");
		};
		if (this.counter == -2) {
			$('#lower').html(num + " " + this.interval + ago);
			$('#higher').html((num - 1) + " " + this.depluralize() + ago);
		};
	} else if (this.counter > 0) {
		$('#lower').html(num + " " + this.interval + from);	
		$('#higher').html((num + 1) + " " + this.interval + from);
		if (this.counter == 1) {
			$('#lower').html(num + " " + this.depluralize() + from);
			$('#higher').html((num + 1) + " " + this.interval + from);
		};
	} else if (this.counter == 0) {
		$('#lower').html("&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;Present");
		$('#higher').html((num + 1) + " " + this.depluralize() + from);
	};
};

labelTime.prototype.renderFive = function(){
	var num = Math.abs(this.counter) * 5
	var ago = "  years ago from today";
	var from = " years from today";

	if (this.counter < 0) {
		$('#lower').html(num + ago);
		$('#higher').html((num + 5) + ago);
		if (this.counter == -1) {
			$('#lower').html(num + ago);
			$('#higher').html("&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;Present");
		};
	} else if (this.counter > 0) {
			$('#lower').html(num + from);	
			$('#higher').html((num + 5) + from);
	} else if (this.counter == 0) {
			$('#lower').html("&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;Present");
			$('#higher').html((num + 5) + from);
	};
}

