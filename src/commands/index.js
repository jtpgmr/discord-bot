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
	
	// codedCommands = []
	
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

	if (unregisteredCommandChanges.length === 0) {
		console.log(`Application slash command configurations have not changed for ${dbServer.name} (${dbServer.platformId})`);
		
		return
	}

	// TODO: Save commands in DB and only execute code below if a change is identified
	// register the slash commands to the API
	try {			
		await client.rest.put(
			Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, dbServer.platformId),
			{ body: codedCommands },
		);
	} catch (err) {
		console.error(err);
	}
	
	try {
		const dbCommands = await SubCommand.findAll({ where: { serverId: dbServer.id }, raw: true })
		
		for (const uC of unregisteredCommandChanges) {
			const existingCommand = dbCommands.find(c => c.name === uC.name)
			
			const now = new Date()

			if (!existingCommand) {
				const newDbCommand = await SubCommand.create({
					...uC,
					id: uuidv4(),
					serverId: dbServer.id, 
					createdAt: now,
					createdBy: dbBotUser.id,
				})
				
				for (const commandOpt of (uC.options || [])) {

					let newSubCommandGroup = null
					
					if (commandOpt.type === subCommandOptionTypes.SUB_COMMAND_GROUP) {
						console.log(555, commandOpt)
						newSubCommandGroup = await SubCommandGroup.create({
							...commandOpt,
							id: uuidv4(),
							subCommandId: newDbCommand.id,
							createdAt: now,
							createdBy: dbBotUser.id,
						})
					} 
					
					if (!!newSubCommandGroup) {
						for (const groupCommand of (commandOpt.options || [])) {
							const newDbGroupCommand = await SubCommandGroupCommand.create({
								name: groupCommand.name,
								description: groupCommand.description,
								id: uuidv4(),
								subCommandGroupId: newSubCommandGroup.id,
								createdAt: now,
								createdBy: dbBotUser.id,
							})
							
							for (const groupCommandOptions of (groupCommand.options || [])) {
								await SubCommandOption.create({
									...groupCommandOptions,
									id: uuidv4(),
									subCommandId: newDbCommand.id,
									subCommandGroupCommandId: newDbGroupCommand.id,
									createdAt: now,
									createdBy: dbBotUser.id,
								})
							}

						}
						
					} else {
						for (const opt of (commandOpt.options || [])) {
							await SubCommandOption.create({
								...opt,
								id: uuidv4(),
								subCommandId: newDbCommand.id,
								createdAt: now,
								createdBy: dbBotUser.id,
							})
						}
					}
				}
			} else {
				const fieldsToExclude = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'serialId',]

				fieldsToExclude.forEach(f => delete existingCommand[f] )
				if (!compareValues({ ...existingCommand, id: undefined, serverId: undefined, options: undefined }, { ...uC, options: undefined })) {
					await SubCommand.update({
						...uC, 
						updatedAt: now,
						updatedBy: dbBotUser.id,
					}, {
						where: {
							name: existingCommand.name,
							serverId: existingCommand.serverId
						}
					})
				}

			}
		}

		// TODO: Workflows for updating subcommand groups and options
		// const dbSubGroupCommands = await SubCommandGroup.findAll({ where: { subCommandId: dbCommands.map(c => c.id) }})
		
		// const dbCommandOptions = await SubCommandGroup.findAll({ where: { subCommandId: dbCommands.map(c => c.id) }})
		

	} catch (err) {
		console.error(err);
	}
	
	console.log(`Successfully reloaded application "/" commands for ${dbServer.name} (${dbServer.platformId})`);
};

module.exports = {
	registerCommandHandlers,
};