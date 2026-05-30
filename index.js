const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

// LOGO OFICIAL DEL BOT
const LOGO_BOT = "https://raw.githubusercontent.com/Franklin-Aybar/chipeo-bot/main/Chipeo_The_Project_Mesa_de_trabajo_1_Mesa_de_trabajo_1_Mesa_de_trabajo_1_Mesa_de_trabajo_1.png";

// PANEL WEB WEB (Estilo BOT-LA-L y Los Reales Game de Computadora)
app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BOT-LA-L | Web Oficial</title>
            <style>
                body {
                    background-color: #06060c;
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
                    background-color: #11111b;
                    border: 2px solid #00ffcc;
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 0 30px #00ffcc, inset 0 0 15px rgba(0, 255, 204, 0.1);
                    max-width: 680px;
                    width: 90%;
                }
                .title-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                h1 {
                    color: #00ffcc;
                    font-size: 38px;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 800;
                    text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
                }
                .subtitle {
                    color: #ff007f;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 2px;
                    margin-bottom: 30px;
                }
                .status-card {
                    background-color: #161622;
                    border-left: 5px solid #00ffcc;
                    padding: 16px 22px;
                    border-radius: 8px;
                    margin: 25px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .status-label {
                    font-size: 19px;
                    font-weight: bold;
                }
                .status-text {
                    color: #00ffcc;
                    font-weight: bold;
                    font-size: 16px;
                }
                .status-dot {
                    width: 14px;
                    height: 14px;
                    background-color: #00ffcc;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #00ffcc;
                    animation: pulse 1.5s infinite;
                }
                .description {
                    color: #8c8cbd;
                    line-height: 1.6;
                }
                .divider {
                    border: none;
                    border-top: 1px solid #1e1e2f;
                    margin-top: 30px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 13px;
                    color: #555577;
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
                    <span style="font-size: 28px;">🔊</span>
                    <h1>BOT-LA-L</h1>
                    <span style="font-size: 28px;">🔊</span>
                </div>
                <div class="subtitle">Chipeo The Project Bot</div>
                
                <div class="status-card">
                    <span class="status-label">Estado del Bot:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="status-text">ONLINE EN LA CALLE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>

                <p class="description">
                    Panel principal del bot. Encendido las 24 horas controlando los comandos y manteniendo los sistemas de sonido ready.
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

// NODOS AUDIO LAVALINK ACTIVOS
const Nodes = [
    {
        name: 'Chipeo-Node-A',
        url: 'lavalink.asandis.my.id:80',
        auth: 'youshallnotpass',
        secure: false
    },
    {
        name: 'Chipeo-Node-B',
        url: 'lavalink.juice-mizuki.my.id:80',
        auth: 'youshallnotpass',
        secure: false
    }
];

// ARREGLO INTEGRAL DE CONECTORES PARA ELIMINAR EL ERROR INTERNO
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes, {
    moveOnDisconnect: true,
    reconnectTries: 5,
    restTimeout: 15000
});

const kazagumo = new Kazagumo({
    plugins: [],
    defaultSearchEngine: 'youtube',
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    }
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
    console.log(`✅ ¡BOT-LA-L iniciado correctamente por Los Reales Game de Computadora!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) { console.error(error); }
});

shoukaku.on('error', (name, error) => {
    console.log(`⚠️ Nodo [${name}] reconectando en segundo plano.`);
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
                { name: '👑 Empresa', value: 'Desarrollado para **Los Reales Game de Computadora**.', inline: false }
            );
        return interaction.reply({ embeds: [embed] });
    }

    const player = kazagumo.players.get(interaction.guild.id);

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
                return interaction.editReply('❌ No encontré ninguna pista con ese nombre.');
            }

            voicePlayer.queue.add(result.tracks[0]);
            if (!voicePlayer.playing && !voicePlayer.paused) voicePlayer.play();

            const embedPlay = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🎶 TRACK AGREGADO AL MURO DE SONIDO 🔊')
                .setDescription(`**[${result.tracks[0].title}](${result.tracks[0].uri})**`)
                .setThumbnail(LOGO_BOT)
                .setFooter({ text: 'Chipeo The Project • Los Reales Game de Computadora' });

            return interaction.editReply({ content: ' ', embeds: [embedPlay] });

        } catch (e) {
            return interaction.editReply('⚠️ **El sistema de audio está sincronizando las frecuencias.** Espera unos segundos y vuelve a ponerla.');
        }
    }

    if (!player) {
        if (['skip', 'pause', 'resume', 'queue', 'nowplaying', 'stop'].includes(commandName)) {
            return interaction.reply({ content: '❌ No hay ninguna pauta musical sonando ahora mismo.', ephemeral: true });
        }
    }

    if (commandName === 'skip') { player.skip(); return interaction.reply('⏭️ ¡Track saltado!'); }
    if (commandName === 'pause') { player.pause(true); return interaction.reply('⏸️ Sonido pausado.'); }
    if (commandName === 'resume') { player.pause(false); return interaction.reply('▶️ ¡Sigue el chipeo activo!'); }

    if (commandName === 'queue') {
        const lista = player.queue.map((track, index) => `**${index + 1}.** ${track.title}`).join('\n');
        const embedQueue = new EmbedBuilder()
            .setColor('#a855f7')
            .setTitle('📋 TEMAS EN FILA')
            .setThumbnail(LOGO_BOT)
            .setDescription(lista || 'No hay más canciones en espera.');
        return interaction.reply({ embeds: [embedQueue] });
    }

    if (commandName === 'nowplaying') {
        const track = player.queue.current;
        if (!track) return interaction.reply('No hay nada sonando.');
        const embedNp = new EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('🔊 ESCUCHANDO EN VIVO 🔊')
            .setDescription(`**[${track.title}](${track.uri})**`)
            .setThumbnail(LOGO_BOT);
        return interaction.reply({ embeds: [embedNp] });
    }

    if (commandName === 'stop') { player.destroy(); return interaction.reply('🔇 ¡Muro apagado y cola vacía!'); }
});

client.login(process.env.TOKEN);
