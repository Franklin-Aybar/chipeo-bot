const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Mensaje en la página web de Render
app.get('/', (req, res) => { 
    res.send('🔊 ¡Chipeo The Project activo las 24 horas! 🔊'); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`✅ ¡Bot de Chipeo The Project conectado como ${client.user.tag}!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
});

// LISTA DE COMANDOS
client.on('messageCreate', async (message) => {
    // Evita que el bot se responda a sí mismo
    if (message.author.bot) return;

    // Comando !ping para probar el audio
    if (message.content === '!ping') {
        return message.reply('🎛️ ¡El sistema de sonido de Chipeo The Project está ready y activo! 🔊🔥');
    }

    // 🔥 EL COMANDO PARA HABLAR POR EL BOT 🔥
    // Ejemplo de uso en el chat: !say Hola a todos
    if (message.content.startsWith('!say ')) {
        // Extrae el mensaje que escribiste después de !say
        const textoParaDecir = message.content.slice(5).trim();

        if (!textoParaDecir) return;

        try {
            // 1. Borra tu mensaje original para ocultar tu perfil
            await message.delete();
            
            // 2. El bot manda el mensaje con su propio perfil
            await message.channel.send(textoParaDecir);
        } catch (error) {
            console.log("Error al borrar o mandar mensaje:", error);
        }
    }
});

client.login(process.env.TOKEN);
