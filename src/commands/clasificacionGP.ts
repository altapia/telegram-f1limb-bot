import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const clasificacionGP = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'clasificacion');
  const body = await response.text();
  const listClasificacion = JSON.parse(body);

  if (!Array.isArray(listClasificacion)) {
    await ctx.replyWithMarkdownV2('⚠️' + listClasificacion.message, {
      parse_mode: 'Markdown',
    });
    return;
  }

  const responseGP = await fetch(URL_API + 'gp/current');
  const bodyGP = await responseGP.text();
  const gp = JSON.parse(bodyGP);

  const icoOro = '🥇';
  const icoPlata = '🥈';
  const icoBronce = '🥉';
  const icoAcierto = '❇️';
  const icoMinus = '♿️';
  const icoExplosion = '💥';
  const icoEquipo = '👥';
  const icoDinero = '💰';

  let message = `*Clasificación del GP de ${gp.nombre}*\n`;
  listClasificacion.map((a, i) => {
    let icono;
    if (a.ganancia == -3) {
      icono = icoMinus;
    } else {
      icono = icoAcierto;
    }
    message += `*${icono}${i + 1}.${a.user?.nombre}* ${icoEquipo} _${a.team?.nombre}_  ${icoDinero} ${a.ganancia ? Math.round(a.ganancia * 100) / 100 : ''}€ ${icoExplosion}${a.puntos} pts. ${a.ganancia == -3 ? 'DNF' : ''}\n`;
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { clasificacionGP };
