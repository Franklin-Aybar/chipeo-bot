const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    REST,
    Routes
} = require('discord.js');

const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection
} = require('@discordjs/voice');

const play = require('play-dl');

const TOKEN     = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

// Cola por servidor
const servers = new Map();

function getServer(guildId) {
    if (!servers.has(guildId)) {
        servers.set(guildId, { queue: [], player: null, connection: null, current: null });
    }
    return servers.get(guildId);
}

async function playNext(guildId, textChannel) {
    const server = getServer(guildId);
    if (server.queue.length === 0) {
        server.current = null;
        textChannel.send('✅ La cola terminó.');
        return;
    }

    const track = server.queue.shift();
    server.current = track;

    try {
        const stream = await play.stream(track.url, { quality: 2 });
        const resource = createAudioResource(stream.stream, { inputType: stream.type });
        server.player.play(resource);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('▶️ Sonando ahora')
            .setDescription(`**[${track.title}](${track.url})**`)
            .addFields(
                { name: '⏱ Duración', value: track.duration, inline: true },
                { name: '👤 Pedido por', value: track.requester, inline: true }
            );

        textChannel.send({ embeds: [embed] });
    } catch (e) {
        console.error('Error reproduciendo:', e);
        textChannel.send('❌ Error en esa canción, saltando...');
        playNext(guildId, textChannel);
    }
}

const commands = [
    {
        name: 'play',
        description: '🎵 Reproduce una canción de YouTube',
        options: [{ name: 'cancion', type: 3, description: 'Nombre o URL', required: true }]
    },
    { name: 'skip',   description: '⏭ Salta la canción actual' },
    { name: 'stop',   description: '⏹ Para y limpia la cola' },
    { name: 'pause',  description: '⏸ Pausa la música' },
    { name: 'resume', description: '▶️ Reanuda la música' },
    { name: 'queue',  description: '📋 Ver la cola' },
    { name: 'np',     description: '🎶 Canción actual' },
    { name: 'ping',   description: '🏓 Latencia del bot' }
];

client.once('ready', async () => {
    console.log(`✅ Listo como ${client.user.tag}`);
    client.user.setActivity('música 🎵', { type: 2 });

    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Comandos registrados');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, guild, member, channel } = interaction;

    if (commandName === 'ping') {
        return interaction.reply(`🏓 Pong! \`${client.ws.ping}ms\``);
    }

    if (commandName === 'play') {
        const voiceChannel = member?.voice?.channel;
        if (!voiceChannel) return interaction.reply({ content: '⚠️ Entra a un canal de voz primero.', ephemeral: true });

        await interaction.deferReply();
        const query = interaction.options.getString('cancion');
        const server = getServer(guild.id);

        if (!server.connection || server.connection.state.status === VoiceConnectionStatus.Destroyed) {
            server.connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: true
            });

            server.player = createAudioPlayer();
            server.connection.subscribe(server.player);

            server.player.on(AudioPlayerStatus.Idle, () => playNext(guild.id, channel));
            server.player.on('error', (e) => { console.error(e); playNext(guild.id, channel); });
        }

        try {
            let trackUrl, trackTitle, trackDuration;

            if (play.yt_validate(query) === 'video') {
                const info = await play.video_info(query);
                trackUrl      = query;
                trackTitle    = info.video_details.title;
                trackDuration = info.video_details.durationRaw;
            } else {
                const results = await play.search(query, { limit: 1 });
                if (!results.length) return interaction.editReply('❌ No encontré esa canción.');
                trackUrl      = results[0].url;
                trackTitle    = results[0].title;
                trackDuration = results[0].durationRaw;
            }

            const track = { url: trackUrl, title: trackTitle, duration: trackDuration || '??:??', requester: interaction.user.username };
            server.queue.push(track);

            if (server.player.state.status === AudioPlayerStatus.Idle) {
                playNext(guild.id, channel);
                await interaction.editReply('🎵 ¡Reproduciendo!');
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('📋 Agregado a la cola')
                    .setDescription(`**[${track.title}](${track.url})**`)
                    .addFields(
                        { name: '⏱ Duración', value: track.duration, inline: true },
                        { name: '📍 Posición', value: `#${server.queue.length}`, inline: true }
                    );
                await interaction.editReply({ embeds: [embed] });
            }
        } catch (e) {
            console.error('Error en /play:', e);
            await interaction.editReply('❌ Error buscando esa canción.');
        }
    }

    if (commandName === 'skip') {
        const server = getServer(guild.id);
        if (!server.player) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        server.player.stop();
        return interaction.reply('⏭ ¡Saltado!');
    }

    if (commandName === 'stop') {
        const server = getServer(guild.id);
        if (!server.connection) return interaction.reply({ content: '❌ No estoy en un canal.', ephemeral: true });
        server.queue = [];
        server.current = null;
        server.connection.destroy();
        servers.delete(guild.id);
        return interaction.reply('⏹ ¡Parado y cola limpiada!');
    }

    if (commandName === 'pause') {
        const server = getServer(guild.id);
        if (!server.player) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        server.player.pause();
        return interaction.reply('⏸ ¡Pausado!');
    }

    if (commandName === 'resume') {
        const server = getServer(guild.id);
        if (!server.player) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        server.player.unpause();
        return interaction.reply('▶️ ¡Reanudado!');
    }

    if (commandName === 'queue') {
        const server = getServer(guild.id);
        if (!server.current && server.queue.length === 0) return interaction.reply({ content: '📋 La cola está vacía.', ephemeral: true });

        let desc = '';
        if (server.current) desc += `▶️ **Sonando:** [${server.current.title}](${server.current.url})\n\n`;
        if (server.queue.length > 0) {
            desc += server.queue.slice(0, 10).map((t, i) => `\`${i + 1}.\` [${t.title}](${t.url}) — ${t.duration}`).join('\n');
            if (server.queue.length > 10) desc += `\n... y ${server.queue.length - 10} más`;
        }

        return interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('📋 Cola').setDescription(desc)] });
    }

    if (commandName === 'np') {
        const server = getServer(guild.id);
        if (!server.current) return interaction.reply({ content: '❌ No hay nada sonando.', ephemeral: true });

        return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🎶 Sonando ahora')
            .setDescription(`**[${server.current.title}](${server.current.url})**`)
            .addFields(
                { name: '⏱ Duración', value: server.current.duration, inline: true },
                { name: '👤 Pedido por', value: server.current.requester, inline: true }
            )
        ]});
    }
});

client.login(TOKEN);
