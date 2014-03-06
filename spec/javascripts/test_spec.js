describe("name", function() {
  describe("#constructor", function() {
    it("has a name of Sara", function() {
      var sara = new name();
      expect(sara.hasOwnProperty('name')).toBe(true);
    });
  });
})