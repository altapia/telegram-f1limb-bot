import createDebug from 'debug';
var escape = require('escape-html');
import { ApostarContext } from '../core/apostarContext';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';
const API_TOKEN = process.env.API_TOKEN || '';

/**
 * Cancela el comando /apostar en curso.
 * Reincia la sesión
 * @returns
 */
const cancel = () => async (ctx: ApostarContext) => {
  ctx.session = { iniciado: false, descripcion: null, importeDisponible: 0 };
  await ctx.reply('Comando cancelado');
};

/**
 * Inicia los pasos del comando apostar si se ejecuta en privado y hay importe disponible
 * @returns
 */
const apostar = () => async (ctx: ApostarContext) => {
  ctx.session = { iniciado: true, descripcion: null, importeDisponible: 0 };

  const chatType = (await ctx.getChat()).type;

  if (chatType !== 'private') {
    let message = '⚠️Este comando solo en privado, crack!';
    debug(`Triggered "next" command with message \n${message}`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    return;
  }

  const idUser = (await ctx.getChat()).id;
  // Obtener importe disponible

  const response = await fetch(
    `${URL_API}importe-disponible?idTelegram=${idUser}`,
    {
      headers: { Authorization: `${API_TOKEN}` },
    },
  );
  const { gp, importeDisponible } = await response.json();

  if (parseFloat(importeDisponible) === 0) {
    let message = `*GP de ${gp.nombre}*\n⚠️Ya has agotado el importe disponible para apostar\n Usa /misapuestas para ver a que has apostado.`;
    debug(`Triggered "next" command with message \n${message}`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    return;
  }

  if (ctx.session !== undefined) {
    ctx.session.iniciado = true;
    ctx.session.descripcion = null;
    ctx.session.importeDisponible = importeDisponible;
  }

  let message = `*GP de ${gp.nombre}*\n💰Importe disponible: ${importeDisponible}€\n\nDime la descripción de tu apuesta:`;
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

/**
 * Según el estado en el que se encuentra la sesión, pide el importe o ejecuta la apuesta
 * @returns
 */
const apostarSteps = () => async (ctx: ApostarContext) => {
  if (ctx.session?.iniciado === true) {
    let contenido = ctx.text as string;
    if (
      ctx.session.descripcion !== undefined &&
      ctx.session.descripcion !== null
    ) {
      let importe = 0;
      importe = parseFloat(contenido.replaceAll(',', '.'));
      if (isNaN(importe)) {
        let message = '⚠️El importe debe ser númerico';
        message += '\n\nVuelve a indicarme el importe o cancela con /cancel';
        await ctx.reply(message);
        return;
      }
      if (ctx.session.importeDisponible < importe) {
        let message = `⚠️El importe indicado supera el máximo disponible: ${ctx.session.importeDisponible.toString()}€`;
        message += '\n\nVuelve a indicarme el importe o cancela con /cancel';
        await ctx.replyWithHTML(message);
        return;
      }

      const idUser = (await ctx.getChat()).id;
      const resp = await fetch(`${URL_API}apostar?idTelegram=${idUser}`, {
        method: 'POST',
        headers: { Authorization: `${API_TOKEN}` },
        body: JSON.stringify({
          descripcion: ctx.session.descripcion,
          importe: importe,
        }),
      });
      if (resp.status !== 200) {
        const error = await resp.json();
        let message = `⚠️ ${error.message}\n\n`;
        message += 'Para cancelar: /cancel';
        await ctx.replyWithHTML(message);
        return;
      }

      let message = `<b>Descripción:</b>\n<i>${ctx.session.descripcion}</i>\n\n`;
      message += `<b>Importe:</b> <i>${importe.toString()}€</i>\n\n`;
      message += 'Ok, apuesta insertada\n\n';
      message += 'Usa /misapuestas para ver a que has apostado';

      ctx.session = {
        iniciado: false,
        descripcion: null,
        importeDisponible: 0,
      };
      await ctx.replyWithHTML(message);
    } else {
      if (contenido.trim() !== '') {
        ctx.session.descripcion = escape(ctx.text) ?? '';
        let message = `Descripción:\n<i>${ctx.session.descripcion}</i>\n\n`;
        message += 'Dime el importe (solo la cifra):\n\n';
        message += 'Para cancelar: /cancel';
        await ctx.replyWithHTML(message);
        return;
      }
      // este caso no debería darse, telegram no deja enviarlo
      await ctx.reply('⚠️ La descripción no puede estar vacía');
    }
  }
};

export { apostar, apostarSteps, cancel };
