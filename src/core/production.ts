import { VercelRequest, VercelResponse } from '@vercel/node';
import createDebug from 'debug';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { icoSunrise } from '../constants/icons';

const debug = createDebug('bot:dev');

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';
const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const VERCEL_REGION = process.env.VERCEL_REGION || '';
const VERCEL_GIT_COMMIT_MESSAGE = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';

const production = async (
  req: VercelRequest,
  res: VercelResponse,
  bot: Telegraf<Context<Update>>,
) => {
  debug('Bot runs in production mode');
  debug(`setting webhook: ${VERCEL_URL}`);

  if (!VERCEL_URL) {
    throw new Error('VERCEL_URL is not set.');
  }

  const getWebhookInfo = await bot.telegram.getWebhookInfo();
  if (getWebhookInfo.url !== VERCEL_URL + '/api') {
    debug(`deleting webhook ${VERCEL_URL}`);
    await bot.telegram.deleteWebhook();
    debug(`setting webhook: ${VERCEL_URL}/api`);
    await bot.telegram.setWebhook(`${VERCEL_URL}/api`);
  }

  if (req.method === 'POST') {
    await bot.handleUpdate(req.body as unknown as Update, res);
  } else {
    res.status(200).json('Listening to bot events...');
  }
  debug(`starting webhook on port: ${PORT}`);
  await bot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `${icoSunrise} *¡F1LimbBot iniciado correctamente!*\n\n*Webhook:* ${VERCEL_URL}/api\n*Region:* ${VERCEL_REGION}\n*Commit:* ${VERCEL_GIT_COMMIT_MESSAGE}`,
    { parse_mode: 'MarkdownV2' },
  );
};
export { production };
