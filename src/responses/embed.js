const { Colors } = require("discord.js");

const createMessageEmbed = ({ 
    title, 
    fields = [], 
    description = null, 
    color = Colors.Default, 
    author = {}, 
    url = null, 
    thumbnail = {}, 
    image = {}, 
    timestamp = new Date(), 
    footer = {} 
}) => ({ title, fields, description, color, author, url, thumbnail, image, timestamp, footer });

module.exports = {
    createMessageEmbed
}