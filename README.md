## Steps:

### `Installation` Tab
- These are steps for creating your bot application, and add them to a server with specified permissions

1. Create bot application at https://discord.com/developers/applications
    - your bot will be given an `Application ID` (found in *General Information* tab)
    - urls connected to your application will be in the following format: https://discord.com/developers/applications/<application_id>/
    
2. Within the *Installation* tab, make sure your application has the following **User** and **Guild** Install scopes & permissions:
    - User Install:  
        - Scopes 
            - `applications.commands` (allows use of slash commands `/` in chat to interact with bots)
    - Guild Install:  
        - Scopes 
            - `applications.commands` 
            - `bot` (allows use of app as bot user in guild)
        - Permissions
            - `Send Messages`
            - `View Channels`
        
3. Click on the `Install Link` with the **Discord Provided Link** option selected, and copy-paste the link into the browser
    - this will ask you to add your app to the server as a bot, with the permissions found the in the `Guild Install` permissions
    
    
### `Bot` Tab
- Once your bot is set up and in the server, this tab is to set up your bot's intent and get the bot token

4. Get a token or press the `Reset Token` button, and save this value in the **.env** file as `DISCORD_BOT_TOKEN`
5. Make sure the following tabs are toggled as `on`:
    - Public Bot
    - Presence Intent
    - Server Members Intent