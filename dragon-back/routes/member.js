const router = require('express').Router();
const memberfunc = require('../memberfunctions.js');

// Member details object
function Member() {
    this.memberId = '';
    this.memberName = '';
    this.buzName = '';
    this.networkId = 0;
    this.networkName = '';
    this.isMale = true;
    this.onSPR = true;
    for (let n in arguments[0]) { this[n] = arguments[0][n]; }
}
const memberData = [
    new Member({memberId: '0123A0', memberName: 'Almand, Jr., John', buzName: 'Almand, Jr. John',
    networkId: 525425, networkName: 'Almand, Jr., John E.', isMale: true, onSpr: true}),
    new Member({memberId: '0765B0', memberName: 'Barber, Bruce', buzName: 'Barber, Bruce',
    networkId: 525445, networkName: '', isMale: true, onSpr: true}),
    new Member({memberId: '0345B2', memberName: 'Broersma, Peter', buzName: 'Broersma, Peter',
    networkId: 525488, networkName: 'Broersma, Peter', isMale: true, onSpr: false}),
    new Member({memberId: '0112C2', memberName: 'Cosburn, Marla', buzName: 'Cosburn, Marla',
    networkId: 3292473, networkName: 'Cosburn, Marla', isMale: false, onSpr: true}),
    new Member({memberId: '0971H1', memberName: 'Hunter, Judith', buzName: 'Hunter, Judith',
    networkId: 526560, networkName: 'Hunter, Judith', isMale: false, onSpr: true})
];

// Activity details object
function Activity() {
    this.memberId = '';
    this.date = Date;
    this.onTeeSheet = false;
    this.scorePosted = false;
    this.adjustment = false;
    this.reason = '';
    for (let n in arguments[0]) { this[n] = arguments[0][n]; }
}
const memberActivity = [
    new Activity({memberId: '0123A0', date: new Date('May 10, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0971H1', date: new Date('May 10, 2016'), onTeeSheet: true}),
    new Activity({memberId: '0765B0', date: new Date('May 10, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0765B0', date: new Date('June 1, 2016'), onTeeSheet: true, adjustment: true, reason: 'Thunderstorm'}),
    new Activity({memberId: '0112C2', date: new Date('June 1, 2016'), onTeeSheet: true}),
    new Activity({memberId: '0971H1', date: new Date('June 1, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0123A0', date: new Date('June 1, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0112C2', date: new Date('July 24, 2016'), onTeeSheet: true}),
    new Activity({memberId: '0345B2', date: new Date('July 24, 2016'), onTeeSheet: true}),
    new Activity({memberId: '0123A0', date: new Date('July 24, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0112C2', date: new Date('Aug 3, 2016'), onTeeSheet: true}),
    new Activity({memberId: '0765B0', date: new Date('Aug 3, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0971H1', date: new Date('Aug 3, 2016'), onTeeSheet: true, scorePosted: true}),
    new Activity({memberId: '0123A0', date: new Date('Aug 3, 2016'), onTeeSheet: true, adjustment: true, reason: 'Scramble Tournament'})
];

router.get('/activity/:id', (req, res) => {
    let individualMemberActivity = memberfunc.findMemberActivity(memberActivity, req.params.id);
    let memberName = memberfunc.findMemberName(memberData, req.params.id);
    let mySpr = {
        name: memberName,
        activity: individualMemberActivity
    }
    res.json(mySpr);
})

module.exports = router;