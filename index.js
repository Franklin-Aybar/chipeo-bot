const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes } = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const express = require('express');

const TOKEN     = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// ── Servidor web para Render ──
const app = express();
app.get('/', (_, res) => res.send('✅ Bot online'));
app.listen(process.env.PORT || 3000, () => console.log('✅ Servidor web activo'));

// ── Cliente Discord ──
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

// ── Cookies de YouTube (desde variable de entorno) ──
const ytCookies = process.env.YT_COOKIES || '';

// ── DisTube con cookies ──
const distube = new DisTube(client, {
    plugins: [new YouTubePlugin({
        cookies: ytCookies
    })]
});

// ── Eventos DisTube ──
distube.on('playSong', (queue, song) => {
    queue.textChannel?.send({ embeds: [
        new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('▶️ Sonando ahora')
            .setDescription(`**[${song.name}](${song.url})**`)
            .addFields(
                { name: '⏱ Duración', value: song.formattedDuration, inline: true },
                { name: '👤 Pedido por', value: song.user?.username || 'Desconocido', inline: true }
            )
    ]});
});

distube.on('addSong', (queue, song) => {
    queue.textChannel?.send({ embeds: [
        new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📋 Agregado a la cola')
            .setDescription(`**[${song.name}](${song.url})**`)
            .addFields(
                { name: '⏱ Duración', value: song.formattedDuration, inline: true },
                { name: '📍 Posición', value: `#${queue.songs.length}`, inline: true }
            )
    ]});
});

distube.on('finish', queue => {
    queue.textChannel?.send('✅ La cola terminó.');
});

distube.on('error', (error, queue) => {
    console.error('DisTube error:', error);
    queue?.textChannel?.send('❌ Error reproduciendo esa canción.');
});

// ── Comandos ──
const commands = [
    { name: 'play',   description: '🎵 Reproduce una canción', options: [{ name: 'cancion', type: 3, description: 'Nombre o URL', required: true }] },
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

    if (commandName === 'ping') return interaction.reply(`🏓 Pong! \`${client.ws.ping}ms\``);

    if (commandName === 'play') {
        const voiceChannel = member?.voice?.channel;
        if (!voiceChannel) return interaction.reply({ content: '⚠️ Entra a un canal de voz primero.', ephemeral: true });

        const query = interaction.options.getString('cancion');
        await interaction.deferReply();

        try {
            await distube.play(voiceChannel, query, { member, textChannel: channel });
            await interaction.editReply('🎵 ¡Procesando!');
        } catch (e) {
            console.error('Error en /play:', e);
            await interaction.editReply('❌ No pude reproducir esa canción.');
        }
    }

    const queue = distube.getQueue(guild.id);

    if (commandName === 'skip') {
        if (!queue) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        await queue.skip();
        return interaction.reply('⏭ ¡Saltado!');
    }

    if (commandName === 'stop') {
        if (!queue) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        await queue.stop();
        return interaction.reply('⏹ ¡Parado!');
    }

    if (commandName === 'pause') {
        if (!queue) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        queue.pause();
        return interaction.reply('⏸ ¡Pausado!');
    }

    if (commandName === 'resume') {
        if (!queue) return interaction.reply({ content: '❌ No hay música.', ephemeral: true });
        queue.resume();
        return interaction.reply('▶️ ¡Reanudado!');
    }

    if (commandName === 'queue') {
        if (!queue) return interaction.reply({ content: '📋 La cola está vacía.', ephemeral: true });
        const songs = queue.songs;
        let desc = `▶️ **Sonando:** [${songs[0].name}](${songs[0].url})\n\n`;
        if (songs.length > 1) {
            desc += songs.slice(1, 11).map((s, i) => `\`${i + 1}.\` [${s.name}](${s.url}) — ${s.formattedDuration}`).join('\n');
            if (songs.length > 11) desc += `\n... y ${songs.length - 11} más`;
        }
        return interaction.reply({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('📋 Cola').setDescription(desc)] });
    }

    if (commandName === 'np') {
        if (!queue) return interaction.reply({ content: '❌ No hay nada sonando.', ephemeral: true });
        const song = queue.songs[0];
        return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🎶 Sonando ahora')
            .setDescription(`**[${song.name}](${song.url})**`)
            .addFields(
                { name: '⏱ Duración', value: song.formattedDuration, inline: true },
                { name: '👤 Pedido por', value: song.user?.username || 'Desconocido', inline: true }
            )
        ]});
    }
});

client.login(TOKEN);
