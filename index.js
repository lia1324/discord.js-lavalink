const { Client, Intents, Collection } = require('discord.js')
const { Manager } = require("erela.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.
    FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES,],
})

const { token, prefix } = require('./config.json');

client.commands = new Collection()

client.once('ready', () => {
  console.log(`로그인 완료 | ${client.user.tag}!`);
  client.manager.init(client.user.id);
})

client.manager = new Manager({
  nodes: [
    {
      host: "127.0.0.1", // Optional if Lavalink is local
      port: 2333, // Optional if Lavalink is set to default
      password: "pw", // Optional if Lavalink is set to default
    },
  ],
autoPlay: true, 
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
})

client.manager.on("trackStart", async (player, track) => {
    client.channels.cache.get(player.textChannel).send(`재생을 시작합니다.\n${track.title}`);
})

client.manager.on("queueEnd", async (player) => {
  await player.destroy();
    client.channels.cache.get(player.textChannel).send("노래를 모두 재생했어요.\n이 음성채널을 나갈게요.");
})

client.manager.on("nodeError", (node, error) => console.log(`노드 ${node.options.identifier} 에서 에러가 발생했어요. 에러는 아래와 같아요.\n${error.message}`))

client.manager.on("nodeConnect", node => console.log(`노드 ${node.options.identifier} 가 연결되었어요.`))
client.on("raw", (d) => client.manager.updateVoiceState(d));
client.login("")
