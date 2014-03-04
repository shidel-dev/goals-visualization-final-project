function labelTime(interval){
	this.counter = 0;
	this.interval = interval;
	$('#lower').text("Present");
	if (this.interval === "5") {
		$('#higher').text(this.interval + ' years from today' );	
	} else {
		$('#higher').text('1 ' + this.depluralize() + ' from today' );
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
		$('#lower').text(num + " " + this.interval + ago);
		$('#higher').text((num + 1) + " " + this.interval + ago);
		if (this.counter == -1) {
			$('#lower').text(num + " " + this.depluralize() + ago);
			$('#higher').text("Present");
		};
		if (this.counter == -2) {
			$('#lower').text(num + " " + this.interval + ago);
			$('#higher').text((num - 1) + " " + this.depluralize() + ago);
		};
	} else if (this.counter > 0) {
		$('#lower').text(num + " " + this.interval + from);	
		$('#higher').text((num + 1) + " " + this.interval + from);
		if (this.counter == 1) {
			$('#lower').text(num + " " + this.depluralize() + from);
			$('#higher').text((num + 1) + " " + this.interval + from);
		};
	} else if (this.counter == 0) {
		$('#lower').text("Present");
		$('#higher').text((num + 1) + " " + this.depluralize() + from);
	};
};

labelTime.prototype.renderFive = function(){
	var num = Math.abs(this.counter) * 5
	var ago = "  years ago from today";
	var from = " years from today";

	if (this.counter < 0) {
		$('#lower').text(num + ago);
		$('#higher').text((num + 5) + ago);
		if (this.counter == -1) {
			$('#lower').text(num + ago);
			$('#higher').text("Present");
		};
	} else if (this.counter > 0) {
			$('#lower').text(num + from);	
			$('#higher').text((num + 5) + from);
	} else if (this.counter == 0) {
			$('#lower').text("Present");
			$('#higher').text((num + 5) + from);
	};
}

