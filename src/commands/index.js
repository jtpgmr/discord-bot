// TODO: Modularize `registerCommandHandlers` further and re-organize file
const { Routes } = require('discord.js');
const { discordCreds: { DISCORD_BOT_CLIENT_ID } } = require('../config');
const { constants: { commandTypes } } = require('../utils');
const { Collection } = require('discord.js');
const fs = require('fs')
const path = require('path')
const { SubCommand, SubCommandGroup, SubCommandGroupCommand, SubCommandOption } = require('../models')
const { v4: uuidv4 } = require('uuid')
const { subCommandOptionTypes } = require('../utils/constants')

class SlashCommandData {
	constructor({ name, description, type, options, nsfw = false, disabled = false, callbackSource = null }) {
		this.name = name
		this.description = description
		this.type = type
		this.nsfw = nsfw
		this.options = options
		this.disabled = disabled
		this.callbackSource = callbackSource
	}
}

class SlashCommandDataOption {
	constructor({ name, description, type, options, required, choices = [], disabled = false }) {
		this.name = name
		this.description = description
		this.type = type
		this.required = required
		this.options = options
		this.choices = choices
		this.disabled = disabled
	}
}

const compareValues = (value1, value2) => {
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) return false;
        return value1.every((val, index) => compareValues(val, value2[index]));
    }

    if (value1 && value2 && typeof value1 === 'object' && typeof value2 === 'object') {
        const keys1 = Object.keys(value1).filter(key => value1[key] !== undefined)
        const keys2 = Object.keys(value2).filter(key => value2[key] !== undefined)
		
        if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) return false
        return keys1.every(key => compareValues(value1[key], value2[key]));
    }

    return value1 === value2;
}

const recursivelyAppendOptions = (options) => {
    if (!Array.isArray(options) || options.length === 0) return undefined;

    return options.map(opt => new SlashCommandDataOption({ ...opt, options: recursivelyAppendOptions(opt.options) }));
}

const processSubCommandGroupCommands = async ({ dbBotUser, subCommandId, subCommandGroupId, groupCommands }) => {
    const existingGroupCommands = await SubCommandGroupCommand.findAll({
        where: { subCommandGroupId },
    });

    const existingGroupCommandMap = new Map(existingGroupCommands.map(cmd => [cmd.name, cmd]));
    const incomingGroupCommandNames = new Set(groupCommands.map(opt => opt.name));

    const groupCommandsToDelete = existingGroupCommands.filter(cmd => !incomingGroupCommandNames.has(cmd.name))
    if (groupCommandsToDelete.length > 0) {
		const groupCommandIds = groupCommandsToDelete.map(cmd => cmd.id)
		await SubCommandOption.destroy({ where: { subCommandGroupCommandId: groupCommandIds }})
        await SubCommandGroupCommand.destroy({ where: { id: groupCommandIds } })
    }

    await Promise.all(groupCommands.map(async groupCommand => {
		let dbGroupCommand = existingGroupCommandMap.get(groupCommand.name);

		if (!!dbGroupCommand) {
			if (!compareValues(dbGroupCommand, groupCommand)) {
				await SubCommandGroupCommand.update({
						description: groupCommand.description,
						updatedAt: new Date(),
						updatedBy: dbBotUser.id,
					},
					{ where: { id: dbGroupCommand.id } }
				);
			}
		} else {
			dbGroupCommand = await SubCommandGroupCommand.create({
				...groupCommand,
				id: uuidv4(),
				subCommandGroupId,
				createdAt: new Date(),
				createdBy: dbBotUser.id,
			});
		}
		
		await Promise.all(
			(groupCommand.options || []).map(async commandOpt => {
				if (commandOpt.type === subCommandOptionTypes.SUB_COMMAND_GROUP) {
					throw new Error()
				} else {
					await processSubCommandOptions({ dbBotUser, subCommandId: subCommandId, subCommandGroupCommandId: dbGroupCommand.id, options: ([commandOpt] || []) });
				}
			})
		);
    }));
};

const processSubCommandOptions = async ({ dbBotUser, subCommandId, subCommandGroupCommandId = null, options }) => {
    const existingOptions = await SubCommandOption.findAll({ where: { subCommandId, subCommandGroupCommandId } })

    const optionMap = new Map(existingOptions.map(opt => [opt.name, opt]));
    const incomingOptionNames = new Set(options.map(opt => opt.name));

    const optionsToDelete = existingOptions.filter(opt => !incomingOptionNames.has(opt.name))
	
    if (optionsToDelete.length > 0) {
        await SubCommandOption.destroy({ where: { id: optionsToDelete.map(opt => opt.id) } })
    }

    await Promise.all(options.map(async (opt) => {
		const existingOption = optionMap.get(opt.name);

		if (existingOption) {
			if (!compareValues(existingOption, opt)) {
				await SubCommandOption.update({
						...opt,
						updatedAt: new Date(),
						updatedBy: dbBotUser.id,
					},
					{ where: { id: existingOption.id } }
				);
			}
		} else {
			await SubCommandOption.create({
				...opt,
				id: uuidv4(),
				subCommandId,
				subCommandGroupCommandId,
				createdAt: new Date(),
				createdBy: dbBotUser.id,
			});
		}
    }))
};

const processSubCommandGroups = async ({ dbBotUser, subCommandId, groups }) => {
    const existingGroups = await SubCommandGroup.findAll({ where: { subCommandId } })

    const existingGroupMap = new Map(existingGroups.map(grp => [grp.name, grp]));
    const incomingGroupNames = new Set(groups.map(grp => grp.name));

    const groupsToDelete = existingGroups.filter(grp => !incomingGroupNames.has(grp.name));
    if (groupsToDelete.length > 0) {
        await SubCommandGroup.destroy({
            where: { id: groupsToDelete.map(grp => grp.id) },
        });
    }

    await Promise.all(groups.map(async group => {
		let dbGroup = existingGroupMap.get(group.name);
		
		if (dbGroup) {
			if (!compareValues(dbGroup, group)) {
				await SubCommandGroup.update({
						description: group.description,
						updatedAt: new Date(),
						updatedBy: dbBotUser.id,
					},
					{ where: { id: dbGroup.id } }
				);
			}
		} else {
			dbGroup = await SubCommandGroup.create({
				...group,
				id: uuidv4(),
				subCommandId,
				createdAt: new Date(),
				createdBy: dbBotUser.id,
			});

        }
		
		await processSubCommandGroupCommands({ dbBotUser, subCommandId, subCommandGroupId: dbGroup.id,  groupCommands: (group.options || []) });
	}
	
	)
		
    );
};

const fieldsToExclude = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'serialId'];

const processSubCommands = async ({ dbBotUser, dbServer, dbCommands, unregisteredCommandChanges }) => {
    try {
        const dbCommandsMap = new Map(dbCommands.map(cmd => [cmd.name, cmd]));

        await Promise.all(
            unregisteredCommandChanges.map(async uC => {
                uC.serverId = dbServer.id;
                const existingCommand = dbCommandsMap.get(uC.name);
                const now = new Date();
					
                if (!existingCommand) {
                    const newDbCommand = await SubCommand.create({
                        ...uC,
                        id: uuidv4(),
                        serverId: dbServer.id,
                        createdAt: now,
                        createdBy: dbBotUser.id,
                    });
					
                    await Promise.all(
                        (uC.options || []).map(async commandOpt => {
                            if (commandOpt.type === subCommandOptionTypes.SUB_COMMAND_GROUP) {
                                await processSubCommandGroups({ dbBotUser, subCommandId: newDbCommand.id, groups: [commandOpt]});
                            } else {
                                await processSubCommandOptions({dbBotUser, subCommandId: newDbCommand.id, subCommandGroupCommandId: null, options: [commandOpt]});
                            }
                        })
                    );
                } else {
                    fieldsToExclude.forEach(f => delete existingCommand[f]);

                    if (!compareValues({ ...existingCommand, id: undefined, serverId: undefined }, { ...uC, options: undefined })) {
                        await SubCommand.update(
                            {
                                ...uC,
                                updatedAt: now,
                                updatedBy: dbBotUser.id,
                            },
                            {
                                where: {
                                    name: existingCommand.name,
                                    serverId: existingCommand.serverId,
                                },
                            }
                        );
                    }

                    await Promise.all(
                        (uC.options || []).map(async commandOpt => {
                            if (commandOpt.type === subCommandOptionTypes.SUB_COMMAND_GROUP) {
                                await processSubCommandGroups({ dbBotUser, subCommandId: existingCommand.id, groups: [commandOpt] });
                            } else {
                                await processSubCommandOptions({ dbBotUser, subCommandId: existingCommand.id, subCommandGroupCommandId: null, options: ([commandOpt] || []) });
                            }
                        })
                    );
                }
            })
        );

        console.log("Processing complete.");
    } catch (err) {
        console.error("Error processing subcommands:", err);
    }
};

const registerCommandHandlers = async ({ client, dbServer, dbBotUser }) => {
	const commandHandlers = {}
	const commands = new Collection()
	
	fs.readdirSync(__dirname).forEach(file => {
		const [fileName, ext] = file.split('.')
		
		if (fileName === 'index' || fileName.includes('_')) return
		
		const fullPath = path.join(__dirname, file);
		
        if (fs.statSync(fullPath).isFile() && ext === 'js') {
            const handler = require(fullPath)
			
			try {
				commandHandlers[handler.data.name] = handler
			} catch (err) {
				console.warn(`Error occured when applying command handler at ${fullPath}`)
				return
			}
        }
    });
	
	// add command handlers to bot client
    for (const [key, command] of Object.entries(commandHandlers)) {
        if ('data' in command && 'execute' in command) {
			const { data, execute } = command
			commands.set(data.name, { data, execute });
		} else {
			console.warn(`[WARNING] Command handler with the key "${key}" is missing a required "data" or "execute" property.`);
		}
    }
	
	console.log(`Checking if slash commands (/) commands have changed for ${dbServer.name} (${dbServer.platformId}).`);
			
	// current command configuration within the code
	let codedCommands = Array.from(commands, ([key, value]) => (
		new SlashCommandData({ 
			...value.data, 
			name: key, 
			type: commandTypes.CHAT_INPUT, 
			options: recursivelyAppendOptions(value.data.options)
		})
	))

	const dbCommands = await SubCommand.findAll({ where: { serverId: dbServer.id }, raw: true });
	
	if (commands.size === 0 || codedCommands.length === 0) {
		console.log(`No commands received in commands set. Clearing commands...`);
		try {			
			await client.rest.put(
				Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, dbServer.platformId),
				{ body: [] },
			);
		} catch (error) {
			console.error(error);
		}
		
		const dbCommandIds = dbCommands.map(c => c.id)
		const dbCommandGroups = await SubCommandGroup.findAll({ where: { subCommandId: dbCommandIds }})
		const dbCommandGroupIds = dbCommandGroups.map(g => g.id)

		
		await SubCommandOption.destroy({ where: { subCommandId: dbCommandIds }})
		await SubCommandGroupCommand.destroy({ where: { subCommandGroupId: dbCommandGroupIds }})
		await SubCommandGroup.destroy({ where: { id: dbCommandGroupIds }})
		await SubCommand.destroy({ where: { id: dbCommandIds }})

		
		return
	}
	
	// commands currently configured on Discord's API
	let existingCommands = await client.rest.get(
		Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, dbServer.platformId),
	);
	
	// convert commands on Discord's API to custom class object
	existingCommands = existingCommands.map(ec => new SlashCommandData({ ...ec, options: recursivelyAppendOptions(ec.options) }))
	

	
	const unregisteredCommandChanges = codedCommands.map(cC => {
		if (existingCommands.filter(eC => compareValues(eC, cC)).length === 0) return cC
	}).filter(Boolean)
	
	// const dbCommands = await SubCommand.findAll({ where: { serverId: dbServer.id }, raw: true });

	if (unregisteredCommandChanges.length === 0) {
		console.log(`Application slash command configurations have not changed for ${dbServer.name} (${dbServer.platformId})`);
		
		if (unregisteredCommandChanges.length !== codedCommands.length) {
			await processSubCommands({ dbBotUser, dbServer, dbCommands, unregisteredCommandChanges: codedCommands })
		}

		return
	}

	try {			
		await client.rest.put(
			Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, dbServer.platformId),
			{ body: codedCommands },
		);
	} catch (err) {
		console.error(err);
	}
	
	await processSubCommands({ dbBotUser, dbServer, dbCommands, unregisteredCommandChanges })
};

module.exports = {
	registerCommandHandlers,
};



