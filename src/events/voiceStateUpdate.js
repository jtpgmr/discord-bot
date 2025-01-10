// presence will be `null` if user is not in voice channel
const voiceStateUpdate = ({ client, ...args }) => {
    const [oldPresence, newPresence] = Object.values(args)
    
    console.log(oldPresence.channel)
    console.log(newPresence.channel)
}

module.exports = voiceStateUpdate;

