const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();

// RUTA PRINCIPAL (La base para el futuro Dashboard Web)
app.get('/', (req, res) => { 
    res.send(`
        <div style="background-color: #0f0f13; color: #00ffcc; text-align: center; padding: 50px; font-family: sans-serif; border: 2px solid #00ffcc; border-radius: 10px; margin: 100px auto; max-width: 500px; box-shadow: 0 0 20px #00ffcc;">
            <h1 style="margin-bottom: 10px;">🔊 Chipeo The Project 🔊</h1>
            <p style="color: #ffffff; font-size: 18px;">El bot está activo 24/7 con Comandos Slash</p>
            <div style="background: #1a1a24; padding: 10px; border-radius: 5px; display: inline-block; color: #ff007f; font-weight: bold;">
                Dashboard Base Configurada 🖥️
            </div>
        </div>
    `); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages
    ]
});

// LISTA DE COMANDOS SLASH (/)
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
                description: 'El texto que quieres que el bot diga',
                required: true,
            }
        ]
    },
    {
        name: 'redes',
        description: 'Muestra las redes oficiales de Chipeo The Project y Los Reales Game',
    }
];

client.on('ready', async () => {
    console.log(`✅ ¡Bot conectado como ${client.user.tag}!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        console.log('⏳ Registrando comandos slash (/) en Discord...');
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        
        console.log('✅ ¡Comandos slash (/) registrados con éxito!');
    } catch (error) {
        console.error('Error registrando comandos:', error);
    }
});

// RESPONDER A LOS COMANDOS
client.on('interactionCreate', async (interaction) => {
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
            await interaction.reply({ content: 'Enviando mensaje...', ephemeral: true });
            await interaction.deleteReply();
            await interaction.channel.send(mensajeParaDecir);
        } catch (error) {
            console.error('Error en comando /say:', error);
        }
    }

    // 📈 COMANDO /redes (Con diseño Embed nítido)
    if (commandName === 'redes') {
        const embedRedes = new EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('🔊 REDES OFICIALES - CHIPEO THE PROJECT 🔊')
            .setDescription('¡Apoya el proyecto y mantente al tanto de todas las actualizaciones del juego y la comunidad!')
            .addFields(
                { name: '🔥 TikTok Oficial', value: '[¡Síguenos en TikTok para llegar a los 1k seguidores!](https://www.tiktok.com/)', inline: false },
                { name: '🎮 Comunidad & Juegos', value: 'Desarrollado con el verdadero flow por **Los Reales Game de Computadora**.', inline: false }
            )
            .setFooter({ text: 'Chipeo The Project Bot • Sistema Listo', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embedRedes] });
    }
});

client.login(process.env.TOKEN);
