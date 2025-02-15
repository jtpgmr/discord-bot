

const { v4: uuidv4 } = require('uuid')
const { User } = require('../models');
const { Collection, PermissionsBitField, TextChannel, VoiceChannel } = require('discord.js');
const { setupEventHandlers, eventHandlers } = require('../events');
const {registerCommandHandlers} = require('../commands');


const ready = async ({ client }) => {
    const { tag: botName, id: discordId } = client.user
    
    let dbBotUser = await User.findOne({ where: { discordId }})

    if (!dbBotUser) {
        const dbBotId = uuidv4();
        
        dbBotUser = await User.create({
            id: dbBotId,
            createdBy: dbBotId,
            discordId,
            isBot: client.user.bot || true,
        })
    }
    
    // client.user._dbId = dbBotUser.dataValues.id
    dbBotUser = dbBotUser.dataValues
    
    console.log(`Logging in as ${botName}`);
    
    // update here to expand bot to multiple guilds
    for (const [, appGuild] of client.guilds.cache) {    

        client.channels.cache.forEach(channel => {
            if (!(channel instanceof TextChannel || channel instanceof VoiceChannel)) return
            
            const { guildId, members, name, permissionOverwrites, messages } = channel
            const everyonePermission = permissionOverwrites.cache.find(perm => perm.id === channel.guild.roles.everyone.id)
            
            if (!everyonePermission && permissionOverwrites.cache.size === 0)  {
                // this is a general/public channel with no special permissions
                return  
            } else if (!!everyonePermission && everyonePermission.deny.has(PermissionsBitField.Flags.ViewChannel)) {
                // this is a private channel, which requires the bot to be explicitly added to it by a guild user
                // bot can override this if they have Admin privileges
                return
            }
        })
        
        // const readyMessage = `Bot "${botName}" is now active and listening...`
        continue
    }
    
    // setup custom slash commands
    client.commands = new Collection();
    await registerCommandHandlers({ client  });

    // set webhook event handlers
    await setupEventHandlers({ client, eventHandlers });
    

};

module.exports = ready;