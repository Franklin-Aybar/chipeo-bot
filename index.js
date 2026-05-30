const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

// PÁGINA WEB BASE PARA EL DASHBOARD
app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chipeo The Project Bot | Web Oficial</title>
            <style>
                body { background-color: #0b0b0f; color: #ffffff; font-family: sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                .container { background: linear-gradient(145deg, #12121a, #1a1a26); border: 2px solid #a855f7; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 0 30px #a855f7; max-width: 600px; width: 90%; }
                h1 { color: #ffffff; text-shadow: 0 0 10px #a855f7; }
                .subtitle { color: #a855f7; font-size: 20px; font-weight: bold; margin-bottom: 25px; }
                .status-card { background-color: #1f1f2e; border-left: 5px solid #00ffcc; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .status-dot { width: 15px; height: 15px; background-color: #00ffcc; border-radius: 50%; box-shadow: 0 0 10px #00ffcc; }
                .btn-dashboard { background-color: #a855f7; color: white; border: none; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 0 15px #a855f7; text-decoration: none; display: inline-block; }
                .footer { margin-top: 30px; font-size: 15px; color: #73738c; border-top: 1px solid #2d2d3f; padding-top: 15px; }
                .footer span { color: #a855f7; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔊 CHIPIEO THE PROJECT BOT 🔊</h1>
                <p class="subtitle">El Bot de la L</p>
                <div class="status-card">
                    <span style="font-weight: bold;">Estado del Bot:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #00ffcc; font-weight: bold;">ONLINE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>
                <p style="color: #a3a3c2;">Panel de control base. Módulos de música y comunidad listos.</p>
                <a href="#" class="btn-dashboard">Iniciar Sesión con Discord</a>
                <div class="footer">Desarrollado con toda la grasa por el <span>Team Táctico</span></div>
            </div>
        </body>
        </html>
    `); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// CONFIGURACIÓN DE LAVALINK (Para saltar bloqueos de YouTube)
const Nodes = [{
    name: 'ChipeoNode',
    url: 'lava.link:80', // Servidor público estable de Lavalink
    auth: 'youshallnotpass',
    secure: false
}];

const kazagumo = new Kazagumo({
    plugins: [],
    defaultSearchEngine: 'youtube'
}, new Shoukaku(new Connectors.DiscordJS(client), Nodes));

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
        description: 'Busca y reproduce música de YouTube/Spotify/SoundCloud',
        options: [{ name: 'cancion', type: 3, description: 'Nombre o link del tema', required: true }]
    },
    { name: 'stop', description: 'Apaga el sistema de sonido por completo' }
];

client.on('ready', async () => {
    console.log(`✅ ¡Chipeo The Project Bot activo con Lavalink!`);
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
        await interaction.reply({ content: '🎛️ ¡El sistema de sonido está activo y sonando nítido! 🔊🔥' });
    }

    if (commandName === 'say') {
        const mensajeParaDecir = interaction.options.getString('mensaje');
        try {
            await interaction.reply({ content: 'Soltando la pauta...', ephemeral: true });
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
            .setFooter({ text: 'Chipeo The Project Bot 🔊' });
        await interaction.reply({ embeds: [embedRedes] });
    }

    // 🎵 COMANDO /play TOTALMENTE RENOVADO CON KAZAGUMO
    if (commandName === 'play') {
        const canalVoz = interaction.member.voice.channel;
        if (!canalVoz) return interaction.reply({ content: '⚠️ ¡Métete a un canal de voz primero, bro!', ephemeral: true });

        const query = interaction.options.getString('cancion');
        await interaction.reply({ content: `🔍 Buscando \`${query}\` en la base de datos completa...` });

        try {
            // Crear o jalar el reproductor del servidor
            const player = await kazagumo.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: canalVoz.id,
                deaf: true
            });

            // Buscar en todo el internet (YouTube, SoundCloud, Spotify links)
            const result = await kazagumo.search(query, { requester: interaction.user });
            if (!result.tracks.length) return interaction.editReply('❌ No encontré nada con ese nombre.');

            // Meter a la lista de reproducción
            player.queue.add(result.tracks[0]);
            if (!player.playing && !player.paused) player.play();

            const embedMusica = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🎶 SONANDO EN EL SISTEMA 🔊')
                .setDescription(`**[${result.tracks[0].title}](${result.tracks[0].uri})**`)
                .setThumbnail(result.tracks[0].thumbnail || null)
                .addFields({ name: '👤 Agregada por', value: `${interaction.user}`, inline: true })
                .setFooter({ text: 'Pauta musical del Team Táctico 🔥' });

            await interaction.editReply({ content: ' ', embeds: [embedMusica] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Error al procesar el audio del servidor.');
        }
    }

    if (commandName === 'stop') {
        const player = kazagumo.players.get(interaction.guild.id);
        if (player) {
            player.destroy();
            await interaction.reply('静 ¡Se apagó el sistema de sonido! Bot fuera del canal.');
        } else {
            await interaction.reply({ content: 'El bot no está tocando música ahora mismo.', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
