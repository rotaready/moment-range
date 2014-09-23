should = require 'should'
moment = require '../lib/moment-range'

describe 'Moment', ->
  dr  = moment.range new Date Date.UTC(2011, 2, 5), new Date Date.UTC(2011, 5, 5)
  m_1 = moment('2011-04-15', 'YYYY-MM-DD')
  m_2 = moment('2012-12-25', 'YYYY-MM-DD')
  m_start = moment('2011-03-05', 'YYYY-MM-DD')
  m_end   = moment('2011-06-05', 'YYYY-MM-DD')

  describe '#range()', ->
    it 'should return a DateRange'

    it 'should support string units like `year`, `month`, `week`, `day`, `minute`, `second`, etc...', ->
      dr = m_1.range('year')
      dr.start.valueOf().should.equal moment(m_1).startOf('year').valueOf()
      dr.end.valueOf().should.equal moment(m_1).endOf('year').valueOf()

  describe '#within()', ->
    it 'should determine if the current moment is within a given range', ->
      m_1.within(dr).should.be.true
      m_2.within(dr).should.be.false

    it 'should consider the edges to be within the range', ->
      m_start.within(dr).should.be.true
      m_end.within(dr).should.be.true

describe 'DateRange', ->
  d_1 = new Date Date.UTC(2011, 2, 5)
  d_2 = new Date Date.UTC(2011, 5, 5)
  d_3 = new Date Date.UTC(2011, 4, 9)
  d_4 = new Date Date.UTC(1988, 0, 1)
  m_1 = moment.utc('06-05-1996', 'MM-DD-YYYY')
  m_2 = moment.utc('11-05-1996', 'MM-DD-YYYY')
  m_3 = moment.utc('08-12-1996', 'MM-DD-YYYY')
  m_4 = moment.utc('01-01-2012', 'MM-DD-YYYY')
  s_start = '08-12-1996'
  s_end = '01-01-2012'

  describe 'constructor', ->
    it 'should allow initialization with date string', ->
      dr = moment.range(s_start, s_end)
      moment.isMoment(dr.start).should.be.true
      moment.isMoment(dr.end).should.be.true
      dr.start.should.equal moment(s_start)
      dr.end.should.equal moment(s_end)

    it 'should allow initialization with Date object', ->
      dr = moment.range(d_1, d_2)
      moment.isMoment(dr.start).should.be.true
      moment.isMoment(dr.end).should.be.true
      dr.start.should.equal d_1
      dr.end.should.equal d_2

    it 'should allow initialization with Moment object', ->
      dr = moment.range(m_1, m_2)
      moment.isMoment(dr.start).should.be.true
      moment.isMoment(dr.end).should.be.true
      dr.start.should.equal m_1
      dr.end.should.equal m_2

  describe '#by()', ->
    it 'should iterate correctly by range', ->
      acc = []
      d1  = new Date Date.UTC(2012, 2, 1)
      d2  = new Date Date.UTC(2012, 2, 5)
      dr1 = moment.range(d1, d2)
      dr2 = 1000 * 60 * 60 * 24 # one day

      dr1.by dr2, (m) -> acc.push(m)

      acc.length.should.eql 5
      acc[0].utc().date().should.eql 1
      acc[1].utc().date().should.eql 2
      acc[2].utc().date().should.eql 3
      acc[3].utc().date().should.eql 4
      acc[4].utc().date().should.eql 5

    it 'should iterate correctly by duration', ->
      acc = []
      d1 = new Date Date.UTC(2014, 9, 6, 0, 0)
      d2 = new Date Date.UTC(2014, 9, 6, 23, 59)
      dr1 = moment.range(d1, d2)
      dr2 = moment.duration(15, 'minutes')

      dr1.by dr2, (m) -> acc.push m

      acc.length.should.eql 96
      acc[0].minute().should.eql 0
      acc[95].minute().should.eql 45

    it 'should iterate correctly by shorthand string', ->
      acc = []
      d1  = new Date Date.UTC(2012, 2, 1)
      d2  = new Date Date.UTC(2012, 2, 5)
      dr1 = moment.range(d1, d2)
      dr2 = 'days'

      dr1.by dr2, (m) -> acc.push(m)

      acc.length.should.eql 5
      acc[0].utc().date().should.eql 1
      acc[1].utc().date().should.eql 2
      acc[2].utc().date().should.eql 3
      acc[3].utc().date().should.eql 4
      acc[4].utc().date().should.eql 5

    it 'should iterate correctly by year over a Date-constructed range when leap years are involved', ->
      acc = []
      d1  = new Date Date.UTC(2011, 1, 1)
      d2  = new Date Date.UTC(2013, 1, 1)
      dr1 = moment.range(d1, d2)
      dr2 = 'years'

      dr1.by dr2, (m) -> acc.push(m.utc().year())

      acc.should.eql [2011, 2012, 2013]

    it 'should iterate correctly by year over a moment()-constructed range when leap years are involved', ->
      acc = []
      dr1 = moment.range(moment('2011', 'YYYY'), moment('2013', 'YYYY'))
      dr2 = 'years'

      dr1.by dr2, (m) -> acc.push(m.utc().year())

      acc.should.eql [2011, 2012, 2013]

    it 'should iterate correctly by month over a moment()-constructed range when leap years are involved', ->
      acc = []
      dr1 = moment.range(moment.utc('2012-01', 'YYYY-MM'), moment.utc('2012-03', 'YYYY-MM'))
      dr2 = 'months'

      dr1.by dr2, (m) -> acc.push(m.utc().format('YYYY-MM'))

      acc.should.eql ['2012-01', '2012-02', '2012-03']

    it 'should iterate correctly by month over a Date-contstructed range when leap years are involved', ->
      acc = []
      d1  = new Date Date.UTC(2012, 0)
      d2  = new Date Date.UTC(2012, 2)
      dr1 = moment.range(d1, d2) # Don't forget, months are zero-indexed
      dr2 = 'months'

      dr1.by dr2, (m) -> acc.push m.utc().format('YYYY-MM')

      acc.should.eql ['2012-01', '2012-02', '2012-03']

  describe '#contains()', ->
    it 'should work with Date objects', ->
      dr = moment.range(d_1, d_2)
      dr.contains(d_3).should.be.true
      dr.contains(d_4).should.be.false

    it 'should work with Moment objects', ->
      dr = moment.range(m_1, m_2)
      dr.contains(m_3).should.be.true
      dr.contains(m_4).should.be.false

    it 'should work with DateRange objects', ->
      dr1 = moment.range(m_1, m_4)
      dr2 = moment.range(m_3, m_2)
      dr1.contains(dr2).should.be.true
      dr2.contains(dr1).should.be.false

    it 'should be an inclusive comparison', ->
      dr1 = moment.range(m_1, m_4)
      dr1.contains(m_1).should.be.true
      dr1.contains(m_4).should.be.true
      dr1.contains(dr1).should.be.true

  describe '#overlaps()', ->
    it 'should work with DateRange objects', ->
      dr_1 = moment.range(m_1, m_2)
      dr_2 = moment.range(m_3, m_4)
      dr_3 = moment.range(m_2, m_4)
      dr_4 = moment.range(m_1, m_3)

      dr_1.overlaps(dr_2).should.be.true
      dr_1.overlaps(dr_3).should.be.false
      dr_4.overlaps(dr_3).should.be.false

  describe '#intersect()', ->
    d_5 = new Date Date.UTC(2011, 2, 2)
    d_6 = new Date Date.UTC(2011, 4, 4)
    d_7 = new Date Date.UTC(2011, 6, 6)
    d_8 = new Date Date.UTC(2011, 8, 8)

    it 'should work with [---{==]---} overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_7)
      dr_2 = moment.range(d_6, d_8)
      dr_1.intersect(dr_2).isSame(moment.range(d_6, d_7)).should.be.true

    it 'should work with {---[==}---] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_8)
      dr_2 = moment.range(d_5, d_7)
      dr_1.intersect(dr_2).isSame(moment.range(d_6, d_7)).should.be.true

    it 'should work with [{===]---} overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_6)
      dr_2 = moment.range(d_5, d_7)
      dr_1.intersect(dr_2).isSame(moment.range(d_5, d_6)).should.be.true

    it 'should work with {[===}---] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_7)
      dr_2 = moment.range(d_5, d_6)
      dr_1.intersect(dr_2).isSame(moment.range(d_5, d_6)).should.be.true

    it 'should work with [---{===]} overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_7)
      dr_2 = moment.range(d_6, d_7)
      dr_1.intersect(dr_2).isSame(moment.range(d_6, d_7)).should.be.true

    it 'should work with {---[===}] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_7)
      dr_2 = moment.range(d_5, d_7)
      dr_1.intersect(dr_2).isSame(moment.range(d_6, d_7)).should.be.true

    it 'should work with [---] {---} overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_6)
      dr_2 = moment.range(d_7, d_8)
      should.strictEqual(dr_1.intersect(dr_2), null)

    it 'should work with {---} [---] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_7, d_8)
      dr_2 = moment.range(d_5, d_6)
      should.strictEqual(dr_1.intersect(dr_2), null)

    it 'should work with [---]{---} overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_6)
      dr_2 = moment.range(d_6, d_7)
      should.strictEqual(dr_1.intersect(dr_2), null)

    it 'should work with {---}[---] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_7)
      dr_2 = moment.range(d_5, d_6)
      should.strictEqual(dr_1.intersect(dr_2), null)

    it 'should work with {--[===]--} overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_7)
      dr_2 = moment.range(d_5, d_8)
      dr_1.intersect(dr_2).isSame(dr_1).should.be.true

    it 'should work with [--{===}--] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_8)
      dr_2 = moment.range(d_6, d_7)
      dr_1.intersect(dr_2).isSame(dr_2).should.be.true

    it 'should work with [{===}] overlaps where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_6)
      dr_2 = moment.range(d_5, d_6)
      dr_1.intersect(dr_2).isSame(dr_2).should.be.true

  describe '#subtract()', ->
    d_5 = new Date Date.UTC(2011, 2, 2)
    d_6 = new Date Date.UTC(2011, 4, 4)
    d_7 = new Date Date.UTC(2011, 6, 6)
    d_8 = new Date Date.UTC(2011, 8, 8)

    it 'should turn [--{==}--] into (--)  (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_8)
      dr_2 = moment.range(d_6, d_7)
      dr_1.subtract(dr_2).should.eql [moment.range(d_5, d_6), moment.range(d_7, d_8)]

    it 'should turn {--[==]--} into () where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_7)
      dr_2 = moment.range(d_5, d_8)
      dr_1.subtract(dr_2).should.eql []

    it 'should turn {[==]} into () where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_6)
      dr_2 = moment.range(d_5, d_6)
      dr_1.subtract(dr_2).should.eql []

    it 'should turn [--{==]--} into (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_7)
      dr_2 = moment.range(d_6, d_8)
      dr_1.subtract(dr_2).should.eql [moment.range(d_5, d_6)]

    it 'should turn [--{==]} into (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_7)
      dr_2 = moment.range(d_6, d_7)
      dr_1.subtract(dr_2).should.eql [moment.range(d_5, d_6)]

    it 'should turn {--[==}--] into (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_8)
      dr_2 = moment.range(d_5, d_7)
      dr_1.subtract(dr_2).should.eql [moment.range(d_7, d_8)]

    it 'should turn {[==}--] into (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_6, d_8)
      dr_2 = moment.range(d_6, d_7)
      dr_1.subtract(dr_2).should.eql [moment.range(d_7, d_8)]

    it 'should turn [--] {--} into (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_5, d_6)
      dr_2 = moment.range(d_7, d_8)
      dr_1.subtract(dr_2).should.eql [dr_1]

    it 'should turn {--} [--] into (--) where (a=[], b={})', ->
      dr_1 = moment.range(d_7, d_8)
      dr_2 = moment.range(d_5, d_6)
      dr_1.subtract(dr_2).should.eql [dr_1]

  describe '#isSame()', ->
    it 'should return true if the start and end of both DateRange objects equal', ->
      dr_1 = moment.range(d_1, d_2)
      dr_2 = moment.range(d_1, d_2)
      dr_1.isSame(dr_2).should.be.true

    it 'should return false if the starts differ between objects', ->
      dr_1 = moment.range(d_1, d_3)
      dr_2 = moment.range(d_2, d_3)
      dr_1.isSame(dr_2).should.be.false

    it 'should return false if the ends differ between objects', ->
      dr_1 = moment.range(d_1, d_2)
      dr_2 = moment.range(d_1, d_3)
      dr_1.isSame(dr_2).should.be.false

  describe '#valueOf()', ->
    it 'should be the value of the range in milliseconds', ->
      dr = moment.range(d_1, d_2)
      dr.valueOf().should.eql d_2.getTime() - d_1.getTime()

    it 'should correctly coerce to a number', ->
      dr_1 = moment.range(d_4, d_2)
      dr_2 = moment.range(d_3, d_2)
      (dr_1 > dr_2).should.be.true

  describe '#toDate()', ->
    it 'should be return a array like [dateObject, dateObject]', ->
      dr = moment.range(d_1, d_2)
      dr_todate = dr.toDate()
      dr_todate.length.should.eql 2
      dr_todate[0].valueOf().should.eql d_1.valueOf()
      dr_todate[1].valueOf().should.eql d_2.valueOf()

  describe '#diff()', ->
    it 'should use momentjs’ diff method', ->
      dr = moment.range(d_1, d_2)
      dr.diff('months').should.equal 3
      dr.diff('days').should.equal 92
      dr.diff().should.equal 7948800000
