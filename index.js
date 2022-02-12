const { Client, Intents } = require("discord.js");
const { joinVoiceChannel, createAudioResource, createAudioPlayer} = require("@discordjs/voice");
const { scheduleJob } = require("node-schedule");

const { token } = require("./secret.json");
const config = require("./config.json");

const client = new Client(
    {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_MEMBERS
        ],
        partials: ["CHANNEL"]
    }
);

client.on("ready", () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
    client.user.setActivity(config.status); 

    const channel = client.channels.cache.get(config.voiceChannel);

    var connection;
    const resource = createAudioResource("barka.opus", { inlineVolume: true });
    resource.volume.setVolume(config.volume);
    const player = createAudioPlayer();

    scheduleJob("37 21 * * *", () => {
        console.log("Ooo Panie to Ty na mnie spojrzałes!")
        connection = joinVoiceChannel({
            channelId: config.voiceChannel,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        
        connection.subscribe(player);
        player.play(resource);
    });

    player.on("idle", () => { 
        if(connection) {
            connection.destroy();
            connection = null;
        }
    });
});

client.login(token);
