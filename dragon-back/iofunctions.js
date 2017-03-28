const XLSX = require('xlsx');

// Translates cell addresses (eg. from {c:0, r:0} to 'A1')
exports.mapCell = (C,R) => {
    return XLSX.utils.encode_cell({c: C, r: R})
}

// Read in score data workbook. Returns scoreData spreadsheet object
exports.readScores = (scoreFile, sheetName) => {
    const scoreWorkbook = XLSX.readFile(scoreFile, {cellFormula: false, cellHTML: false});
    let scoreData = scoreWorkbook.Sheets[sheetName];
    return scoreData;
}

// Function that makes up fake Tee Sheet Appearances and Adjustments for dev purposes
// Needs to be removed when wired up with real tee sheet and adjustment data
exports.fillColumnData = (spr) => {
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

