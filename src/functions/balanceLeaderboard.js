const { User } = require('../schemas/user');
const { respondRealCallType } = require('./callType');

function quickSort(arr) {
    if (arr.length <= 1) return arr; // Base case: arrays with 0 or 1 element are already sorted

    const pivot = arr[arr.length - 1].balance; // Choose the last element's balance as the pivot
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].balance > pivot) {  
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    // Recursively apply quickSort to the left and right sub-arrays and combine them
    return [...quickSort(left), arr[arr.length - 1], ...quickSort(right)];
}

async function baltop(call) {
    let users = await User.find({});


    let sortedUsers = quickSort(users);
    
    let limitedDisplay = []

    let output = "";

    const amount = 10;

    //if there are less entries in the database than the user asked for, default to the size of the user array
    if(amount >= sortedUsers.length) limitedDisplay = sortedUsers;
    else limitedDisplay = sortedUsers.slice(0, amount)

    for(let i = 0; i < limitedDisplay.length; i++){
        //get the user object from the userId stored in the database to try and get the username
        GuildUser = call.client.users.cache.get(limitedDisplay[i].userId)
        try {
            output += `${i+1}. ${GuildUser.username}: **Balance: ${limitedDisplay[i].balance}**\n`
        } catch (error) {
            output += `${i+1}. Failed to fetch username: **Balance ${limitedDisplay[i].balance}**\n`
        }
    }

    
    respondRealCallType(call, output)
}

module.exports = {
    baltop
}
