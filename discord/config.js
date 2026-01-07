require('dotenv').config();
const {GatewayIntentBits, Partials, ActivityType} = require('discord.js')

module.exports={
    token:process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials:[
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
    ],
    activityTypeMap:{
            'PLAYING': ActivityType.Playing,
            'WATCHING': ActivityType.Watching,
            'LISTENING': ActivityType.Listening,
            'STREAMING': ActivityType.Streaming,
            'COMPETING': ActivityType.Competing
        }
}