const { Telegraf, Markup } = require('telegraf');
const express = require('express');

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
const NODE_ENV = process.env.NODE_ENV || 'development';

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

// Health check endpoint for DigitalOcean App Platform
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Telegram Bot is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start the bot based on environment
if (NODE_ENV === 'production' && WEBHOOK_DOMAIN) {
  // Production mode: Use webhooks
  app.use(bot.webhookCallback('/webhook'));

  bot.telegram.setWebhook(`${WEBHOOK_DOMAIN}/webhook`)
    .then(() => {
      console.log('Webhook set successfully');
      app.listen(PORT, () => {
        console.log(`Bot server listening on port ${PORT}`);
        console.log(`Webhook URL: ${WEBHOOK_DOMAIN}/webhook`);
      });
    })
    .catch((err) => {
      console.error('Error setting webhook:', err);
      process.exit(1);
    });
} else {
  // Development mode: Use polling
  console.log('Running in development mode with polling');
  bot.launch()
    .then(() => {
      console.log('Bot started successfully in polling mode');

      // Start express server for health checks even in development
      app.listen(PORT, () => {
        console.log(`Health check server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Error starting bot:', err);
      process.exit(1);
    });
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
