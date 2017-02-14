describe('Test Browser functions', function() {
  describe('Test MomentRange.extendMoment', function() {
    it('should extend moment', function() {
      MomentRange.extendMoment(moment);

      const start = new Date(Date.UTC(2017, 2, 11));
      const end = new Date(Date.UTC(2017, 2, 12));
      const range = moment.range(start, end);

      expect(range.diff('days')).to.be(1);
    });
  });
});
