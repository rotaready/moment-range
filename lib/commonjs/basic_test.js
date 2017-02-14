describe('Test MomentRange.extendMoment', function(){
  const expect = require('expect.js');
  const Moment = require('moment');
  const MomentRange= require('../../dist/moment-range');

  it('should extend moment', function(){
    const moment = MomentRange.extendMoment(Moment);

    const start = new Date(Date.UTC(2017, 2, 11));
    const end = new Date(Date.UTC(2017, 2, 12));
    const range = moment.range(start, end);

    expect(range.diff('days')).to.be(1);
  });
});
