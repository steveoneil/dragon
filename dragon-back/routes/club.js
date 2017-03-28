const router = require('express').Router();
const iofunc = require('../iofunctions.js');
const clubfunc = require('../clubfunctions.js');

const HOMECOURSE = 'St. George\'s Golf & Country Club';
const inputScoreFile = './dragon-back/DataFiles/SourceFiles/scores_test.xlsx';
const inputScoreFileSheetName = 'NGN_General_Scores_Posted_By_Da';

router.get('/activity', (req, res) => {
    let scoreData = iofunc.readScores(inputScoreFile, inputScoreFileSheetName);
    let spr = clubfunc.addScores(scoreData, HOMECOURSE);
    let newSpr = iofunc.fillColumnData(spr);  // Needs to be updated with real tee sheet and adjustment data
    res.json(newSpr);
})

module.exports = router;