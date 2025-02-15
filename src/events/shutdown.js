const shutdown = async ({ client }) => {
    console.log('Shutting down...');
    
    console.log(client.isReady())
    try {
        await client.user.setPresence({ status: 'invisible' });
        await client.destroy()

    } catch (error) {
        console.error('Failed to set presence:', error);
    }

    process.exit(0);
}

module.exports = shutdown;

