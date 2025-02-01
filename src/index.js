const ready = require('./events/ready');

const { Collection, PermissionsBitField, TextChannel, VoiceChannel } = require('discord.js');

// const { setupEventHandlers, eventHandlers } = require('./events');
// const { registerCommandHandlers, commandHandlers } = require('./commands');
const { discordCredentials: { DISCORD_BOT_TOKEN } } = require('./config');
const { default: discord, db } = require('./clients');
const { Events } = require('discord.js');


(async () => {
    // initialize bot
    await discord.login(DISCORD_BOT_TOKEN)
    
    
    // const { tag: botName, id: discordId } = discord.user
    
    // let dbBotUser = await User.findOne({ where: { discordId }})

    // if (!dbBotUser) {
    //     const dbBotId = uuidv4();
        
    //     dbBotUser = await User.create({
    //         id: dbBotId,
    //         createdBy: dbBotId,
    //         discordId,
    //         isBot: discord.user.bot || true,
    //     })
    // }
    
    // discord.user._dbId = dbBotUser.dataValues.id
    
    discord.once(Events.ClientReady, async () => ready({ client: discord }))

    // console.log(discord.isReady())
    // // setup custom slash commands
    // discord.commands = new Collection();
    // await registerCommandHandlers({ client: discord, commandHandlers });

    
    // // set webhook event handlers
    // await setupEventHandlers({ client: discord, eventHandlers });

})();