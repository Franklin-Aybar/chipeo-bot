const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

// PÁGINA WEB - DASHBOARD AVANZADO CON EL PIQUETE DEL TEAM TÁCTICO
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
                    background-color: #0b0b0f; 
                    color: #ffffff; 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 0;
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh;
                }
                .container { 
                    background: linear-gradient(145deg, #12121a, #1a1a26); 
                    border: 2px solid #a855f7; 
                    border-radius: 20px; 
                    padding: 35px; 
                    text-align: center; 
                    box-shadow: 0 0 35px rgba(168, 85, 247, 0.4); 
                    max-width: 850px; 
                    width: 90%; 
                    margin: 20px auto;
                }
                h1 { 
                    color: #ffffff; 
                    text-shadow: 0 0 15px #a855f7; 
                    font-size: 32px;
                    margin-bottom: 5px;
                    letter-spacing: 2px;
                }
                .subtitle { 
                    color: #a855f7; 
                    font-size: 22px; 
                    font-weight: bold; 
                    margin-top: 0;
                    margin-bottom: 25px; 
                    text-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
                }
                .status-card { 
                    background-color: #171724; 
                    border: 1px solid #2d2d3f;
                    border-left: 5px solid #00ffcc; 
                    padding: 15px 25px; 
                    border-radius: 10px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 30px; 
                }
                .status-dot { 
                    width: 14px; 
                    height: 14px; 
                    background-color: #00ffcc; 
                    border-radius: 50%; 
                    box-shadow: 0 0 12px #00ffcc; 
                    animation: pulse 1.5s infinite;
                }
                
                /* GRILLA DE MÓDULOS ESTILO BOT GRANDE */
                .modules-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .module-card {
                    background: #151522;
                    border: 1px solid #252538;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: left;
                    transition: all 0.3s ease;
                }
                .module-card:hover {
                    transform: translateY(-5px);
                    border-color: #a855f7;
                    box-shadow: 0 5px 15px rgba(168, 85, 247, 0.2);
                }
                .module-icon {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .module-card h3 {
                    margin: 0 0 8px 0;
                    color: #ffffff;
                    font-size: 18px;
                }
                .module-card p {
                    margin: 0 0 15px 0;
                    color: #a3a3c2;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .btn-module {
                    background-color: #1f1f33;
                    color: #a855f7;
                    border: 1px solid #a855f7;
                    padding: 8px 15px;
                    font-size: 13px;
                    font-weight: bold;
                    border-radius: 6px;
                    cursor: pointer;
                    width: 100%;
                    transition: 0.2s;
                }
                .btn-module:hover {
                    background-color: #a855f7;
                    color: #white;
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
                }

                .btn-login { 
                    background: linear-gradient(90deg, #a855f7, #7e22ce);
                    color: white; 
                    border: none; 
                    padding: 14px 35px; 
                    font-size: 16px; 
                    font-weight: bold; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); 
                    text-decoration: none; 
                    display: inline-block; 
                    margin-top: 30px;
                    transition: 0.3s;
                }
                .btn-login:hover { 
                    transform: scale(1.03);
                    box-shadow: 0 0 30px #a855f7; 
                }
                .footer { 
                    margin-top: 40px; 
                    font-size: 15px; 
                    color: #73738c; 
                    border-top: 1px solid #2d2d3f; 
                    padding-top: 15px; 
                }
                .footer span { color: #a855f7; font-weight: bold; }
                
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.7; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔊 CHIPIEO THE PROJECT BOT 🔊</h1>
                <p class="subtitle">El Bot de la L</p>
                
                <div class="status-card">
                    <span style="font-size: 18px; font-weight: bold;">Estado del Bot:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #00ffcc; font-weight: bold; letter-spacing: 1px;">ONLINE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>

                <div class="modules-grid">
                    <div class="module-card">
                        <div class="module-icon">🎵</div>
                        <h3>Módulo de Música</h3>
                        <p>Controla el sistema de reproducción avanzado estilo Jockey de los canales de voz.</p>
                        <button class="btn-module">Configurar Música</button>
                    </div>
                    <div class="module-card">
                        <div class="module-icon">🛡️</div>
                        <h3>Moderación Táctica</h3>
                        <p>Limpia chats, banea y silencia usuarios molestos para mantener la paz en el bloque.</p>
                        <button class="btn-module">Configurar Filtros</button>
                    </div>
                    <div class="module-card">
                        <div class="module-icon">👋</div>
                        <h3>Bienvenidas</h3>
                        <p>Dale la pauta oficial y saluda automáticamente a los nuevos musicólogos del servidor.</p>
                        <button class="btn-module">Configurar Mensajes</button>
                    </div>
                </div>

                <a href="#" class="btn-login">Panel de Control General</a>

                <div class="footer">
                    Desarrollado con toda la grasa por el <span>Team Táctico</span>
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

const kazagumo = new Kazagumo({
    plugins: [],
    defaultSearchEngine: 'youtube'
}, new Shoukaku(new Connectors.DiscordJS(client), Nodes));

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
        return interaction.reply('⏭️ ¡Canción saltada! Pasando a la siguiente.');
    }

    if (commandName === 'pause') {
        if (player.paused) return interaction.reply({ content: '⚠️ El sistema ya está pausado.', ephemeral: true });
        player.pause(true);
        return interaction.reply('⏸️ Música pausada.');
    }

    if (commandName === 'resume') {
        if (!player.paused) return interaction.reply({ content: '⚠️ La música ya está sonando.', ephemeral: true });
        player.pause(false);
        return interaction.reply('▶️ Sistema activo otra vez, ¡que sigan los bajos!');
    }

    if (commandName === 'queue') {
        const lista = player.queue.map((track, index) => `**${index + 1}.** ${track.title}`).join('\n');
        const embedQueue = new EmbedBuilder()
            .setColor('#a855f7')
            .setTitle('📋 LISTA DE ESPERA (QUEUE)')
            .setDescription(lista || 'No hay más canciones en cola. ¡Pon más con `/play`!');
        return interaction.reply({ embeds: [embedQueue] });
    }

    if (commandName === 'nowplaying') {
        const track = player.queue.current;
        if (!track) return interaction.reply('No hay nada sonando.');
        const embedNp = new EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('🔊 ESCUCHANDO AHORA MISMITO 🔊')
            .setDescription(`**[${track.title}](${track.uri})**`)
            .setThumbnail(track.thumbnail || null)
            .addFields({ name: '👤 Pedida por', value: `${track.requester}`, inline: true });
        return interaction.reply({ embeds: [embedNp] });
    }

    if (commandName === 'stop') {
        player.destroy();
        return interaction.reply('🔇 ¡Sistema apagado por completo! El bot limpió la cola y salió.');
    }
});

client.login(process.env.TOKEN);
