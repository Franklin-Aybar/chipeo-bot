const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

// LINK DEL LOGO OFICIAL DE CHIPEO THE PROJECT PARA LOS EMBEDS
const LOGO_BOT = "https://images-ext-1.discordapp.net/external/v3m_v5Xj8A8-0r7YhLz_6Zun5L_b7654321/https/raw.githubusercontent.com/Franklin-Aybar/chipeo-bot/main/Chipeo_The_Project_Mesa_de_trabajo_1_Mesa_de_trabajo_1_Mesa_de_trabajo_1_Mesa_de_trabajo_1.png";

// LA PÁGINA WEB PERFECTA (Estilo BOT-LA-L y Los Reales Game de Computadora)
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
                        <span class="status-text">ONLINE EN LA CALLE</span>
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

// ⚡ NUEVOS NODOS LAVALINK PÚBLICOS DE RESPALDO (ACTIVOS)
const Nodes = [
    {
        name: 'Node-Principal',
        url: 'lavalink.asandis.my.id:80', // Servidor de alta velocidad
        auth: 'youshallnotpass',
        secure: false
    },
    {
        name: 'Node-Respaldo',
        url: 'lavalink.juice-mizuki.my.id:80', // Respaldo por si falla el primero
        auth: 'youshallnotpass',
        secure: false
    }
];

const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes, {
    moveOnDisconnect: true, // Si un nodo se cae, se mueve al otro automáticamente
    reconnectTries: 5,
    restTimeout: 15000
});

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
    console.log(`✅ ¡BOT-LA-L levantado con éxito por Los Reales Game de Computadora!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) { console.error(error); }
});

// CAPTURAR ERRORES EN LOS NODOS PARA QUE NO SE REVIENTE EL BOT
shoukaku.on('error', (name, error) => {
    console.log(`⚠️ Alerta en nodo [${name}]: Servidor ocupado o reconectando.`);
});

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
            .setThumbnail(LOGO_BOT)
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[¡Dale clic aquí para seguirnos!](https://www.tiktok.com/)', inline: false },
                { name: '👑 Creadores', value: 'Desarrollado por el **Team Táctico**.', inline: false }
            );
        return interaction.reply({ embeds: [embed] });
    }

    const player = kazagumo.players.get(interaction.guild.id);

    // COMANDO /PLAY MEJORADO CON FILTRO CONTRA CAÍDAS
    if (commandName === 'play') {
        const canalVoz = interaction.member.voice.channel;
        if (!canalVoz) return interaction.reply({ content: '⚠️ ¡Métete a un canal de voz primero, bro!', ephemeral: true });

        const query = interaction.options.getString('cancion');
        await interaction.reply({ content: `🔍 Buscando \`${query}\` en las frecuencias de audio...` });

        try {
            const voicePlayer = await kazagumo.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: canalVoz.id,
                deaf: true
            });

            const result = await kazagumo.search(query, { requester: interaction.user });
            
            if (!result || !result.tracks || !result.tracks.length) {
                return interaction.editReply('❌ No encontré ninguna pista musical con ese nombre. Prueba con otra palabra clave.');
            }

            voicePlayer.queue.add(result.tracks[0]);
            if (!voicePlayer.playing && !voicePlayer.paused) voicePlayer.play();

            const embedPlay = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🎶 PISTA AGREGADA AL MURO DE SONIDO 🔊')
                .setDescription(`**[${result.tracks[0].title}](${result.tracks[0].uri})**`)
                .setThumbnail(LOGO_BOT)
                .setFooter({ text: 'Chipeo The Project • Los Reales Game de Computadora' });

            return interaction.editReply({ content: ' ', embeds: [embedPlay] });

        } catch (e) {
            console.error(e);
            return interaction.editReply('⚠️ **El sistema de audio está reiniciando sus frecuencias.** Por favor, espera 10 segundos e intenta poner la canción otra vez, que los servidores públicos se saturan a veces.');
        }
    }

    if (!player) {
        if (['skip', 'pause', 'resume', 'queue', 'nowplaying', 'stop'].includes(commandName)) {
            return interaction.reply({ content: '❌ No hay ninguna pauta musical sonando ahora mismo.', ephemeral: true });
        }
    }

    if (commandName === 'skip') {
        player.skip();
        return interaction.reply('⏭️ ¡Canción saltada! Pasando al siguiente track.');
    }

    if (commandName === 'pause') {
        if (player.paused) return interaction.reply({ content: '⚠️ Las plantas ya están en pausa.', ephemeral: true });
        player.pause(true);
        return interaction.reply('⏸️ Sonido pausado.');
    }

    if (commandName === 'resume') {
        if (!player.paused) return interaction.reply({ content: '⚠️ El sonido ya está activo.', ephemeral: true });
        player.pause(false);
        return interaction.reply('▶️ ¡Sigue el chipeo activo! Que retumben los bajos.');
    }

    if (commandName === 'queue') {
        const lista = player.queue.map((track, index) => `**${index + 1}.** ${track.title}`).join('\n');
        const embedQueue = new EmbedBuilder()
            .setColor('#a855f7')
            .setTitle('📋 LISTA DE TEMAS EN ESPERA')
            .setThumbnail(LOGO_BOT)
            .setDescription(lista || 'No hay más música en la cola. Pon tracks usando `/play`.');
        return interaction.reply({ embeds: [embedQueue] });
    }

    if (commandName === 'nowplaying') {
        const track = player.queue.current;
        if (!track) return interaction.reply('No hay nada sonando.');
        const embedNp = new EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('🔊 TRACK SONANDO EN VIVO 🔊')
            .setDescription(`**[${track.title}](${track.uri})**`)
            .setThumbnail(LOGO_BOT)
            .addFields({ name: '👤 Pedida por', value: `${track.requester}`, inline: true });
        return interaction.reply({ embeds: [embedNp] });
    }

    if (commandName === 'stop') {
        player.destroy();
        return interaction.reply('🔇 ¡Muro de sonido apagado! Cola limpia y bot fuera del canal.');
    }
});

client.login(process.env.TOKEN);
