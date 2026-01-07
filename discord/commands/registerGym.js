const {pgCreate} =require('../../postgres/create');

const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

//Command to Register a gym
module.exports = {
    data: new SlashCommandBuilder()
    .setName('register-gym')
    .setDescription('Register a gym to The DFC')
    .addStringOption(option =>
        option.setName('gym-name')
            .setDescription('Set Your Gym Name')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction){
        const gymName = interaction.options.getString('gym-name');
        const guildID = interaction.guildId
        const userID = interaction.user.id
        
        //check if user is allowed to create a gym on this server

        //if allowed, attempt to create 
        const results = await pgCreate('gym',{name:gymName, server:guildID, user:userID});
        if(!results.success){
            if(results.reason === 'ALREADY_EXISTS'){
                await interaction.reply({
                    content: `A gym already exists for this server created by <@${results.createdBy}> and is named: "${(results.name).toUpperCase()}"`,
                    withResponse:true
                })
            }
        }else{
            await interaction.reply({
                content: 'Gym has been created!',
                withResponse:true
            })
        }

        
    }
}
