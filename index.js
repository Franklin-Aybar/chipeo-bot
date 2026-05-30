const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const { Connectors, Shoukaku } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const express = require('express');
const app = express();

const LOGO_BOT = "https://raw.githubusercontent.com/Franklin-Aybar/chipeo-bot/main/Chipeo_The_Project_Mesa_de_trabajo_1_Mesa_de_trabajo_1_Mesa_de_trabajo_1_Mesa_de_trabajo_1.png";

app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>BOT-LA-L | Web Oficial</title>
            <style>
                body { background-color: #06060c; color: #ffffff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .container { background-color: #11111b; border: 2px solid #00ffcc; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 0 30px #00ffcc; max-width: 600px; width: 90%; }
                h1 { color: #00ffcc; margin: 0; text-transform: uppercase; }
                .subtitle { color: #ff007f; font-weight: bold; margin-bottom: 20px; }
                .status { background-color: #161622; padding: 15px; border-radius: 8px; font-weight: bold; color: #00ffcc; }
                .footer { margin-top: 30px; font-size: 12px; color: #555577; }
                .footer span { color: #00ffcc; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔊 BOT-LA-L 🔊</h1>
                <div class="subtitle">Chipeo The Project Bot</div>
                <div class="status">STATUS: ONLINE EN LA CALLE</div>
                <p>Mantenimiento de sistemas de sonido ready las 24 horas.</p>
                <div class="footer">Desarrollado por <span>Los Reales Game de Computadora</span></div>
            </div>
        </body>
        </html>
    `); 
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]
});

const Nodes = [
    { name: 'Node-Principal', url: 'lavalink.asandis.my.id:80', auth: 'youshallnotpass', secure: false },
    { name: 'Node-Respaldo', url: 'lavalink.juice-mizuki.my.id:80', auth: 'youshallnotpass', secure: false }
];

// Inicialización estándar compatible
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes, { moveOnDisconnect: true });
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
    { name: 'say', description: 'Manda un mensaje a través del bot', options: [{ name: 'mensaje', type: 3, description: 'Texto a decir', required: true }] },
    { name: 'redes', description: 'Las redes oficiales de Chipeo The Project' },
    { name: 'play', description: 'Reproduce música', options: [{ name: 'cancion', type: 3, description: 'Nombre o link', required: true }] },
    { name: 'skip', description: 'Salta la canción actual' },
    { name: 'stop', description: 'Saca al bot del canal' }
];

client.on('ready', async () => {
    console.log(`✅ ¡BOT-LA-L iniciado por Los Reales Game de Computadora!`);
    client.user.setActivity('Chipeo The Project 🔊', { type: 3 }); 
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) { console.error(error); }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'ping') return interaction.reply('🎛️ ¡El sistema de sonido está activo y nítido! 🔊🔥');

    if (commandName === 'say') {
        const msg = interaction.options.getString('mensaje');
        await interaction.reply({ content: 'Soltando pauta...', ephemeral: true });
        await interaction.deleteReply();
        return interaction.channel.send(msg);
    }

    if (commandName === 'redes') {
        const embed = new EmbedBuilder()
            .setColor('#a855f7') 
            .setTitle('🔊 CHIPEO THE PROJECT - OFICIAL 🔊')
            .setThumbnail(LOGO_BOT)
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[Dale clic aquí para seguirnos](https://www.tiktok.com/)', inline: false },
                { name: '👑 Empresa', value: 'Desarrollado para **Los Reales Game de Computadora**.', inline: false }
            );
        return interaction.reply({ embeds: [embed] });
    }

    const player = kazagumo.players.get(interaction.guild.id);

    if (commandName === 'play') {
        const canalVoz = interaction.member.voice.channel;
        if (!canalVoz) return interaction.reply({ content: '⚠️ ¡Métete a un canal de voz primero, bro!', ephemeral: true });

        const query = interaction.options.getString('cancion');
        await interaction.reply({ content: `🔍 Buscando \`${query}\`...` });

        try {
            const voicePlayer = await kazagumo.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: canalVoz.id,
                deaf: true
            });

            const result = await kazagumo.search(query, { requester: interaction.user });
            if (!result || !result.tracks || !result.tracks.length) return interaction.editReply('❌ No encontré pistas.');

            voicePlayer.queue.add(result.tracks[0]);
            if (!voicePlayer.playing && !voicePlayer.paused) voicePlayer.play();

            const embedPlay = new EmbedBuilder()
                .setColor('#00ffcc')
                .setTitle('🎶 TRACK AGREGADO AL MURO DE SONIDO 🔊')
                .setDescription(`**[${result.tracks[0].title}](${result.tracks[0].uri})**`)
                .setThumbnail(LOGO_BOT)
                .setFooter({ text: 'Los Reales Game de Computadora' });

            return interaction.editReply({ content: ' ', embeds: [embedPlay] });
        } catch (e) {
            return interaction.editReply('⚠️ Error al conectar al nodo de audio. Intenta de nuevo.');
        }
    }

    if (!player && ['skip', 'stop'].includes(commandName)) return interaction.reply({ content: '❌ No hay música sonando.', ephemeral: true });

    if (commandName === 'skip') { player.skip(); return interaction.reply('⏭️ ¡Track saltado!'); }
    if (commandName === 'stop') { player.destroy(); return interaction.reply('🔇 ¡Muro apagado!'); }
});

client.login(process.env.TOKEN);
