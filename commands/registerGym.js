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
        let botReply = `Your Gym has been registered as ${gymName}`

        //check if there is already a registered gym from this guild.
            //set response to gym already active and gym name
            //set response to gym created if no active gym

        //if no active gym send gym to db

        //respond to user and confirm gym creation.
        await interaction.reply({
            content: botReply,
            withResponse: true
        })
    }
}
