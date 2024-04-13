const { ApplicationCommandOptionType, ChannelType } = require('discord.js');

const app = require('../index.js');

module.exports = {
  data: {
    name: "removeautojoin",
    description: "自動接続を解除します。",
    options: [
      {
        type: ApplicationCommandOptionType.Channel,
        name: "voice_channel",
        channel_types: [ChannelType.GuildVoice],
        description: "ボイス",
        required: true
      }
    ]
  },

  async execute(interaction){
    if(!(interaction.member.permissions.has('Administrator'))){
      interaction.reply("管理者になって出直して");
      return;
    }

    let voice_channel_id = interaction.options.get('voice_channel').value;

    const guild_id = interaction.guild.id;

    const autojoin_list = app.bot_utils.get_autojoin_list();

    if(!autojoin_list[guild_id] || !autojoin_list[guild_id][voice_channel_id]){
      await interaction.reply('設定がないよ');
      return;
    }

    delete autojoin_list[guild_id][voice_channel_id];

    app.bot_utils.write_autojoin_list(autojoin_list);
    app.setup_autojoin();

    await interaction.reply({ content: `自動接続を設定しました！` });
  }
}
