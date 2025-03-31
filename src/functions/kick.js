const {PermissionFlagsBits} = require("discord.js")
const {respondRealCallType} = require("./callType")

async function kick(call, target, initiater, reason){
    target = await call.guild.members.cache.get(target.id)
    
    if(target.permissions.has(PermissionFlagsBits.Administrator)) {
        respondRealCallType(call, `Cant kick the user ${target.username}, because they have the permission Administrator.`, false)
        return;
    }

    const targetHighestRole = target.roles.highest;
    const initiaterHighestRole = initiater.roles.highest;
    const botHighestRole = call.guild?.members.me.roles.highest;

    if(targetHighestRole.comparePositionTo(botHighestRole) >= 0){
        respondRealCallType(call, `Cant kick the user ${target.username}, because their highest role is higher than my highest role in the role hierachy of this server.`)
        return;
    }
    if(targetHighestRole.comparePositionTo(initiaterHighestRole) >= 0){
        respondRealCallType(call, `Cant kick the user ${target.username}, because their highest role is higher than your highest role in the role hierachy of this server.`)
        return;
    }
    if(!reason) reason = "No reason provided!"

    try {
        target.kick(reason)
        respondRealCallType(call, `**${initiater.user.username}** kicked **${target.user.username}**. Reason: ${reason}`)
    } catch(error) {
        console.log(error)
    }
    

}

module.exports = {
    kick
}