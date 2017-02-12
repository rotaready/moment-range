describe('Test DateRange.extends', function() {
  it('should extend moment-js', function() {
    // window['moment-range'].extendMoment(moment);
    DateRange.extendMoment(moment);

    const start = new Date(Date.UTC(2017, 2, 11));
    const end = new Date(Date.UTC(2017, 2, 12));
    const range = moment.range(start, end);

    expect(range.diff('days')).to.be(1);
  });
});