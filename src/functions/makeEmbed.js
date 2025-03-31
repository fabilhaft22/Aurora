const {EmbedBuilder, Channel, Embed} = require("discord.js");



/**
 * 
 * @param {string} title 
 * @param {string} content 
 * @param {number} color 
 * @param {string} description 
 * @param {boolean} timestamp 
 * @returns {Embed}
 */
function makeEmbed(title = null, content = null, color = null, description = null, timestamp = null){

    const embed = new EmbedBuilder();

    if(!content) embed.addFields({name: "", value: "No content at all"})

    if(title !== null) embed.setTitle(title)
    if(color !== null) embed.setColor(color)
    if(description !== null) embed.setDescription(description)
    if(timestamp) embed.setTimestamp(Date.now())

    let fields = content.split(";f")

    fields.forEach(field => {
        embed.addFields({name: "", value: field})
    })
    

    return embed;
}


module.exports = {
    makeEmbed
}