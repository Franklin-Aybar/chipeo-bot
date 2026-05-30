const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();

// LA PÁGINA WEB REAL (Actualizada solo con ONLINE)
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
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 0 30px #a855f7, inset 0 0 15px rgba(168, 85, 247, 0.2);
                    max-width: 600px;
                    width: 90%;
                }
                h1 {
                    color: #ffffff;
                    font-size: 28px;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px #a855f7;
                }
                .subtitle {
                    color: #a855f7;
                    font-size: 20px;
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 30px;
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
                    font-size: 15px;
                    color: #73738c;
                    border-top: 1px solid #2d2d3f;
                    padding-top: 15px;
                }
                .footer span {
                    color: #a855f7;
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
                <h1>🔊 CHIPIEO THE PROJECT BOT 🔊</h1>
                <p class="subtitle">El Bot de la L</p>
                
                <div class="status-card">
                    <span style="font-size: 18px; font-weight: bold;">Estado del Bot:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #00ffcc; font-weight: bold;">ONLINE</span>
                        <div class="status-dot"></div>
                    </div>
                </div>

                <p style="color: #a3a3c2; line-height: 1.6; font-size: 16px;">
                    Controlando la comunidad oficial de los musicólogos. El sistema está encendido las 24 horas rompiendo los bajos y activo para tirar las pautas por Discord.
                </p>

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
    { name: 'redes', description: 'Las redes oficiales de Chipeo The Project' }
];

client.on('ready', async () => {
    console.log(`✅ ¡Chipeo The Project Bot activo!`);
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
        await interaction.reply({ content: '🎛️ ¡El sistema de sonido de **Chipeo The Project** está ready, nítido de voces y rompiendo los bajos! 🔊🔥' });
    }
    if (commandName === 'say') {
        const mensajeParaDecir = interaction.options.getString('mensaje');
        try {
            await interaction.reply({ content: 'Soltando la pauta táctica...', ephemeral: true });
            await interaction.deleteReply();
            await interaction.channel.send(mensajeParaDecir);
        } catch (error) { console.error(error); }
    }
    if (commandName === 'redes') {
        const embedRedes = new EmbedBuilder()
            .setColor('#a855f7') 
            .setTitle('🔊 CHIPEO THE PROJECT - OFICIAL 🔊')
            .setDescription('Dándole el verdadero apoyo al movimiento. ¡Sigue la vuelta y actívate con el coro!')
            .addFields(
                { name: '🔥 Nuestro TikTok', value: '[¡Dale clic aquí para seguirnos y llegar a los 1k!](https://www.tiktok.com/)', inline: false },
                { name: '👑 Creadores', value: 'Proyecto desarrollado con el verdadero piquete por el **Team Táctico**.', inline: false }
            )
            .setFooter({ text: 'Chipeo The Project Bot • Controlando el bloque 🔊', iconURL: client.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embedRedes] });
    }
});

client.login(process.env.TOKEN);
