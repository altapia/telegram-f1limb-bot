import { Context } from 'telegraf';
import createDebug from 'debug';

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

  const icoDinero = '💰';
  const icoExplosion = '💥';

  let message = `*Clasificación por Equipos *\n`;
  listClasificacion.map((a, i) => {
    message += `*${i + 1}. ${a.team?.nombre}*: ${icoExplosion}${a.puntos} ${icoDinero}${a.ganancia ? Math.round(a.ganancia * 100) / 100 : ''}€\n`;
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { clasificacionTeam };
