const {Message, ChatInputCommandInteraction} = require("discord.js")

const CallType = Object.freeze({
    UNKNOWN: -1,
    MESSAGEEVENT: 0,
    CHATINPUTINTERACTION: 1
})


//check call type of object call
function determineCallType(call){
    if(call instanceof Message){
        return CallType.MESSAGEEVENT //call is from a message event
    }
    else if(call instanceof ChatInputCommandInteraction){
        return CallType.CHATINPUTINTERACTION //call is from an chat input interaction
    }
    else{
        return CallType.UNKNOWN //unknown calltype
    }
}
/**
 * 
 * @param {*} call 
 * @param {Message} message 
 * @param {boolean} ephemeral 
 */

//respond depending on call type
async function respondRealCallType(call, message, ephemeral = false){

    if(determineCallType(call) === CallType.MESSAGEEVENT) {
        try {
            await call.reply(message)
        } catch (error) {
            await call.channel.send(message)   
        }
        return;
    }
    else if(determineCallType(call) === CallType.CHATINPUTINTERACTION){
        if(call.replied || call.deferred){
            await call.editReply({content: message, ephemeral: ephemeral})
        }
        else{
            await call.reply({content: message, ephemeral: ephemeral})
        }
    }
    else{
        console.log("unknown callType in callType.js, cant continue here.")
        return;
    }
}

module.exports = {
    CallType,
    determineCallType,
    respondRealCallType
}