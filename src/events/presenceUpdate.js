const presenceUpdate = ({ client, ...presenceStatuses }) => {
    const [oldPresence, newPresence] = Object.values(presenceStatuses)

    // statuses: online, offline, idle, dnd (do not disturb)
    const {member, status } = newPresence;
    
    let statusMessage = ''
    if (!oldPresence) {
        statusMessage = `Status for user ${member.user.tag} recorded for first time since bot was active. They are now ${status}.`
    } else {
        statusMessage = `${member.user.tag} updated status from ${oldPresence.status} to ${status}`
    }
    
    client.activityChannel.send(statusMessage)
}

module.exports = presenceUpdate;

