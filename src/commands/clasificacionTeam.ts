import { Context } from 'telegraf';
import createDebug from 'debug';
import { icoDinero, icoExplosion } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const clasificacionTeam = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'clasificacion-team');
  const body = await response.text();
  const listClasificacion = JSON.parse(body);

  if (!Array.isArray(listClasificacion)) {
    await ctx.replyWithMarkdownV2('⚠️' + listClasificacion.message, {
      parse_mode: 'Markdown',
    });
    return;
  }

  let message = `*Clasificación por Equipos *\n`;
  listClasificacion.map((a, i) => {
    const sancion = a.sancion > 0 ? ` (-${a.sancion})` : '';
    message += `*${i + 1}. ${a.participante?.team?.nombre}*: ${icoExplosion}${a.puntos}${sancion} ${icoDinero}${a.ganancia != null ? Math.round(a.ganancia * 100) / 100 : '-'}€\n`;
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { clasificacionTeam };
