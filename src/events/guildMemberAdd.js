require("dotenv").config()
const { Events, EmbedBuilder } = require("discord.js")
const { createCanvas, loadImage } = require("canvas")
const fetch = require('node-fetch'); // Use 'require' for node-fetch 2.x
const sharp = require('sharp'); // Use 'require' for sharp

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const welcomeChannel = member.guild.channels.cache.get(process.env.welcomeChannel) //welcome channel
        const logChannel = member.guild.channels.cache.get(process.env.memberLogChannel)

        if(!welcomeChannel || !logChannel) {console.log("failed to find welcome or log channel (guildMemberAdd.js line 8 & 9)"); return}

        // Get the user's profile picture URL (author's PFP) with .png format
        const pfpUrl = member.displayAvatarURL({ format: "png", size: 256 });

        // Fetch the avatar image (webp or png)
        const response = await fetch(pfpUrl);
        const buffer = await response.buffer();

        // Convert the image to PNG using sharp (to ensure it's in a supported format)
        const image = await sharp(buffer).toFormat("png").toBuffer();

        // Load the avatar image from the buffer (not from the URL)
        const avatar = await loadImage(image);

        // Load the background image (e.g., "aurora.png")
        const background = await loadImage("images/aurora.png");

        // Create a canvas with the desired size
        const canvas = createCanvas(700, 400);
        const ctx = canvas.getContext("2d");

        // Draw the background image on the canvas
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Add the join text
        ctx.fillStyle = "#ffffff"; // Set text color to white for better visibility
        ctx.font = "30px Tahoma"; // Larger font size
        const joinText = `${member.user.username} just joined the server!`;

        // Measure text width and center it
        const joinTextWidth = ctx.measureText(joinText).width;
        const joinTextX = (canvas.width - joinTextWidth) / 2; // Horizontal center
        const joinTextY = 250; // Adjust vertical position


        // Draw the text on the canvas (before clipping)
        ctx.fillText(joinText, joinTextX, joinTextY);

        // Add the member count
        ctx.fillStyle = "#7A7A7A"; // Set text color to white for better visibility
        ctx.font = "20px Tahoma"; // Larger font size
        const memberCount = `member #${member.guild.members.cache.size}`;

        // Measure text width and center it
        const memberCountWidth = ctx.measureText(memberCount).width;
        const memberCountX = (canvas.width - memberCountWidth) / 2; // Horizontal center
        const memberCountY = 285; // Adjust vertical position

        // Draw the text on the canvas (before clipping)
        ctx.fillText(memberCount, memberCountX, memberCountY);

        // Draw the avatar as a circle
        const x = canvas.width / 2;
        const y = canvas.height / 2 - 75; // Move the PFP 75px higher
        const radius = 75;

        // Clip the context to a circle (after drawing the text)
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw the avatar inside the circle
        ctx.drawImage(avatar, x - radius, y - radius, radius * 2, radius * 2);

        // Send the canvas as an image
        const attachment = canvas.toBuffer();
        welcomeChannel.send({
            content: `Hi <@${member.id}>, welcome to **${member.guild.name}!**`,
            files: [{
                attachment: attachment,
                name: "custom-image.png",
            }],
        });

        const embed = new EmbedBuilder()
            .setTitle("Member Joined")
            .setAuthor({
                name: member.user.username,
                iconURL: member.displayAvatarURL()
            })
            .addFields(
                { name: "user", value: `<@${member.id}>` },
                { name: "", value: `member #${member.client.users.cache.size}` },
                { name: "Account creation", value: `<t:${Math.floor(member.user.createdAt / 1000)}:R>` }
            )
            .setColor("Green")
            .setFooter({
                text: `ID: ${member.id}`
            })
            .setTimestamp(Date.now())

        return logChannel.send({ embeds: [embed] })

    }
}