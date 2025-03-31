const { User } = require('../schemas/user');
const { respondRealCallType } = require('./callType');

function quickSort(arr) {
    if (arr.length <= 1) return arr; // Base case: arrays with 0 or 1 element are already sorted

    const pivot = arr[arr.length - 1].level; // Choose the last element's level as the pivot
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].level > pivot) {  // Changed to greater than for descending order
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    // Recursively apply quickSort to the left and right sub-arrays and combine them
    return [...quickSort(left), arr[arr.length - 1], ...quickSort(right)];
}

async function leaderboard(call, amount) {
    let users = await User.find({});
    
    // Sort users by their level in descending order
    let sortedUsers = quickSort(users);
    
    let limitedDisplay = []

    let output = "";

    if(amount > 50){
        output += `I can only look for the top 50, not top ${amount} like you requested.\n\n`
        amount = 50;
    }

    //if there are less entries in the database than the user asked for, default to the size of the user array
    if(amount >= sortedUsers.length) limitedDisplay = sortedUsers;
    else limitedDisplay = sortedUsers.slice(0, amount)

    for(let i = 0; i < limitedDisplay.length; i++){
        //get the user object from the userId stored in the database to try and get the username
        GuildUser = call.client.users.cache.get(limitedDisplay[i].userId)
        try {
            output += `${i+1}. ${GuildUser.username}: **Level ${limitedDisplay[i].level}**\n`
        } catch (error) {
            output += `${i+1}. Failed to fetch username: **Level ${limitedDisplay[i].level}**\n`
        }
    }

    
    respondRealCallType(call, output)
}

module.exports = {
    leaderboard
}
