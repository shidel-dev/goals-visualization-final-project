// ----- Setup-----

// window.onload = function() {
$( document ).ready(function(){
	  setup(880)
    window.bar = new Bar();
    window.person = new Person("26-2-1990");
    if ($("#login")) {
        loadLifeData();
    }
 });