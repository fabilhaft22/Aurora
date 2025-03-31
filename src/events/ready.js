const {Events} = require("discord.js")

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(c){
        console.log(`${c.user.tag} is online.`)
    }
}