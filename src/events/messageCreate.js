const { Events, PermissionFlagsBits } = require("discord.js")
const { User } = require('../schemas/user');
const { getXPForLevel } = require("../data")
const { timeout } = require("../functions/timeout");
const { kick } = require("../functions/kick");
const { ban } = require("../functions/ban");
const { unban } = require("../functions/unban");
const { purge } = require("../functions/purge");
const { getLevel } = require("../functions/getLevel")

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;



        //timeout chat command!
        if (message.content.toLowerCase().startsWith("!timeout")) {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                message.reply("You do not have the permission to use this command!")
                return;
            }
            //split up the message in subparts
            const firstSubPart = message.content.split(" ", 2); //first 2 are command and target user
            message.content = message.content.slice(firstSubPart[0].length + firstSubPart[1].length + 2, message.content.length)

            const command = firstSubPart[0]; // command
            let target = firstSubPart[1]; // target user


            if (target.charAt(0) === "<" || target.charAt(1) === "@") {
                target = target.slice(2, target.length - 1)
            }

            //check if user is properly inputted
            if (isNaN(parseInt(target))) message.reply("You messed up the formatting when tagging the person to receive the timeout")

            let user 
            try {
                //fetch the proper target object
                user = await message.guild.members.cache.get(target)
            } catch (error) {
                console.log(error)
                return;
            }


            if (!user) {
                message.reply("Could not find the user!")
                return;
            }

            //figure out if the user messed up the formatting for time and try to save it.

            let remainingContent = message.content.split(" ");

            let duration = remainingContent[0]
            if (remainingContent[0].length === `${parseInt(remainingContent[0])}`.length) { //check if the length stays the same after removing the alphanumerical characters
                duration = remainingContent[0] + remainingContent[1]
                message.content = message.content.slice(remainingContent[0].length + remainingContent[1].length + 2, message.content.length)
            }
            else message.content = message.content.slice(remainingContent[0].length + 1, message.content.length)

            let reason = message.content;

            if (reason == "") reason = "No reason provided!"

            try {
                let user = await message.client.users.fetch(target).catch((error) => {
                    console.error("Error fetching user:", error);
                    return null;
                });

                if (!user) {
                    message.reply("Could not find the user. Make sure you provided a valid ID.");
                    return;
                }

                timeout(message, user, message.member, duration, reason)
                return;
            } catch (error) {
                console.error(error);
                message.reply("An error occurred while trying to ban the user.");
            }
        }


        //Kick chat command!
        if (message.content.toLowerCase().startsWith("!kick")) {
            if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                message.reply("You do not have the permission to use this command!")
                return;
            }
            //split up the message in subparts
            const subparts = message.content.split(" ")

            const command = subparts[0]
            let target = subparts[1]


            // Extract the ID from a mention
            if (target.startsWith("<@") && target.endsWith(">")) {
                target = target.replace(/<@!?(\d+)>/, "$1");
            }

            // Check if the target is a valid user ID
            if (isNaN(target)) {
                message.reply("Invalid user ID or mention. Please provide a valid user.");
                return;
            }

            let reason = subparts.slice(2).join(" ") || "No reason provided!";

            try {
                let user = await message.client.users.fetch(target).catch((error) => {
                    console.error("Error fetching user:", error);
                    return null;
                });

                if (!user) {
                    message.reply("Could not find the user. Make sure you provided a valid ID.");
                    return;
                }

                kick(message, user, message.member, reason)
                return;
            } catch (error) {
                console.error(error);
                message.reply("An error occurred while trying to ban the user.");
            }

        }
        //Ban chat command!
        if (message.content.toLowerCase().startsWith("!ban")) {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                message.reply("You do not have the permission to use this command!");
                return;
            }

            // Split up the message into subparts
            const subparts = message.content.split(" ");
            const command = subparts[0];
            let target = subparts[1];

            // Extract the ID from a mention
            if (target.startsWith("<@") && target.endsWith(">")) {
                target = target.replace(/<@!?(\d+)>/, "$1");
            }

            // Check if the target is a valid user ID
            if (isNaN(target)) {
                message.reply("Invalid user ID or mention. Please provide a valid user.");
                return;
            }

            let reason = subparts.slice(2).join(" ") || "No reason provided!";

            try {
                let user = await message.client.users.fetch(target).catch((error) => {
                    console.error("Error fetching user:", error);
                    return null;
                });

                if (!user) {
                    message.reply("Could not find the user. Make sure you provided a valid ID.");
                    return;
                }

                // Call the `ban` function with the fetched user object
                ban(message, user, message.member, reason);
                return;
            } catch (error) {
                console.error(error);
                message.reply("An error occurred while trying to ban the user.");
            }
        }

        //unban chat command!
        if (message.content.toLowerCase().startsWith("!unban")) {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                message.reply("You do not have the permission to use this command!");
                return;
            }

            // Split the message into parts
            const subparts = message.content.split(" ");

            let target = subparts[1];

            // Extract ID from mention
            if (target.startsWith("<@") && target.endsWith(">")) {
                target = target.replace(/\D/g, ""); // Remove non-numeric characters
            }

            // Check if target is a valid number (user ID)
            if (isNaN(target)) {
                message.reply("You messed up the formatting when tagging the person to unban.");
                return;
            }

            try {
                // Fetch the ban for the specific user ID
                const banInfo = await message.guild.bans.fetch(target);

                if (!banInfo) {
                    message.reply(`User with ID **${target}** is not banned.`);
                    return;
                }

                // Call unban function with proper user data
                unban(message, banInfo.user, message.member);
                return;
            } catch (error) {
                console.error(error);
                message.reply(`Could not fetch the ban for user ID **${target}**.`);
            }
        }

        //purge
        if (message.content.toLowerCase().startsWith("!purge")) {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                message.reply("You do not have the permission to use this command!")
                return;
            }
            const amount = parseInt(message.content.split(" ")[1])

            if (isNaN(amount) || amount <= 0) {
                message.reply("Please enter a valid amount of messages to be deleted")
                return
            }

            purge(message, message.channel, amount);
            return;
        }

        // level chat command
        if (message.content.toLowerCase().startsWith("!level")) {
            const parts = message.content.split(" ")

            if (parts.length <= 1) {
                getLevel(message, message.member)
                return;
            }
        }




        // xp stuff

        // Fetch user data from the database or create a new user if not exists
        let user = await User.findOne({ userId: message.author.id });

        if (!user) {
            // Create a new user with default xp and level values
            user = new User({
                userId: message.author.id,
                xp: 0,
                level: 1,
                totalXp: 0,
                lastXPTime: Date.now(),  // Set to current timestamp
                xpMultiplier: 1,
                messagesWithMultiplier: 0
            });

        }

        const currentTime = Date.now();
        const timeDifference = currentTime - user.lastXPTime;

        // Set the cooldown time (for testing, you can set it to 0)
        const XP_COOLDOWN = 10 * 1000; // 10 seconds cooldown between XP rewards

        // If the cooldown has passed, award XP
        if (timeDifference >= XP_COOLDOWN) {
            // Award XP (random number between 10-25 * multiplier)
            const awardedXP = (Math.floor(Math.random() * 15) + 10) * user.xpMultiplier;
            user.xp += awardedXP;
            user.totalXp += awardedXP;

            // Update the lastXPTime to the current time
            user.lastXPTime = currentTime;

            // Check if the user has leveled up
            const xpToLevelUp = getXPForLevel(user.level);
            while (user.xp >= xpToLevelUp) {
                user.level++;
                user.xp = user.xp - xpToLevelUp; // set xp to remaining xp

                // Send a message when the user levels up
                message.reply(`Congratulations ${message.author.username}! You have leveled up to level ${user.level}!`);
            }

            // If the user has used their multiplier messages, reset it
            if (user.messagesWithMultiplier > 0) {
                user.messagesWithMultiplier--;
                if (user.messagesWithMultiplier === 0) {
                    user.xpMultiplier = 1; // Reset to no multiplier
                }
            }
        } else {
            // If the cooldown hasn't passed, you can optionally inform the user
            const timeLeft = Math.floor((XP_COOLDOWN - timeDifference) / 1000);
        }


        await user.save()


    }

}