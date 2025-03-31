const {Events} = require("discord.js");

module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    async execute(reaction, user){

        if(reaction.message.id !== "1355291489550471373") return;

        if(reaction.emoji.name !== "✅") return;
        

        const member = await reaction.message.guild.members.fetch(user.id)
        
        if(member.roles.cache.has("1355286303541035221" )) {//unverified
            member.roles.add("1355285507067609128") // member role
            member.roles.remove("1355286303541035221") //remove unverified role

            
        }
        
        if(!member.user.bot) {
            reaction.users.remove(user.id)
        }
    }
}