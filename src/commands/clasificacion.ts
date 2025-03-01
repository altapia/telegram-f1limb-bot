import { Context } from 'telegraf';
import createDebug from 'debug';
import { icoDinero, icoExplosion, icoWarning } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const clasificacion = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'clasificacion');
  const body = await response.text();
  const listClasificacion = JSON.parse(body);
  if (!Array.isArray(listClasificacion)) {
    await ctx.replyWithMarkdownV2(icoWarning + listClasificacion.message, {
      parse_mode: 'Markdown',
    });
    return;
  }

  let message = `*Clasificación Individual*\n`;
  listClasificacion.map((a, i) => {
    const sancion = a.sancion > 0 ? ` (-${a.sancion})` : '';
    message += `*${i + 1}. ${a.participante?.user?.nombre}* _(${a.participante?.team?.nombre})_ ${icoExplosion}${a.puntos}${sancion} ${icoDinero}${a.ganancia != null ? Math.round(a.ganancia * 100) / 100 : '-'}€\n`;
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { clasificacion };
