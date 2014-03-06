//= require helpers/spec_helper
//= require timeLabel


describe("labelTime", function(){

  beforeEach(function(){
    var intervals = ["months", "years", "5", "decades"];
    var randomized = intervals[Math.floor(Math.random() * intervals.length)]
    var time = new labelTime(randomized);
  });

  describe("#constructor", function(){

    it("initialized with arrow counter equal to zero", function(){
      expect(time.counter).toEqual(0);
    });

    it("initialized with correct interval value", function(){
      expect(time.interval).toEqual(randomized);
    });

    // it("lower range always show 'Present' when initial time interval loads", function(){
    //   var time = new labelTime("decade");
    //   var text = $('#lower').text();
    //   expect(text).toEqual("Present");
    // });
  });

  describe("clicking right arrow", function(){

  });
});

