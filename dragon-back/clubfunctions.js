const XLSX = require('xlsx');
const iofunc = require('./iofunctions.js');

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

// Function that takes in scores-entered data and returns consolidated data by golfer
exports.addScores = (scoreData, homeCourse) => {

    let spr = [];
    let lastRow = XLSX.utils.decode_range(scoreData['!ref']).e.r;

    for (let R = 1; R <= lastRow; R++) {
        if ((scoreData[iofunc.mapCell(9,R)].v === homeCourse) && (!scoreData[iofunc.mapCell(7,R)].v.includes('C'))) {
            let existingGolfer = false;
            for (let i = 0; ((i < spr.length) && (!existingGolfer)); i++) {
                if (scoreData[iofunc.mapCell(0,R)].v === spr[i].id) {
                    spr[i].scoresPosted++;
                    existingGolfer = true;
                }
            }
            if (!existingGolfer) {
                spr.push(new Summary(scoreData[iofunc.mapCell(0,R)].v, scoreData[iofunc.mapCell(2,R)].v));
                spr[spr.length - 1].scoresPosted++;
            }
        }
    }
    return spr;
}
