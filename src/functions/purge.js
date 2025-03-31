const { respondRealCallType, determineCallType, CallType } = require("./callType")

async function purge(call, channel, amount){
    if(amount > 100){
        respondRealCallType(call, "I cant delete more than 100 messages at once!")
        return;
    }
    try {
        let messagesToDelete;

        if(determineCallType(call) === CallType.CHATINPUTINTERACTION){
            // Fetch the last N messages in the channel (the amount you want to delete)
            const messages = await channel.messages.fetch({ limit: amount + 1});

            // Find the most recent bot message
            const recentBotMessage = messages.find(message => message.author.bot);

            // Filter out the most recent bot message from the list of messages to delete
            messagesToDelete = messages.filter(message => message !== recentBotMessage);
        }
        else if(determineCallType(call) === CallType.MESSAGEEVENT){
            // Fetch the last N messages in the channel (the amount you want to delete)
            const messages = await channel.messages.fetch({ limit: amount + 1});

            //do not delete the initiating message
            // Filter out the most recent bot message from the list of messages to delete
            messagesToDelete = messages.filter(message => message !== call);
        }

        // Now, delete the filtered messages
        const deletedMessages = await channel.bulkDelete(messagesToDelete);
        
        
        const authorMessageCount = new Map();

        // Iterate through the collection and count the messages for each author
        deletedMessages.forEach(message => {
            const author = message.member;
            if (authorMessageCount.has(author)) {
                authorMessageCount.set(author, authorMessageCount.get(author) + 1);
            } else {
                authorMessageCount.set(author, 1);
            }
        });
        let outputMessage = `**${deletedMessages.size} messages** were purged!\n\n`

        authorMessageCount.forEach((count, author) => {
            
            if(author.nickname !== null) outputMessage += `**${author.user.username}(${author.nickname})**: ${count} messages\n`;
            else if(author.user.globalName !== null) outputMessage += `**${author.user.username}(${author.user.globalName})**: ${count} messages\n`;
            else outputMessage += `**${author.user.username}**: ${count} messages\n`;
        });

        respondRealCallType(call, outputMessage)
    } catch (error) {
        console.error(error)
    }
    
}


module.exports = {
    purge
}