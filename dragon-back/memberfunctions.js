
// Function that takes in all memberActivity and returns only activity for a specific member
exports.findMemberActivity = (memberActivity, memberId) => {
    let individualMemberActivity =  []; 
    for (let i = 0; i < memberActivity.length; i++) {
        if (memberActivity[i].memberId.toLowerCase() === memberId.toLowerCase()) {
            individualMemberActivity.push(memberActivity[i]);
        }
    }
    return individualMemberActivity;
}

// Function that finds the name of a member from their membership ID
exports.findMemberName = (memberData, memberId) => {
    let memberName = '';
    for (let i = 0; i < memberData.length; i++) {
        if (memberData[i].memberId.toLowerCase() === memberId.toLowerCase()) {
            memberName = memberData[i].buzName;
            i = memberData.length;
        }
    }
    return memberName;
}
