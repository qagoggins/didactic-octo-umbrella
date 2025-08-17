const { Telegraf, Markup } = require('telegraf');

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Store user language (simple memory for demo)
const userLang = {};

// Button sets (no Request BOL button anymore)
const buttons = {
  en: [
    ['Break', 'Cycle'],
    ['Shift', 'PTI'],
    ['Adjust Hours', 'Add a few hours']
  ],
  es: [
    ['Descanso', 'Ciclo'],
    ['Turno', 'PTI'],
    ['Ajustar Horas', 'Agregar unas horas']
  ]
};

bot.start((ctx) => {
  return ctx.reply(
    'Choose your language / Elige tu idioma:',
    Markup.inlineKeyboard([
      [Markup.button.callback('English', 'set_lang_en')],
      [Markup.button.callback('Español', 'set_lang_es')]
    ])
  );
});

// English selection
bot.action('set_lang_en', async (ctx) => {
  const id = ctx.from.id;
  userLang[id] = 'en';

  await ctx.answerCbQuery();
  await ctx.editMessageText('Language set to English ✅');

  await ctx.reply(
    'Menu below 👇',
    Markup.keyboard(buttons.en).resize().persistent()
  );
});

// Spanish selection
bot.action('set_lang_es', async (ctx) => {
  const id = ctx.from.id;
  userLang[id] = 'es';

  await ctx.answerCbQuery();
  await ctx.editMessageText('Idioma cambiado a Español ✅');

  await ctx.reply(
    'Menú abajo 👇',
    Markup.keyboard(buttons.es).resize().persistent()
  );
});

// Handle button presses
bot.hears(
  [
    'Break', 'Cycle', 'Shift', 'PTI', 'Adjust Hours', 'Add a few hours',
    'Descanso', 'Ciclo', 'Turno', 'PTI', 'Ajustar Horas', 'Agregar unas horas'
  ],
  (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const text = ctx.message.text;

    if (lang === 'en') {
      switch (text) {
        case 'Cycle': return ctx.reply('Please send your Bill Of Lading 📄'); // only here
      }
    } else {
      switch (text) {
        case 'Ciclo': return ctx.reply('Por favor envíe su Conocimiento De Embarque 📄'); // only here
      }
    }
  }
);

bot.launch();
