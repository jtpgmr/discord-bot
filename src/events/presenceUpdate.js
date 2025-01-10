const presenceUpdate = ({ client, ...args }) => {
    const [oldPresence, newPresence] = Object.values(args)

    // statuses: online, offline, idle, dnd (do not disturb)
    const { member, status } = newPresence;
    
    let statusMessage = ''
    if (!oldPresence) {
        statusMessage = `Status for user ${member.user.tag} recorded for first time since bot was active. They are now ${status}.`
    } else {
        statusMessage = `${member.user.tag} updated status from ${oldPresence.status} to ${status}`
    }
    
    // await client.activityChannel.send(statusMessage)
}

module.exports = presenceUpdate;

