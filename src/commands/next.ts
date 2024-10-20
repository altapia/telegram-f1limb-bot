import { Context } from 'telegraf';
import createDebug from 'debug';
import { createMessageGP } from '../utils/util';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const next = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'gp/next');
  const body = await response.text();
  const gp = JSON.parse(body);
  const message = createMessageGP(gp);

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { next };
