import { Context } from 'telegraf';
import createDebug from 'debug';
import {
  icoAcierto,
  icoFallo,
  icoPendiente,
  icoDinero,
  icoUsuario,
  icoClock,
  icoInfo,
  icoWarning,
} from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';
const API_TOKEN = process.env.API_TOKEN || '';

const misApuestas = () => async (ctx: Context) => {
  const idUser = (await ctx.getChat()).id;
  const chatType = (await ctx.getChat()).type;

  if (chatType !== 'private') {
    let message = icoWarning + ' Este comando solo en privado, crack!';
    debug(`Triggered "next" command with message \n${message}`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    return;
  }

  const response = await fetch(`${URL_API}misapuestas?idTelegram=${idUser}`, {
    headers: { Authorization: `${API_TOKEN}` },
  });
  const body = await response.text();
  if (response.status === 404) {
    debug(`Error 404: ${response.statusText}`);
    await ctx.reply(`📴${response.statusText}`);
    return;
  }
  const apuestas = JSON.parse(body);

  const responseGP = await fetch(URL_API + 'gp/current');
  const bodyGP = await responseGP.text();
  const gp = JSON.parse(bodyGP);

  let message: string;
  if (apuestas.length > 0) {
    message = `*Tus apuestas del GP de ${gp.nombre}*\n\n`;
    apuestas.map((ap: any) => {
      switch (ap.estado) {
        case 1:
          message += icoPendiente;
          break;
        case 2:
          message += icoAcierto;
          break;
        case 3:
          message += icoFallo;
          break;
        default:
          message += icoClock;
          break;
      }
      const cuota = ap.cuota !== null ? `@${ap.cuota}` : '';
      message += ` ${ap.descripcion}: ${ap.importe}€${cuota} ${ap.ganancia ? icoDinero + ap.ganancia + '€' : ''}\n`;
    });
  } else {
    message = `*GP de ${gp.nombre}*\n${icoInfo} No tienes ninguna apuesta`;
  }

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { misApuestas };
