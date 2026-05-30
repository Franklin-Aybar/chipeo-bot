const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

// LA PÁGINA WEB EXACTA A TU CAPTURA (Brillo Neón y los créditos de tu empresa)
app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chipeo The Project Bot | Web Oficial</title>
            <style>
                body {
                    background-color: #050508;
                    color: #ffffff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .container {
                    background-color: #12121a;
                    border: 2px solid #00ffcc;
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 0 35px #00ffcc, inset 0 0 15px rgba(0, 255, 204, 0.1);
                    max-width: 700px;
                    width: 90%;
                }
                .title-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 5px;
                }
                h1 {
                    color: #00ffcc;
                    font-size: 36px;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px rgba(0, 255, 204, 0.6);
                    font-weight: 800;
                }
                .subtitle {
                    color: #ff007f;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 5px;
                    margin-bottom: 35px;
                }
                .status-card {
                    background-color: #171724;
                    border-left: 5px solid #00ffcc;
                    padding: 18px 25px;
                    border-radius: 10px;
                    margin: 25px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .status-label {
                    font-size: 20px;
                    font-weight: bold;
                    color: #ffffff;
                }
                .status-value {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .status-text {
                    color: #00ffcc;
                    font-weight: bold;
                    font-size: 18px;
                    letter-spacing: 1px;
                }
                .status-dot {
                    width: 16px;
                    height: 16px;
                    background-color: #00ffcc;
                    border-radius: 50%;
                    box-shadow: 0 0 12px #00ffcc;
                    animation: pulse 1.5s infinite;
                }
                .description {
                    color: #8f8fbc;
                    line-height: 1.7;
                    font-size: 16px;
                    margin: 25px auto;
                    max-width: 580px;
                }
                .divider {
                    border: none;
                    border-top: 1px solid #1f1f30;
                    margin-top: 30px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 14px;
                    color: #5c5c7d;
                }
                .footer span {
                    color: #00ffcc;
                    font-weight: bold;
                }
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.7; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="title-container">
                    <span style="font-size: 32px;">🔊</span>
                    <h1>BOT-LA-L</h1>
                    <span style="font-size: 32px;">🔊</span>
                </div>
                <div class="subtitle">Chipeo The Project Bot</div>
                
                <div class="status-card">
                    <span class="status-label">Estado del Bot:</span>
                    <div class="status-value">
                        <span class="status-text">ONLINE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>

                <p class="description">
                    Este es el panel principal de control para la comunidad. El bot se encuentra encendido las 24 horas controlando los comandos y manteniendo los sistemas de sonido ready.
                </p>

                <hr class="divider">

                <div class="footer">
                    Desarrollado por <span>Los Reales Game de Computadora</span>
                </div>
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
        GatewayIntentBits.GuildVoiceStates
    ]
});

// NODOS LAVALINK PÚBLICOS
const Nodes = [{
    name: 'ChipeoNode',
    url: 'lava.link:80', 
    auth: 'youshallnotpass',
    secure: false
}];

// Arreglo del conector para evitar el error de "connector.set" de Shoukaku v4
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);
const kazagumo = new Kazagumo({
    plugins: [],
    defaultSearchEngine: 'youtube'
}, shoukaku);

const commands = [
    { name: 'ping', description: 'Prueba si el sistema de sonido del bot está ready' },
    {
        name: 'say',
        description: 'Manda un mensaje a través del bot ocultando tu perfil',
        options: [{ name: 'mensaje', type: 3, description: 'El texto que va a decir el bot', required: true }]
    },
    { name: 'redes', description: 'Las redes oficiales de Chipeo The Project' },
    {
        name: 'play',
        description: 'Busca y reproduce música de YouTube/Spotify/SoundCloud (Jockey Style)',
        options: [{ name: 'cancion', type: 3, description: 'Nombre o link del tema', required: true }]
    },
    { name: 'skip', description: 'Salta la canción que está sonando ahora' },
    { name: 'pause', description: 'Pausa la música actual' },
    { name: 'resume', description: 'Quita la pausa a la música' },
    { name: 'queue', description: 'Muestra la lista de canciones en espera' },
    { name: 'nowplaying', description: 'Muestra detalladamente qué canción está sonando' },
    { name: 'stop', description: 'Limpia la lista y saca al bot del canal de voz' }
];

client.on('ready', async () => {
    console.log(`✅ ¡Chipeo The Project Bot activo con sistema completo de música!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) { console.error(error); }
});

// Manejador de interacciones para comandos
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'ping') return interaction.reply({ content: '🎛️ ¡El sistema de sonido está activo y nítido! 🔊🔥' });
    
    if (commandName === 'say') {
        const msg = interaction.options.getString('mensaje');
        await interaction.reply({ content: 'Soltando la pauta...', ephemeral: true });
        await interaction.deleteReply();
        return interaction.channel.send(msg);
    }

    if (commandName === 'redes') {
        const embed = new EmbedBuilder()
            .setColor('#a855f7') 
            .setTitle('🔊 CHIPEO THE PROJECT - OFICIAL 🔊')
            .setDescription('¡Sigue la vuelta y actívate con el coro!')
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[¡Dale clic aquí para seguirnos!](https://www.tiktok.com/)', inline: false },
                { name: '👑 Creadores', value: 'Desarrollado por el **Team Táctico**.', inline: false }
            );
        return interaction.reply({ embeds: [embed] });
    }

    const player = kazagumo.players.get(interaction.guild.id);

    if (commandName === 'play') {
        const canalVoz = interaction.member.voice.channel;
        if (!canalVoz) return interaction.reply({ content: '⚠️ ¡Métete a un canal de voz primero, bro!', ephemeral: true });

        const query = interaction.options.getString('cancion');
        await interaction.reply({ content: `🔍 Buscando \`${query}\` al estilo Jockey...` });

        try {
            const voicePlayer = await kazagumo.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: canalVoz.id,
                deaf: true
            });

            const result = await kazagumo.search(query, { requester: interaction.user });
            if (!result.tracks.length) return interaction.editReply('❌ No encontré música con ese nombre.');

            voicePlayer.queue.add(result.tracks[0]);
            if (!voicePlayer.playing && !voicePlayer.paused) voicePlayer.play();

            const embedPlay = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🎶 AGREGADA A LA LISTA 🔊')
                .setDescription(`**[${result.tracks[0].title}](${result.tracks[0].uri})**`)
                .setThumbnail(result.tracks[0].thumbnail || null)
                .setFooter({ text: 'Chipeo The Project • Sistema de Música' });

            return interaction.editReply({ content: ' ', embeds: [embedPlay] });
        } catch (e) {
            return interaction.editReply('❌ Error conectando al servidor de audio.');
        }
    }

    if (!player) {
        if (['skip', 'pause', 'resume', 'queue', 'nowplaying', 'stop'].includes(commandName)) {
            return interaction.reply({ content: '❌ No hay ninguna pauta musical sonando ahora mismo.', ephemeral: true });
        }
    }

    if (commandName === 'skip') {
        player.skip();
        return interaction.reply('⏭️ ¡Canción saltada!');
    }

    if (commandName === 'pause') {
        if (player.paused) return interaction.reply({ content: '⚠️ Ya está pausado.', ephemeral: true });
        player.pause(true);
        return interaction.reply('⏸️ Música pausada.');
    }

    if (commandName === 'resume') {
        if (!player.paused) return interaction.reply({ content: '⚠️ Ya está sonando.', ephemeral: true });
        player.pause(false);
        return interaction.reply('▶️ ¡Sigue la música!');
    }

    if (commandName === 'queue') {
        const lista = player.queue.map((track, index) => `**${index + 1}.** ${track.title}`).join('\n');
        const embedQueue = new EmbedBuilder()
            .setColor('#a855f7')
            .setTitle('📋 LISTA DE ESPERA')
            .setDescription(lista || 'No hay más canciones en cola.');
        return interaction.reply({ embeds: [embedQueue] });
    }

    if (commandName === 'nowplaying') {
        const track = player.queue.current;
        if (!track) return interaction.reply('No hay nada sonando.');
        const embedNp = new EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('🔊 ESCUCHANDO AHORA 🔊')
            .setDescription(`**[${track.title}](${track.uri})**`)
            .setThumbnail(track.thumbnail || null);
        return interaction.reply({ embeds: [embedNp] });
    }

    if (commandName === 'stop') {
        player.destroy();
        return interaction.reply('🔇 ¡Sistema apagado por completo!');
    }
});

client.login(process.env.TOKEN);
