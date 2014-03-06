//= require helpers/spec_helper
//= require lifeBar

describe("paper", function(){
	describe("#constructor", function(){
		
		it("creates a paper object", function(){
			var el = $("<div id='life_bar'></div>")[0];
			var paper = new Raphael(el, 880, 200);	
			expect(paper.width).toEqual(880);
		});
	});
});

describe("bar", function(){

	beforeEach(function(){
		var el = $("<div id='life_bar'></div>")[0];
		window.paper = new Raphael(el, 880, 200);	
		window.cover = paper.rect(0,0,880,200).attr({fill:"lightgray",stroke:"none"})
		var bar = new Bar();
	});

	describe("#constructor", function(){

		it("is initialized with a nodeCounter property equal to zero", function(){
			expect(bar.nodeCounter).toEqual(0);
		});

		it("is initialized with an empty array connections property ", function(){
			expect(bar.connections.length).toEqual(0);
		});

		it("is initialized with an empty array nodes property", function(){
			expect(bar.nodes.length).toEqual(0);
		});

		it("it has an events listener to create a node", function(){
			spyOn(bar.events)
			$("body").append(el)
			$("#life_bar").trigger("click")
			expect(post.destroy).toHaveBeenCalled();
		});
	});
});

describe("person", function(){
	describe("#constructor", function(){

		it("creates a person object", function(){

			var p = new Person("07-03-1987");

			expect(p.hasOwnProperty("birthdate")).toBe(true);
		})
	})
})
