const { Client, Intents } = require('discord.js')
const cron = require('cron')
// 7200000

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES
  ]
})

client.on('ready', () => {
  let guild = client.guilds.cache.get('696324754520670218')
  let testChannel = guild.channels.cache.get('754083246480031926')
  const roleLegends = guild.roles.resolve('847504515947036763')
  const messageRemider = `${roleLegends} Prière svp et cliquez sur la réaction quand c'est fait 🙏`
  const legendsUserId = roleLegends.members.map(u => u.id)
  const botId = '874050542433873970'
  let newArr = []

  const testMessage = new cron.CronJob('00 20 * * *', () => {

    testChannel.send(messageRemider).then(messageRemider => {
      messageRemider.react('🙏').then(() => {
        const filter = (reaction, user) => {
          return reaction.emoji.name === '🙏' && user.id !== botId
        }
        const collector = messageRemider.createReactionCollector({ filter, time: 7200000 })
        collector.on('collect', (reaction, user) => {
          console.log(`${user.tag} reacted with ${reaction.emoji.name}.`)
        })
        collector.on('end', collection => {
          collection.map(reaction => {
            const reactUsers = reaction.users.cache.map(u => u.id)
            newArr = legendsUserId.filter(users => !reactUsers.includes(users))
            if (newArr.length > 1) {
              testChannel.send(`${newArr.map(elt => `<@${elt}>`).join(' ')} Prière svp`)

            } else if (newArr.length === 1) {
              testChannel.send(`${newArr.map(elt => `<@${elt}>`)} Prière stp`)

            } else if (newArr.length === 0) {
              testChannel.send(`Tout le monde a prié ! 🤗`)
            }
          })
        })
      })
    })
  })
  testMessage.start()
})

client.login(process.env.TOKEN)