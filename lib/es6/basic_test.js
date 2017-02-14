import Moment from 'moment';
import { extendMoment } from '../../dist/moment-range';
import expect from 'expect.js';

describe('Test extendMoment', function(){
  it('should extend moment', function(){
    const moment = extendMoment(Moment);

    const start = new Date(Date.UTC(2017, 2, 11));
    const end = new Date(Date.UTC(2017, 2, 12));
    const range = moment.range(start, end);

    expect(range.diff('days')).to.be(1);
  });
});
