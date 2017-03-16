const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
// app.use(express.static(__dirname + './../dragon/build'));
app.use(express.static(__dirname + '/'));

app.get('/test', (req, res) => {
    res.send('Its working!...found endpoint');
});

app.get('/data', function(req, res){
    let scoreData = readScores(inputScoreFile, inputScoreFileSheetName);
    let spr = addScores(scoreData, HOMECOURSE);
    let newSpr = fillColumnData(spr);  // Needs to be updated with real tee sheet and adjustment data
    res.json(newSpr);
});

app.get('/memberactivity/:id', function(req, res){
    let individualMemberActivity = findMemberActivity(memberActivity, req.params.id);
    let memberName = findMemberName(memberData, req.params.id);
    let mySpr = {
        name: memberName,
        activity: individualMemberActivity
    }
    res.json(mySpr);
});

app.listen(PORT, () => {
    console.log('Server running. Listening on Port:%s', PORT)
    console.log('Stop with Ctrl+C')
})

// --------------- app.js code ----------------------

var XLSX = require('xlsx');

const HOMECOURSE = 'St. George\'s Golf & Country Club';
const inputScoreFile = './dragon-back/DataFiles/SourceFiles/scores_test.xlsx';
const inputScoreFileSheetName = 'NGN_General_Scores_Posted_By_Da';
const outputSPRFile = './dragon-back/DataFiles/OutputFiles/testFileOut3.xlsx';
const outputSPRFileSheetName = 'Score Posting Report';

// Summary object to be used to accumulate data for the Score Posting Report
function Summary(id, name) {
    this.id = id;
    this.name = name;
    this.teeSheetAppearances = 0;
    this.scoresPosted = 0;
    this.adjustments = 0;
    this.percentage = 100;
    this.onSPR = true;
}

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

// Translates cell addresses (eg. from {c:0, r:0} to 'A1')
function mapCell (C,R) {
    return XLSX.utils.encode_cell({c: C, r: R})
}

// Read in score data workbook. Returns scoreData spreadsheet object
function readScores (scoreFile, sheetName) {
    const scoreWorkbook = XLSX.readFile(scoreFile, {cellFormula: false, cellHTML: false});
    let scoreData = scoreWorkbook.Sheets[sheetName];
    return scoreData;
}

// Function that takes in scores-entered data and returns consolidated data by golfer
function addScores (scoreData, homeCourse) {

    let spr = [];
    let lastRow = XLSX.utils.decode_range(scoreData['!ref']).e.r;

    for (let R = 1; R <= lastRow; R++) {
        if ((scoreData[mapCell(9,R)].v === homeCourse) && (!scoreData[mapCell(7,R)].v.includes('C'))) {
            let existingGolfer = false;
            for (let i = 0; ((i < spr.length) && (!existingGolfer)); i++) {
                if (scoreData[mapCell(0,R)].v === spr[i].id) {
                    spr[i].scoresPosted++;
                    existingGolfer = true;
                }
            }
            if (!existingGolfer) {
                spr.push(new Summary(scoreData[mapCell(0,R)].v, scoreData[mapCell(2,R)].v));
                spr[spr.length - 1].scoresPosted++;
            }
        }
    }
    return spr;
}

// Function that finds the name of a member from their membership ID
function findMemberName (memberData, memberId) {
    let memberName = '';
    for (let i = 0; i < memberData.length; i++) {
        if (memberData[i].memberId.toLowerCase() === memberId.toLowerCase()) {
            memberName = memberData[i].buzName;
            i = memberData.length;
        }
    }
    return memberName;
}

// Function that takes in all memberActivity and returns only activity for a specific member
function findMemberActivity (memberActivity, memberId) {
    let individualMemberActivity =  []; 
    for (let i = 0; i < memberActivity.length; i++) {
        if (memberActivity[i].memberId.toLowerCase() === memberId.toLowerCase()) {
            individualMemberActivity.push(memberActivity[i]);
        }
    }
    return individualMemberActivity;
}

// Function that makes up fake Tee Sheet Appearances and Adjustments for dev purposes
// Needs to be removed when wired up with real tee sheet and adjustment data
function fillColumnData (spr) {
    let newSpr = spr;
    for (i = 0; i < newSpr.length; i++) {
        newSpr[i].teeSheetAppearances = Math.floor((1 + Math.random()) * newSpr[i].scoresPosted);
        let a = newSpr[i].teeSheetAppearances - newSpr[i].scoresPosted;
        let b = Math.floor(2 * Math.random()* a);
        newSpr[i].adjustments = b > a ? a : b;
        newSpr[i].percentage = Math.floor((100 * newSpr[i].scoresPosted)/(newSpr[i].teeSheetAppearances - newSpr[i].adjustments));
    }
    return newSpr;
}

// Function that takes in consolidated summary data and writes out report in cell-delimited format
function writeSPRReport (spr) {

    var scoreReport = { 'A1': {t: 's', v: 'Individual Id'},
                        'B1': {t: 's', v: 'Name'},
                        'C1': {t: 's', v: 'Tee Sheet Appearances'},
                        'D1': {t: 's', v: 'Scores Posted'},
                        'E1': {t: 's', v: 'Adjustments'}
    };

    for (let i = 0; i < spr.length; i++) {
        let R = i + 1;
        scoreReport[mapCell(0,R)] = {t: 'n', v: spr[i].id};
        scoreReport[mapCell(1,R)] = {t: 's', v: spr[i].name};
        scoreReport[mapCell(2,R)] = {t: 'n', v: spr[i].teeSheetAppearances};
        scoreReport[mapCell(3,R)] = {t: 'n', v: spr[i].scoresPosted};
        scoreReport[mapCell(4,R)] = {t: 'n', v: spr[i].adjustments};
    }

    scoreReport['!ref'] = XLSX.utils.encode_range({s: {c: 0, r: 0}, e: {c: 4, r: spr.length + 1}});
    return scoreReport;
}

// Prepare spreadsheet for output and write Excel file
function writeExcelFile (scoreReport) {
    let outputWB = {SheetNames: [], Sheets: {}};
    outputWB.SheetNames.push(outputSPRFileSheetName);
    outputWB.Sheets[outputSPRFileSheetName] = scoreReport;
    XLSX.writeFile(outputWB, outputSPRFile)
}

// let scoreData = readScores(inputScoreFile, inputScoreFileSheetName);
// let spr = addScores(scoreData, HOMECOURSE);
// let scoreReport = writeSPRReport(spr);
// writeExcelFile(scoreReport);


