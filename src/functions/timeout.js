const {PermissionFlagsBits} = require("discord.js")
const {respondRealCallType} = require("./callType")
const {convertTime, formatTime} = require("./timeConverter")


async function timeout(call, target, initiater, duration, reason){
    target = await call.guild.members.cache.get(target.id)
    
    if(target.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        respondRealCallType(call, `Cant timeout the user ${target.username}, because they have the permission Moderate Members.`, false)
        return;
    }

    const targetHighestRole = target.roles.highest;
    const botHighestRole = call.guild?.members.me.roles.highest;

    if(targetHighestRole.comparePositionTo(botHighestRole) >= 0){
        respondRealCallType(call, `Cant timeout the user ${target.username}, because their highest role is higher than my highest role in the role hierachy of this server.`)
        return;
    }

    if(!reason) reason = "No reason provided!"

    try {
        const maxDuration = 1000*60*60*24*28;
        let durationInt = await convertTime(duration)
        if(durationInt == 0) durationInt = maxDuration/1000
        if(durationInt*1000 > maxDuration){
            respondRealCallType(call, `Discord doesnt allow timeouts for more than 28 days, you tried timing ${target.user.username} out for ${formatTime(durationInt)}`)
            return
        }
        target.timeout(durationInt * 1000, reason)
        respondRealCallType(call, `**${initiater.user.username}** timed out **${target.user.username}** for **${formatTime(durationInt)}**. Reason: ${reason}`)
    } catch(error) {
        console.log(error)
    }
    

}

module.exports = {
    timeout
}