const Discord = require('discord.js');

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
  ],
});

const botUserIds = ['USER_ID_1', 'USER_ID_2']; // ボットのユーザーIDリストを設定

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (botUserIds.includes(newPresence.userID)) { // リストに含まれるユーザーIDの場合
    const guild = newPresence.guild;
    const offlineRole = guild.roles.cache.find(role => role.name === 'オフライン');
    if (newPresence.status === 'offline' && !newPresence.activities.length) {
      guild.members.fetch(newPresence.userID).then(member => {
        member.roles.add(offlineRole).then(() => {
          const channel = guild.channels.cache.find(channel => channel.name === 'general');
          channel.send(`<@&${offlineRole.id}> ${member.user.username} is now offline.`);
        }).catch(console.error);
      }).catch(console.error);
    } else if (oldPresence.status === 'offline' && newPresence.status !== 'offline') {
      guild.members.fetch(newPresence.userID).then(member => {
        member.roles.remove(offlineRole).catch(console.error);
      }).catch(console.error);
    }
  }
});

client.login(process.env['BOT_TOKEN']);
