import { Context } from 'telegraf';
import createDebug from 'debug';
import { icoDinero } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const euros = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'euros');
  const body = await response.text();
  const euros = JSON.parse(body);

  let message = `*${icoDinero}Euros${icoDinero}*\n`;
  message += `*Aportación inicial: * ${euros.aportacion}€\n`;
  message += `*Ganancias: * ${euros.ganancias}€\n`;
  message += `*Total acumulado: * ${euros.acumulado}€\n`;

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { euros };
