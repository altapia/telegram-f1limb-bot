import { Telegraf } from 'telegraf';
import createDebug from 'debug';
import { ApostarContext } from './apostarContext';
import { icoSunrise } from '../constants/icons';

const debug = createDebug('bot:dev');
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';

const development = async (bot: Telegraf<ApostarContext>) => {
  const botInfo = (await bot.telegram.getMe()).username;

  debug('Bot runs in development mode');
  debug(`${botInfo} deleting webhook`);
  await bot.telegram.deleteWebhook();
  debug(`${botInfo} starting polling`);

  await bot.launch(() => {
    bot.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `${icoSunrise} ¡F1LimbBot iniciado correctamente, modo Desarrollo!`,
    );
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

export { development };
