import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';

const apuestas = () => async (ctx: Context) => {
  const response = await fetch(URL_API + 'apuestas');
  const body = await response.text();
  const apuestas = JSON.parse(body);

  // Si no se pueden ver
  if (!Array.isArray(apuestas)) {
    await ctx.replyWithMarkdownV2('⚠️' + apuestas.message, {
      parse_mode: 'Markdown',
    });
    return;
  }

  const responseGP = await fetch(URL_API + 'gp/current');
  const bodyGP = await responseGP.text();
  const gp = JSON.parse(bodyGP);

  const icoAcierto = '✅';
  const icoFallo = '❌';
  const icoPendiente = '➖';
  const icoDinero = '💸';
  const icoUsuario = '🥸';

  let message = `*Apuestas del GP de ${gp.nombre}*\n\n`;
  apuestas.map((a: any) => {
    if (a.apuestas.length > 0) {
      message += `\n${icoUsuario}${a.nombre}:\n`;

      a.apuestas.map((ap: any) => {
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
        }
        message += ` ${ap.descripcion}: ${ap.importe}@${ap.cuota} ${ap.ganancia ? icoDinero + ap.ganancia + '€' : ''}\n`;
      });
    }
  });

  debug(`Triggered "next" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { apuestas };
