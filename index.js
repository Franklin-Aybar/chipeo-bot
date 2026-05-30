const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl'); // Librería dura para jalar música de YouTube/SoundCloud
const express = require('express');
const app = express();

// LA PÁGINA WEB 
app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chipeo The Project Bot | Web Oficial</title>
            <style>
                body { background-color: #0b0b0f; color: #ffffff; font-family: sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                .container { background: linear-gradient(145deg, #12121a, #1a1a26); border: 2px solid #a855f7; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 0 30px #a855f7; max-width: 600px; width: 90%; }
                h1 { color: #ffffff; text-shadow: 0 0 10px #a855f7; }
                .subtitle { color: #a855f7; font-size: 20px; font-weight: bold; }
                .status-card { background-color: #1f1f2e; border-left: 5px solid #00ffcc; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
                .status-dot { width: 15px; height: 15px; background-color: #00ffcc; border-radius: 50%; box-shadow: 0 0 10px #00ffcc; }
                .footer { margin-top: 30px; font-size: 15px; color: #73738c; border-top: 1px solid #2d2d3f; padding-top: 15px; }
                .footer span { color: #a855f7; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔊 CHIPIEO THE PROJECT BOT 🔊</h1>
                <p class="subtitle">El Bot de la L</p>
                <div class="status-card">
                    <span>Estado del Bot:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #00ffcc; font-weight: bold;">ONLINE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>
                <p style="color: #a3a3c2;">Bot 24/7.</p>
                <div class="footer">Desarrollado con toda la grasa por el <span>Team Táctico</span></div>
            </div>
        </body>
        </html>
    `); 
});
app.listen(process.env.PORT || 3000);

// IMPORTANTE: Le agregamos "GuildVoiceStates" para que el bot pueda entrar a los canales de voz
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Crear el reproductor de música global
const player = createAudioPlayer();

// Comandos Slash (/) incluyendo /play y /stop
const commands = [
    { name: 'ping', description: 'Prueba si el sistema de sonido del bot está ready' },
    {
        name: 'say',
        description: 'Manda un mensaje a través del bot ocultando tu perfil',
        options: [{ name: 'mensaje', type: 3, description: 'El código que le va\' a meter al chat', required: true }]
    },
    { name: 'redes', description: 'Las redes oficiales de Chipeo The Project' },
    {
        name: 'play',
        description: 'Pon a sonar un chipeo o canción en el canal de voz',
        options: [{ name: 'cancion', type: 3, description: 'Nombre o link de YouTube de la canción', required: true }]
    },
    { name: 'stop', description: 'Saca al bot del canal de voz y para la música' }
];

client.on('ready', async () => {
    console.log(`✅ ¡Chipeo The Project Bot activo`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) { console.error(error); }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply({ content: '🎛️  **Chipeo The Project** está ready  🔊🔥' });
    }

    if (commandName === 'say') {
        const mensajeParaDecir = interaction.options.getString('mensaje');
        try {
            await interaction.reply({ content: 'Soltando la pauta táctica...', ephemeral: true });
            await interaction.deleteReply();
            await interaction.channel.send(mensajeParaDecir);
        } catch (error) { console.error(error); }
    }

    if (commandName === 'redes') {
        const embedRedes = new EmbedBuilder()
            .setColor('#a855f7') 
            .setTitle('🔊 CHIPEO THE PROJECT - OFICIAL 🔊')
            .setDescription('¡Sigue la vuelta y actívate con el coro!')
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[¡Dale clic aquí para seguirnos!](https://www.tiktok.com/)', inline: false },
                { name: '👑 Creadores', value: 'Desarrollado por el **Team Táctico**.', inline: false }
            )
            .setFooter({ text: 'Chipeo The Project Bot • Controlando el bloque 🔊' });
        await interaction.reply({ embeds: [embedRedes] });
    }

    // 🎵 COMANDO /play (IGUAL A JOCKEY)
    if (commandName === 'play') {
        const canalVoz = interaction.member.voice.channel;
        
        // Verificar si el usuario está en un canal de voz
        if (!canalVoz) {
            return interaction.reply({ content: '⚠️ ¡Tienes que meterte a un canal de voz primero para armar el chipeo!', ephemeral: true });
        }

        const busqueda = interaction.options.getString('cancion');
        await interaction.reply({ content: `🔍 Buscando \`${busqueda}\` para poner los bajos a romper...` });

        try {
            // Conectar el bot al canal de voz
            const connection = joinVoiceChannel({
                channelId: canalVoz.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Buscar el audio en YouTube
            let yt_info = await play.search(busqueda, { limit: 1 });
            if (yt_info.length === 0) return interaction.editReply('❌ No encontré esa canción, bro.');

            let stream = await play.stream(yt_info[0].url);
            let resource = createAudioResource(stream.stream, { inputType: stream.type });

            // Reproducir
            player.play(resource);
            connection.subscribe(player);

            // Mensaje elegante estilo Jockey
            const embedMusica = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🎶 SONANDO EN EL SISTEMA 🔊')
                .setDescription(`**[${yt_info[0].title}](${yt_info[0].url})**`)
                .setThumbnail(yt_info[0].thumbnails[0].url)
                .addFields({ name: '⏱️ Duración', value: yt_info[0].durationRaw, inline: true })
                .setFooter({ text: 'Pauta musical del Team Táctico 🔥' });

            await interaction.editReply({ content: ' ', embeds: [embedMusica] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Hubo un error al intentar poner la música.');
        }
    }

    // 🛑 COMANDO /stop
    if (commandName === 'stop') {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel?.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        if (connection) {
            player.stop();
            connection.destroy();
            await interaction.reply('🔇 ¡Se apagó el sistema de sonido! El bot salió del canal.');
        } else {
            await interaction.reply({ content: 'El bot no está en ningún canal de voz ahora mismo.', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
