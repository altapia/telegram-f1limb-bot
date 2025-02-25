import { Context } from 'telegraf';
import createDebug from 'debug';
import { createMessageGP } from '../utils/util';

const debug = createDebug('bot:current_command');
const URL_API = process.env.URL_API || '';

const current = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'gp/current');
  const body = await response.text();

  if (response.status === 404) {
    debug(`Error 404: ${response.statusText}`);
    await ctx.reply(`📴${response.statusText}`);
    return;
  }

  const gp = JSON.parse(body);
  const message = createMessageGP(gp);

  debug(`Triggered "current" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { current };
