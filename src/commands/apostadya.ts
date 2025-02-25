import { Context } from 'telegraf';
import createDebug from 'debug';
import { icoOk, icoDedo, icoEnfado } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const apostadya = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'apostadya');
  const body = await response.text();

  if (response.status === 404) {
    debug(`Error 404: ${response.statusText}`);
    await ctx.reply(`📴${response.statusText}`);
    return;
  }

  const listUsuarios = JSON.parse(body);

  const responseGP = await fetch(URL_API + 'gp/current');
  const bodyGP = await responseGP.text();
  const gp = JSON.parse(bodyGP);

  let message = `*GP ${gp.nombre}*`;
  if (listUsuarios.length === 0) {
    message += '\nHan apostado todos ' + icoOk;
  } else {
    message += `\n\n${icoEnfado} Faltan por apostar:\n`;
    listUsuarios.map((u: any) => {
      message += `${icoDedo}${u.nombre}\n`;
    });
  }

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { apostadya };
