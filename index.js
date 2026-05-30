const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();

// Lo que sale si entran al link de Render (Sencillo y con flow)
app.get('/', (req, res) => { 
    res.send('🔊 Chipeo The Project - El Bot de la L está activo 24/7 en la calle 🔊'); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages
    ]
});

// Registrar comandos slash (/)
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
                type: 3, 
                description: 'El código que le va\' a meter al chat',
                required: true,
            }
        ]
    },
    {
        name: 'redes',
        description: 'Las redes oficiales de Chipeo The Project y Los Reales',
    }
];

client.on('ready', async () => {
    console.log(`✅ ¡Bot-la-L activo en la calle!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
});

// Respuestas con la verdadera grasa
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // /ping
    if (commandName === 'ping') {
        await interaction.reply({ content: '🎛️ ¡El sistema de sonido está ready, nítido de voces y con los bajos rompiendo! 🔊🔥' });
    }

    // /say
    if (commandName === 'say') {
        const mensajeParaDecir = interaction.options.getString('mensaje');
        try {
            await interaction.reply({ content: 'Soltando la pauta...', ephemeral: true });
            await interaction.deleteReply();
            await interaction.channel.send(mensajeParaDecir);
        } catch (error) {
            console.error(error);
        }
    }

    // /redes
    if (commandName === 'redes') {
        const embedRedes = new EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('🔊 CHIPEO THE PROJECT - OFICIAL 🔊')
            .setDescription('Dándole el verdadero apoyo al movimiento. ¡Sigue la vuelta y actívate en las redes!')
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[¡Dale clic aquí para seguirnos y llegar a los 1k!](https://www.tiktok.com/)', inline: false },
                { name: '🎮 Team de Desarrollo', value: 'Suelto por **Los Reales Game de Computadora** con el flow de Bobi y Sandi.', inline: false }
            )
            .setFooter({ text: 'Bot-la-L • Controlando la comunidad 🔊', iconURL: client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embedRedes] });
    }
});

client.login(process.env.TOKEN);
