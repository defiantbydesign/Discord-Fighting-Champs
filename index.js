const {Client,Events} = require('discord.js')
const fs = require('fs');
const discordConfig = require('./discord/config');

//initiate the bot Client
const bot = new Client({
    intents: discordConfig.intents,
    partials: discordConfig.partials
})

//Load Discord UTILS
const botActivityUtil = require('./discord/utils/setBotActivity')
const {initCommands} = require('./discord/utils/commandHandler');

// Load Events
for (const file of fs.readdirSync('./discord/events')) {
  const event = require(`./discord/events/${file}`);
    bot.on(event.name, (...args) => event.execute(...args, bot));
}

// - Tells server the bot is logged in, deploys commands, and sets activity
bot.once(Events.ClientReady, async (readyClient)=>{
    const setBotActivity = botActivityUtil(bot);
    console.log(`Logged in as ${bot.user.tag}`);
    initCommands(bot,discordConfig)
    await setBotActivity();
})

//LOG INTO DISCORD
bot.login(discordConfig.token)