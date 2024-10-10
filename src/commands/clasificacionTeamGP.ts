import { Context } from 'telegraf';
import createDebug from 'debug';
import { icoDinero, icoExplosion, icoWarning } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const clasificacionTeamGP = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'clasificacion-team-gp');
  const body = await response.text();
  const listClasificacion = JSON.parse(body);

  if (!Array.isArray(listClasificacion)) {
    await ctx.replyWithMarkdownV2(icoWarning + listClasificacion.message, {
      parse_mode: 'Markdown',
    });
    return;
  }

  const responseGP = await fetch(URL_API + 'gp/current');
  const bodyGP = await responseGP.text();
  const gp = JSON.parse(bodyGP);

  let message = `*Clasificación del GP de ${gp.nombre}*\n`;
  listClasificacion.map((a, i) => {
    message += `*${i + 1}. ${a.team?.nombre}*: ${icoExplosion}${a.puntos} ${icoDinero}${a.ganancia ? Math.round(a.ganancia * 100) / 100 : ''}€\n`;
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { clasificacionTeamGP };
