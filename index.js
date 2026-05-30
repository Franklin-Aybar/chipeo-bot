const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

app.get('/', (req, res) => { res.send('🔊 ¡Bot de Chipeo listo y activo 24/7! 🔊'); });
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`✅ ¡Bot conectado como ${client.user.tag}!`);
    client.user.setActivity('Chipeo World 🔊', { type: 3 });
});

client.on('messageCreate', (message) => {
    if (message.content === '!ping') message.reply('¡El sistema de audio está ready! 🎛️');
});

client.login(process.env.TOKEN);