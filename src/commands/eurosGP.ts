import { Context } from 'telegraf';
import createDebug from 'debug';
import { icoDinero } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const eurosGP = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'euros-gp');
  const body = await response.text();

  if (response.status === 404) {
    debug(`Error 404: ${response.statusText}`);
    await ctx.reply(`📴${response.statusText}`);
    return;
  }

  const euros = JSON.parse(body);

  const responseGP = await fetch(URL_API + 'gp/current');
  const bodyGP = await responseGP.text();
  const gp = JSON.parse(bodyGP);

  let message = `*${icoDinero}Euros del GP de ${gp.nombre}*\n`;
  message += `*Ganancias: * ${euros.ganancias}€\n`;

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { eurosGP };
