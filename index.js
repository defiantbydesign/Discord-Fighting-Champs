require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    Partials,
    Collection,
    ActivityType,
    PresenceUpdateStatus,
    Events
} = require('discord.js')

const bot = new Client({
    intents: [
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
    ]
})
// - Tells server the bot is logged in, deploys commands, and sets activity
bot.once(Events.ClientReady, async (readyClient)=>{
    console.log(`Logged in as ${bot.user.tag}`);

    await deployCommands();
    await setBotActivity();
})

//LOG INTO DISCORD
bot.login(process.env.DISCORD_TOKEN)

// - Sets bot Activity
const setBotActivity = async (activity, type)=>{
    const botActivity = activity || 'DFC Highlights'
    
    const botActivityTypeMap ={
        'PLAYING': ActivityType.Playing,
        'WATCHING': ActivityType.Watching,
        'LISTENING': ActivityType.Listening,
        'STRAMING': ActivityType.Streaming,
        'COMPETING': ActivityType.Competing
    }
    const botActivityType = type || 'WATCHING'

    bot.user.setPresence({
    status: 'online',
    activities:[{
        name: botActivity,
        type: botActivityTypeMap[botActivityType]
    }]
})

console.log(`${bot.user.tag}'s Activity is set to ${botActivityType}:${botActivity}`)
}



//DISCORD COMMANDS
bot.commands = new Collection();
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname,'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file=> file.endsWith('.js'));

// - Adds each command to the commands collection
for(const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command){
        bot.commands.set(command.data.name, command)
    }else{
        if(!'data' in command){
            console.error(`The command ${filePath} is missing the required 'data' property.`)
        }
        
        if(!'execute' in command){
            console.error(`The command ${filePath} is missing the required 'execute' property.`)
        }
    }
}

// - Deploys commands from the command collection
const deployCommands = async ()=>{
    try{
        const commands = [];
        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file=>file.endsWith('.js'));

        for(const file of commandFiles){
            const command = require(`./commands/${file}`)

            if('data' in command && 'execute' in command){
                commands.push(command.data.toJSON());
            }else{
                if(!'data' in command){
                    console.error(`The command ${filePath} is missing the required 'data' property.`);
                }
                
                if(!'execute' in command){
                    console.error(`The command ${filePath} is missing the required 'execute' property.`);
                }
            }
        }

    const rest  = new REST().setToken(process.env.DISCORD_TOKEN)
    console.log(`Started refreshing ${commands.length} application slash commands globally`)
    const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        {body: commands},
    )

    console.log(`Successfully reloaded all commands!`);

    }catch(err){
        console.error('Error deploying commands: ', err)
    }
}

// - Command Handler
bot.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = bot.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
});
