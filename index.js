const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();

// INTERFAZ DE LA PÁGINA WEB (Dashboard Visual con Flow Tuning)
app.get('/', (req, res) => { 
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bot-la-L | Dashboard Oficial</title>
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
                    border: 2px solid #00ffcc;
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 0 30px #00ffcc, inset 0 0 15px rgba(0, 255, 204, 0.2);
                    max-width: 600px;
                    width: 90%;
                }
                h1 {
                    color: #00ffcc;
                    font-size: 32px;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px #00ffcc;
                }
                .subtitle {
                    color: #ff007f;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 30px;
                    text-shadow: 0 0 10px #ff007f;
                }
                .status-card {
                    background-color: #1f1f2e;
                    border-left: 5px solid #00ffcc;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .status-dot {
                    width: 15px;
                    height: 15px;
                    background-color: #00ffcc;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #00ffcc;
                    animation: pulse 1.5s infinite;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #73738c;
                    border-top: 1px solid #2d2d3f;
                    padding-top: 15px;
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
                <h1>🔊 BOT-LA-L 🔊</h1>
                <p class="subtitle">Chipeo The Project Bot</p>
                
                <div class="status-card">
                    <span style="font-size: 18px; font-weight: bold;">Estado del Bot:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #00ffcc; font-weight: bold;">ONLINE EN LA CALLE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>

                <p style="color: #a3a3c2; line-height: 1.6;">
                    Este es el panel principal de control para la comunidad. El bot se encuentra encendido las 24 horas controlando los comandos y manteniendo los sistemas de sonido ready.
                </p>

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
        GatewayIntentBits.GuildMessages
    ]
});

// Comandos Slash (/)
const commands = [
    { name: 'ping', description: 'Prueba si el sistema de sonido del bot está ready' },
    {
        name: 'say',
        description: 'Manda un mensaje a través del bot ocultando tu perfil',
        options: [{ name: 'mensaje', type: 3, description: 'El código que le va\' a meter al chat', required: true }]
    },
    { name: 'redes', description: 'Las redes oficiales de Chipeo The Project y Los Reales' }
];

client.on('ready', async () => {
    console.log(`✅ ¡Bot-la-L activo!`);
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
        await interaction.reply({ content: '🎛️ ¡El sistema de sonido está ready, nítido de voces y con los bajos rompiendo! 🔊🔥' });
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
            .setColor('#00ffcc')
            .setTitle('🔊 CHIPEO THE PROJECT - OFICIAL 🔊')
            .setDescription('Dándole el verdadero apoyo al movimiento. ¡Sigue la vuelta y actívate en las redes!')
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[¡Dale clic aquí para seguirnos y llegar a los 1k!](https://www.tiktok.com/)', inline: false },
                { name: '🎮 Team de Desarrollo', value: 'Suelto por **Los Reales Game de Computadora** con el flow de Bobi y Sandi.', inline: false }
            )
            .setFooter({ text: 'Bot-la-L • Controlando la comunidad 🔊', iconURL: client.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embedRedes] });
    }
});

client.login(process.env.TOKEN);
