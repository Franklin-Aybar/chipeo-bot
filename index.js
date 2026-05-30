const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Mensaje en la página web de Render
app.get('/', (req, res) => { 
    res.send('🔊 ¡Chipeo The Project activo las 24 horas! 🔊'); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`✅ ¡Bot de Chipeo The Project conectado como ${client.user.tag}!`);
    
    // Estado en Discord: Dirá "Viendo Chipeo The Project 🔊" en el perfil del bot
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
});

// Mensaje cuando la gente use el comando !ping en tu servidor
client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.reply('🎛️ ¡El sistema de sonido de Chipeo The Project está ready y activo! 🔊🔥');
    }
});

client.login(process.env.TOKEN);
