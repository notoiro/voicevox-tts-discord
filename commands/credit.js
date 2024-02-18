const { EmbedBuilder, ButtonStyle } = require('discord.js');
const { PaginationWrapper } = require('djs-button-pages');
const { NextPageButton, PreviousPageButton } = require('@djs-button-pages/presets');

const { credit_replaces } = require('../credit_replaces.json');

const VOICE_SPLIT_COUNT = 30;

module.exports = {
  data: {
    name: "credit",
    description: "このBotで利用可能な音声ライブラリのクレジット表記を生成します。"
  },
  async execute(interaction, lib_list, credit_urls){
    const ems = [];

    const list = Array.from(lib_list)
      .map(val => {
        for(let r of credit_replaces) val = val.replace(r[0], r[1]);
        return val;
    });

    const page_count = Math.ceil(list.length/VOICE_SPLIT_COUNT);

    for(let i = 0; i < page_count; i++){
      const start = i * VOICE_SPLIT_COUNT;
      const end = (i + 1) * VOICE_SPLIT_COUNT;

      const em = new EmbedBuilder()
        .setTitle(`利用可能な音声ライブラリのクレジット一覧(${i+1}/${page_count})`)
        .setDescription(`詳しくは各音声ライブラリの利用規約をご覧ください。\n${credit_urls.join('\n')}`)
        .addFields(
          { name: "一覧", value: list.slice(start, end).join("\n") }
        )

      ems.push(em);
    }

    const buttons = [
      new PreviousPageButton({custom_id: "prev_page", emoji: "👈", style: ButtonStyle.Secondary }),
      new NextPageButton({ custom_id: "next_page", emoji: "👉", style: ButtonStyle.Secondary })
    ];

    const page = new PaginationWrapper().setButtons(buttons).setEmbeds(ems).setTime(60000 * 10, true);

    await page.interactionReply(interaction);
  }
}
