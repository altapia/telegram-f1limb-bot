import { Context } from 'telegraf';
import createDebug from 'debug';
import {
  icoAcierto,
  icoBronce,
  icoDinero,
  icoExplosion,
  icoMinus,
  icoOro,
  icoPlata,
  icoWarning,
} from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const clasificacionGP = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'clasificacion-gp');
  const body = await response.text();
  if (response.status === 404) {
    debug(`Error 404: ${response.statusText}`);
    await ctx.reply(`📴${response.statusText}`);
    return;
  }
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
    let icono;
    let pos = a.puesto + '.';
    switch (a.puesto) {
      case 1:
        icono = icoOro;
        break;
      case 2:
        icono = icoPlata;
        break;
      case 3:
        icono = icoBronce;
        break;
      case -1:
        icono = icoMinus;
        pos = '';
        break;

      default:
        icono = icoAcierto;
        break;
    }
    message += `*${icono}${pos} ${a.participante?.user?.nombre}* _(${a.participante?.team?.nombre})_ ${icoExplosion}${a.puntos} ${icoDinero}${a.ganancia != null ? Math.round(a.ganancia * 100) / 100 : '-'}€\n`;
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { clasificacionGP };
