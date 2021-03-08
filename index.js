"""
Program made by Salty-Coder.
Protected by GNU General Public License v3.0
"""

const Discord = require("discord.js")
const fs = require("fs")
const clc = require("cli-color")
const ConsoleTitle = require("node-bash-title")
const { setTimeout } = require("timers")
const cheerio = require('cheerio');
const asyncio = require("asyncio")
//const wait = require("wait")
const wait = require("@trenskow/wait")
const request = require("request")
const urban = require("relevant-urban")
const ms = require("ms")
const tokenfile = require("./token.json")
const idfile = require("./myID.json")
const translate = require('google-translate-api')
const superagent = require("superagent")
const moment = require('moment')
require('moment-duration-format')
const catFacts = require('cat-facts')
const dogFacts = require('dog-facts')
const hastebin = require('hastebin-gen')
const chancejs = require("chance")
const chance = new chancejs()

const bot = new Discord.Client({disableEveryone: true})

let prefix = "<<"

ConsoleTitle("Selfbot Test")

bot.on("ready", async () =>{
    console.log(clc.green(`Logged in as ${bot.user.username}`))
    setTimeout( () => {
        console.clear()
        console.log(clc.green("Ready to start"))
    }, 2000)
})

let shortcuts = new Map([
    ['lenny', '( ͡° ͜ʖ ͡°)'],
    ['magic', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'],
    ['yay', '( ﾟヮﾟ)'],
    ['smile', '{◕ ◡ ◕}'],
    ['wizard', '(∩´• . •`)⊃━☆ﾟ.*'],
    ['happy', '╰( ◕ ᗜ ◕ )╯'],
    ['party', '(つ°ヮ°)つ'],
    ['dance', '└╏ ･ ᗜ ･ ╏┐'],
    ['disco', '（〜^∇^)〜'],
    ['woahmagic', '(∩｡･ｏ･｡)っ.ﾟ☆`｡'],
    ['rage', '(┛ಠДಠ)┛彡┻━┻'],
    ['excited', '☆*:. o(≧▽≦)o .:*☆'],
    ['music', '(✿ ◕ᗜ◕)━♫.*･｡ﾟ'],
    ['woah', '【 º □ º 】'],
    ['flipparty', '༼ノ◕ヮ◕༽ノ︵┻━┻'],
    ['sad', '(;﹏;)'],
    ['wink', '(^_-)']
])

bot.on("message", async message => {
    if(message.author.id !== idfile.id) return;
    if(!message.content.startsWith(prefix)) return;
    let args = message.content.substring(prefix.length).split(" ")
    let command = args.shift()
   
    switch(command){

        case "ping":
            ping_msg = await message.channel.send(`🏓 Pinging...`)
    
            ping_msg.edit(`🏓 Pong!\nLatency is ${Math.floor(ping_msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency is ${Math.round(bot.ws.ping)}ms`);
            break;

        case "embed":
            message.delete()
            if(args[2]){
                let title = args[0]
                let desc = args[1]
                let footer = args[2]
                let embed = new Discord.RichEmbed()
                .setTitle(title)
                .setDescription(desc)
                .setFooter(footer)
                message.channel.send(embed)
            }else{
                let title = args[0]
                let footer = args[1]
                let embed = new Discord.RichEmbed()
                .setTitle(title)
                .setFooter(footer)
                message.channel.send(embed)
            }
            break;

        case "spam":
            message.delete()
            num = 0
            let msg = args[0]
            let amount = args[1]
            let waittime = args[2]
            while(num < amount){
                await wait(waittime + "s")
                num = num + 1
                message.channel.send(msg)   
            }
            break;
    
        case 'dm':
            if(!args[0]) return message.channel.send("Who do I send to?")
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if(!user) return message.channel.send("You didnt specify a user or the user isnt valid :P")
            if(!args.slice(1).join(" ")) return message.channel.send("I need a message to send :P")
            user.user.send(args.slice(1).join(" ")).catch(() => message.channel.send("I cant dm them! 😭")).then(() => message.channel.send(`Sent the message to ${user.user.tag} :P`))
            if(message.mentions.members.first()){
                 message.delete()
            }

        case 'purge111':
            if(message.member.hasPermission('MANAGE_MESSAGES')){
                if (!message.guild.me.hasPermission("MANAGE_MESSAGES")){
                        message.channel.send(`You might have Manage Messages but I dont... Please fix that`);
                return;
                }else{
                    if(!args[0]) return message.reply('Please specify how many messages')
                    else{
                        if(args[0] === '0'){
                            message.channel.send("Whats the point in purging 0 messages? If you start with 10 messages and you purge 0, you now have 10 left...")
                        }else{
                            if (parseInt(args[0]) >= 100){
                                    message.channel.send("Sorry but there is a Discord API limit of 100")
                                }else{
                                    let cleanconfirm = await message.channel.send('Are you sure you want to delete ' + args[0] + ' messages?');
                                    cleanconfirm.react('✔️').then(() => cleanconfirm.react('❌'));
    
                                    const cleanfilter = (reaction, user) => {
                                        return ['✔️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };
                                    cleanconfirm.awaitReactions(cleanfilter, {max: 1, time: 6000, errors: ['time'] })
                                    .then(collected => {
                                        const reaction = collected.first();
    
                                        if (reaction.emoji.name === '✔️') {
                                            message.channel.bulkDelete(args[0])
                                            message.reply('Successfully purged ' + args[0] + ' messages!')
    
                                        }else{
                                            message.reply('The action has been cancelled!')
                                        }
                                    })
                                    .catch(collected => {
                                        message.reply('You did not specify an answer within the set time frame')
                                })}
                        }
                            }}     
                }else{
                    message.reply('You must have the Manage Messages permission in order to use the clean prompt')}
                    break;
    
        case 'kick':
            const user1 = message.mentions.users.first();
            if(message.member.hasPermission('KICK_MEMBERS')){
                if (user1) {
                    const member = message.guild.member(user1);
                    if (member) {
                        member.kick("You were kicked from a server for " + args[2]).then(() => {
                            message.reply(`Successfully kicked ${user1.tag}`);
                        }).catch(err => {
                            message.reply('I was unable to kick the user');
                            console.log(err);
                        });
                    } else {
                        message.reply('That user isn\'t in this server')
                    }
                } else {
                    message.reply('You must specify a user and a reason')
                }
            }
            break;
    
        case 'ban':
            if(message.member.hasPermission('BAN_MEMBERS')){
                if (user) {
                    const member = message.guild.member(user);
                    if (member) {
                        member.kick("You were banned from a server for " + args[2]).then(() => {
                            message.reply(`Successfully banned ${user.tag}`);
                        }).catch(err => {
                            message.reply('I was unable to ban the user');
                            console.log(err);
                        });
                    } else {
                        message.reply('That user isn\'t in this server')
                    }
                } else {
                    message.reply('You must specify a user and a reason')
                }
            }
            break;

        case 'meme':
            if(!args[0])return message.reply('Please specify a topic')
            else{
                meme(message);
                console.log(message.member + 'was sent a meme about ' + args[0]);}
            break;

        case '1userinfo':
            if(message.author.bot){
                message.channel.send(`Sorry ${user.tag} but I dont deal info for bots`)
            } else {
                async (Discord, client, message, args) => {
                if (isNaN(args[0])) {
                    var member1 = message.mentions.users.first();
                    if (!member1) {
                        var member1 = message.author;
                    }
                } else {
                    var member1 = await client.users.fetch(args[0]);
                }
                          
                // member variables
                const joined = member1.joinedAt //formatDate? What for? 
                const roles = member.roles
                    .filter(r => r.id !== message.guild.id)
                    .map(r => r)
                    .join(", ") || "none";
                          
                // user variables
                const created = member1.createdAt //formatDate? What for? user.createdAt is "String" + No need to use member1.user, just use member1
                const embed = new Discord.RichEmbed() //Missed "Discord." or whatever Discord constructor you use.
                    .setFooter(member1.user.username, member1.AvatarURL()) //Discord.js v12.1.1 uses .avatarURL() instead of avatarURL, don't use "user."
                    .setThumbnail(member1.AvatarURL())
                    .setColor(member1.displayHexColor === colours.black ? colours.white : member.displayHexColor)
                    .addField('Member Information', stripIndents`**> Display Name:** ${member1.displayName}
                    **> Joined At:** ${joined}
                    **> Roles:** ${roles}`, true)
                    .addField('User Information', stripIndents`**> ID: ${member1.user.id}
                    **> Username:** ${member1.user.username}
                    **> Discord Tag:** ${member1.user.tag}
                    **> Created at:** ${created}`, true)  
                    .setTimestamp()
                    if(member1.user.presence.game)
                    embed.addField('Currently Playing', `**> Name:** ${member1.user.presence.game.name}`);
                    message.channel.send(embed);}
                break;
            }
    
        case 'define':
            if(!args[0]) return message.channel.send(`***Please specify a word***`);
            let res = await urban(args.join(' ')).catch(e => {
                return message.channel.send(`***Sorry, ${args[0]} was not found***`);
            });
            message.delete()
            const defineEmbed = new Discord.RichEmbed()
                .setColor('RANDOM')
                .setTitle(res.word)
                .setURL(res.urbanURL)
                .setDescription(`***Definition:***\n*${res.definition}*\n\n**Example:**\n${res.example}*`)
                .addField('Author', res.author, true)
                .addField('Rating', `**\`Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\`**`)
    
            if(res.tags.length > 0 && res.tags.join(' ').length < 1024) {
                defineEmbed.addField('Tags', res.tags.join(', '), true)
            }
    
            message.channel.send(defineEmbed);
    
            break;
    
        case 'giveaway':
            if(args[0] === 'create'){
                if(!args[1]) return message.channel.send("You must format the command correctly - Usage: ```<prefix>giveaway create advanced <continue>``` or ```<prefix>giveaway create basic```")
                    
                    
                if(args[1] === 'advanced'){
                    if(!args[2]) return message.channel.send(`You did not specify a giveaway duration`)
                    if(!args[2].endsWith("d")&&!args[2].endsWith("h")&&!args[2].endsWith("m")) return message.channel.send(`The giveaway duration is not formatted correctly!\n\nUsage:\n\`\`\`<prefix>giveaway create advanced 7d #generalchat chocolate\`\`\``)
                    if(isNaN(args[2][0])) return message.channel.send(`${args[2][0]} isnt a number`)
                    if(args[2].endsWith("s")) return message.channel.send("You cant have a giveaway lasting less than 1 minute")
                    let giveawaychannel = message.mentions.channels.first()
                    if(!giveawaychannel) return message.channel.send(`Either I could not find the channel specified in this server or you did not specify one`)
                    let prize = args.slice(4).join(" ")
                    if(!prize) return message.channel.send("You must specify a prize")
                    message.channel.send(`**Giveaway created in ${giveawaychannel}!**`)
                    let giveawayEmbed = new Discord.RichEmbed()
                    .setTitle(`Giveaway`)
                    .setDescription(`${message.author} is hosting a giveaway for **${prize}**\nReact with 🎉 to enter!`)
                    .setTimestamp(Date.now()+ms(args[2]))
                    .setColor(`BLUE`)
                    .setFooter(`Giveaway ends`)
                    let m = await giveawaychannel.send(giveawayEmbed)
                    m.react("🎉")
                    setTimeout(() =>{
                        let winner = m.reactions.cache.get("🎉").users.cache.filter(u=>!u.bot).random()
                        giveawaychannel.send(`The winner of the giveaway for **${prize}** is... **${winner}**!`)
                    }, ms(args[2]));
                    }
    
    
    
                if(args[1] === 'test-basic'){
                    message.channel.send(new Discord.RichEmbed()
                    .setColor("RANDOM")
                    .setTitle("Giveaway duration?")
                    .setDescription("(d, h, m)")
                    )
                    const filter = m => m.author.id === message.author.id;
    
                    let giveawayTime = await message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']}).then(answers => {
                        const giveawayTimeAns = global.giveawayTime.first();
    
                        if(!giveawayTimeAns.endsWith("d")&&!giveawayTimeAns.endsWith("h")&&!giveawayTimeAns.endsWith("m")) return message.channel.send(`The giveaway duration is not formatted correctly!\n\nUsage:\n\`\`\`2d or 6h or 10m\`\`\``)
                        if(isNaN(giveawayTimeAns)) return message.channel.send(`${giveawayTimeAns} isnt a number`)
                        .catch(error =>{
                            message.channel.send("err")
                        });
                    })                
                    }
                }
                break;
    
        case "bumper":
            message.delete()
            if(args[0] == "start"){ 
                var bumper = setInterval(() => {
                    message.channel.send("!d bump")
                }, 7200000);
            }
            if(args[0] == "end"){
                clearInterval(bumper)
            }
            break;

        case "song":
            message.delete()
            if(args[0] == "xxxt"){
                if(args[1] == "before"){
                    message.channel.send(`      Before I lay me down to sleep
                    I pray the Lord my soul to keep
                    I hope it's not too late for me, whoa
                    Before I lay me down to sleep
                    I pray the Lord my soul to keep
                    I hope it's not too late for me, whoa
                    
                    Difference changing in the distance
                    Time consumes the image, oh
                    Difference changing in the distance
                    Time consumes our image, whoa
                    
                    Before I lay me down to sleep
                    I pray the Lord my soul to keep
                    I hope it's not too late for me, whoa
                    Before I lay me down to sleep
                    I pray the Lord my soul to keep
                    I hope it's not too late for me, whoa`) 
                }

                if(args[1] == "joce"){
                    message.channel.send(`
                    I know you so well, so well
                    I mean, I can do anything that he can
                    I've been pretty—
                    
                    I know you're somewhere, somewhere
                    I've been trapped in my mind, girl, just holding on
                    I don't wanna pretend we're something, we're nothing
                    I've been stuck thinking 'bout her, I can't hold on (I'll be feeling)
                    
                    I'm in pain, wanna put ten shots in my brain
                    I've been trippin' 'bout some things, can't change
                    Suicidal, same time I'm tame
                    Picture this, in bed, get a phone call
                    Girl that you fucked with killed herself
                    That was this summer when nobody helped
                    And ever since then, man, I hate myself
                    Wanna fuckin' end it, pessimistic
                    All wanna see me with no pot to piss in
                    But niggas been excited 'bout the grave I'm diggin'
                    Havin' conversations 'bout my haste decisions
                    Fuckin' sickenin'; at the same time
                    Memories surface through the grapevine
                    'Bout my uncle playin' with a slip knot
                    Post-traumatic stress got me fucked up
                    Been fucked up since the couple months they had a nigga locked up
                    
                    
                    I'll be feelin' pain, I'll be feelin' pain just to hold on
                    And I don't feel the same, I'm so numb
                    I'll be feelin' pain, I'll be feelin' pain just to hold on
                    And I don't feel the same, I'm so numb
                    
                    I know you so well (I know you, girl)
                    I mean, I can do better than he can
                    I've been pretty—
                    I know you so well`)
                }
            }
    
        case "shortcut":
            let command_name = message.content.slice(11);
            if (shortcuts.has(command_name)) {
                setTimeout(() => { message.edit(shortcuts.get(command_name)) }, 50);
                return;
            }
    
        case "userinfo":
            let theuser = message.mentions.users.first()
            if (!theuser) { return message.edit(":x: Unknown user!") }
            message.edit(("", { embed: new Discord.RichEmbed().setTitle("**Userinfo**").setColor("#00D4FF").setThumbnail(theuser.avatarURL).setDescription("Username - **" + theuser.username + "**\nDiscrim - **" + theuser.discriminator + "**\nID - **" + theuser.id +  "**\nStatus - **" + theuser.presence.status + "**\n").setFooter("Information sourced from Discord") }));
            //"**\nGame - **" + theuser.presence.game.name +
            break;

        case "stats":
            message.edit("I am on **" + bot.guilds.size + "** servers with **" + bot.users.size + "** users on them")
            break;

        case "translate":
            let translateme = args.slice(0).join(" ")
            translate(translateme, { to: config.translate }).then(res => {
                msg.edit("", { embed: new Discord.RichEmbed().setTitle("Translate").setColor("#00C5FF").setDescription("From - ** " + res.from.language.iso + "**\nTo - ** " + config.translate + "**\nInput - **" + translateme + "**\nOutput :arrow_down:```" + res.text + "```").setFooter("Powered by Google") })
            }).catch(err => {
                msg.edit(":x: An error has occurred. Details: " + err)
            });
            break;
    
        case 'uptime':
            message.edit("The uptime is **" + moment.duration(bot.uptime).format(' D [days], H [hrs], m [mins], s [secs]') + "**")
            break;

        case 'coinflip':
            message.edit("" + chance.pickone(["I flipped a coin and got **heads**!", "I flipped a coin and got **tails**!"]))
            break;
    
        case 'name':
            message.delete()
            message.channel.send("" + chance.name())
            break;
    
        case 'number':
            message.delete()
            message.channel.send("" + chance.integer({ min: 0, max: 10000 }))
            break;
   
        case 'cat':
            superagent.get("https://random.cat/meow", (err, res) => {
                if (err) { return message.edit(":x: An error has occurred. Details: " + err) }
                message.edit("", {
                    embed: new Discord.RichEmbed().setTitle("Random Cat").setColor("#FBFF00").setDescription(catFacts.random()).setImage(res.body.file).setFooter("Image by random.cat")
                })
            })
            break;
    
        case 'guildlist':
            message.edit(bot.guilds.forEach(g => { message.edit(g.name) }))
    
        case 'haste':
            let haste = args.slice(0).join(" ")
            if (!args[0]) { return message.edit(":x: What do you want to post to Hastebin?") }
            hastebin(haste).then(r => {
                message.edit(":white_check_mark: Posted text to Hastebin at this URL: " + r);
            }).catch(message.edit(":x: An error has occurred. Details: " + console.error));
    
        case 'nitro':
            message.delete()
            message.channel.send(new Discord.RichEmbed() 
            .setColor(5267072)
			.setAuthor(`Discord Nitro Message`, 'https://cdn.discordapp.com/emojis/264287569687216129.png ')
			.setDescription('[Discord Nitro](https://discordapp.com/nitro) is **required** to view this message.')
			.setThumbnail('https://cdn.discordapp.com/attachments/194167041685454848/272617748876492800/be14b7a8e0090fbb48135450ff17a62f.png')
            )
    
        case 'serverdm':
            console.log("got")
            let servermsg = args[0]
                message.guild.members.forEach(member=>{
                    console.log("member")
                    if(member.id == bot.user.id) return;
                    if(member.user.bot) return;
                    if(member.hasPermission("BAN_MEMBERS") || member.hasPermission("KICK_MEMBERS") || member.hasPermission("MANAGE_ROLES")) return;
                    console.log("got past perms")
                    member.send(`${servermsg}`);
                    console.log("sent to " + member.name)
                })

        case 'globaldm':
            let globalmsg = args[0]
            bot.guilds.forEach(g=>{
                g.members.forEach(member=>{
                    setTimeout(function(){
                if(member.id == bot.user.id) return;
                if(member.user.bot) return;
                if(member.hasPermission("BAN_MEMBERS") || member.hasPermission("KICK_MEMBERS") || member.hasPermission("MANAGE_ROLES")) return;
                member.send(`${globalmsg}`);
            }, 30000);
            });
        })




    }
})




function meme(message){

    var options = {
        url: 'https://results.dogpile.com/serp?qc=images&q=' + message.content.substring(prefix.length).split(" ") + 'meme',
        method: 'GET',
        headers: {
            'Accept': 'text/html',
            'User-Agent': 'Chrome'
        }
    };

    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
 
        if (!urls.length) {
           
            return;
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });

}


bot.login(tokenfile.token)