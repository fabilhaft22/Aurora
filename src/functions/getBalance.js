const {User} = require("../schemas/user")
const { EmbedBuilder } = require("discord.js")


async function balance(call){
    let user = await User.findOne({userId: call.member.id})

    const embed = new EmbedBuilder()
        .setTitle("Account balance")
        .setAuthor({
            name: call.member.user.username,
            iconURL: call.member.displayAvatarURL()
        })
        .addFields(
            {name: "User", value: `<@${call.member.id}>`},
            {name: "Balance", value: `${user.balance} credits`}
        )
        .setTimestamp(Date.now())
        .setFooter({
            text: `ID: ${call.member.id}`
        })
        .setColor("Blue")

    call.reply({embeds: [embed]})
    return;
}

module.exports = {
    balance
}