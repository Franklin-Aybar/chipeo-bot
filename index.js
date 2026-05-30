const { Client, GatewayIntentBits, REST, Routes, Slot } = require('discord.js');
const express = require('express');
const app = express();

// Mantener vivo en Render
app.get('/', (req, res) => { 
    res.send('🔊 ¡Chipeo The Project activo las 24 horas con Comandos Slash! 🔊'); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages
    ]
});

// Definir los comandos / que va a tener el bot
const commands = [
    {
        name: 'ping',
        description: 'Prueba si el sistema de sonido del bot está ready',
    },
    {
        name: 'say',
        description: 'Manda un mensaje a través del bot ocultando tu perfil',
        options: [
            {
                name: 'mensaje',
                type: 3, // Tipo 3 significa Texto (String)
                description: 'El texto que quieres que el bot diga',
                required: true,
            }
        ]
    }
];

client.on('ready', async () => {
    console.log(`✅ ¡Bot conectado como ${client.user.tag}!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 

    // Registrar los comandos automáticamente en Discord al encender
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        console.log('⏳ Registrando comandos slash (/) en Discord...');
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        
        console.log('✅ ¡Comandos slash (/) registrados con éxito en todos los servidores!');
    } catch (error) {
        console.error('Error registrando comandos:', error);
    }
});

// ESCUCHAR LOS COMANDOS INTERACTIVOS (/)
client.on('interactionCreate', async (interaction) => {
    // Si no es un comando de barra diagonal, no hagas nada
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // 🎛️ COMANDO /ping
    if (commandName === 'ping') {
        await interaction.reply({ content: '🎛️ ¡El sistema de sonido de Chipeo The Project está ready y activo con comandos slash! 🔊🔥' });
    }

    // 🗣️ COMANDO /say
    if (commandName === 'say') {
        const mensajeParaDecir = interaction.options.getString('mensaje');

        try {
            // Mandamos una respuesta oculta (ephemeral) al que usó el comando para que no de error
            await interaction.reply({ content: 'Manding mensaje...', ephemeral: true });
            // Borramos esa respuesta oculta rápido para no dejar rastro
            await interaction.deleteReply();

            // El bot manda el mensaje limpio al canal con su propio perfil
            await interaction.channel.send(mensajeParaDecir);
        } catch (error) {
            console.error('Error en comando /say:', error);
        }
    }
});

client.login(process.env.TOKEN);
