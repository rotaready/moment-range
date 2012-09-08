require "should"
moment = require "../lib/moment-range"

describe "Moment", ->
  dr  = moment().range new Date(2011, 2, 5), new Date(2011, 5, 5)
  m_1 = moment("2011-04-15", "YYYY-MM-DD")
  m_2 = moment("2012-12-25", "YYYY-MM-DD")

  describe "#range()", ->
    it "should return a DateRange"

  describe "#within()", ->
    it "should determine if the current moment is within a given range", ->
      m_1.within(dr).should.be.true
      m_2.within(dr).should.be.false

describe "DateRange", ->
  d_1 = new Date 2011, 2, 5
  d_2 = new Date 2011, 5, 5
  d_3 = new Date 2011, 4, 9
  d_4 = new Date 1988, 0, 1
  m_1 = moment("06-05-1996", "MM-DD-YYYY")
  m_2 = moment("11-05-1996", "MM-DD-YYYY")
  m_3 = moment("08-12-1996", "MM-DD-YYYY")
  m_4 = moment("01-01-2012", "MM-DD-YYYY")

  describe "#by()", ->
    it "should iterate correctly by range", ->
      acc = []
      dr1 = moment().range(new Date(2012, 2, 1), new Date(2012, 2, 5))
      dr2 = 1000 * 60 * 60 * 24

      dr1.by dr2, (m) -> acc.push m

      acc.length.should.eql 5
      acc[0].date().should.eql 1
      acc[1].date().should.eql 2
      acc[2].date().should.eql 3
      acc[3].date().should.eql 4
      acc[4].date().should.eql 5

  describe "#contains()", ->
    it "should work with Date objects", ->
      dr = moment().range(d_1, d_2)
      dr.contains(d_3).should.be.true
      dr.contains(d_4).should.be.false

    it "should work with Moment objects", ->
      dr = moment().range(m_1, m_2)
      dr.contains(m_3).should.be.true
      dr.contains(m_4).should.be.false

  describe "#valueOf()", ->
    it "should be the value of the range in milliseconds", ->
      dr = moment().range(d_1, d_2)
      dr.valueOf().should.eql d_2.getTime() - d_1.getTime()

    it "should correctly coerce to a number", ->
      dr_1 = moment().range(d_4, d_2)
      dr_2 = moment().range(d_3, d_2)
      (dr_1 > dr_2).should.be.true

