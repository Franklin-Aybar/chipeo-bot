const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

// DASHBOARD WEB BASE
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
                <p style="color: #a3a3c2;">Panel de Control. Módulo de Música Avanzado (Estilo Jockey/Koya) Activo.</p>
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

// TODOS LOS COMANDOS ESTILO JOCKEY / KOYA
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

    // COMANDOS BÁSICOS
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

    // SISTEMA DE MÚSICA AVANZADO
    const player = kazagumo.players.get(interaction.guild.id);

    // /play
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

    // Verificar si el reproductor existe para los siguientes comandos
    if (!player) {
        if (['skip', 'pause', 'resume', 'queue', 'nowplaying', 'stop'].includes(commandName)) {
            return interaction.reply({ content: '❌ No hay ninguna pauta musical sonando ahora mismo.', ephemeral: true });
        }
    }

    // /skip
    if (commandName === 'skip') {
        player.skip();
        return interaction.reply('⏭️ ¡Canción saltada! Pasando a la siguiente.');
    }

    // /pause
    if (commandName === 'pause') {
        if (player.paused) return interaction.reply({ content: '⚠️ El sistema ya está pausado.', ephemeral: true });
        player.pause(true);
        return interaction.reply('⏸️ Música pausada.');
    }

    // /resume
    if (commandName === 'resume') {
        if (!player.paused) return interaction.reply({ content: '⚠️ La música ya está sonando.', ephemeral: true });
        player.pause(false);
        return interaction.reply('▶️ Sistema activo otra vez, ¡que sigan los bajos!');
    }

    // /queue
    if (commandName === 'queue') {
        const lista = player.queue.map((track, index) => `**${index + 1}.** ${track.title}`).join('\n');
        const embedQueue = new EmbedBuilder()
            .setColor('#a855f7')
            .setTitle('📋 LISTA DE ESPERA (QUEUE)')
            .setDescription(lista || 'No hay más canciones en cola. ¡Pon más con `/play`!');
        return interaction.reply({ embeds: [embedQueue] });
    }

    // /nowplaying
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

    // /stop
    if (commandName === 'stop') {
        player.destroy();
        return interaction.reply('🔇 ¡Sistema apagado por completo! El bot limpió la cola y salió.');
    }
});

client.login(process.env.TOKEN);
