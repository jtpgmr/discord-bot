const presenceUpdate = ({ client, ...presenceStatuses }) => {
    const oldPresence = presenceStatuses['0']
    const newPresence = presenceStatuses['1']

    const member = newPresence.member;
    const status = newPresence.status; // online, offline, idle, dnd (do not disturb)
    
    let statusMessage = ''
    if (oldPresence === null) {
        statusMessage += `Status for user ${member.user.tag} recorded for first time since bot was active. They are now ${status}.`
    } else {
        statusMessage += `${member.user.tag} updated status from ${oldPresence.status} to ${status}`
    }
    
    
    client.activityChannel.send(statusMessage)
}

export default presenceUpdate;