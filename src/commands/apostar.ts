import createDebug from 'debug';
var escape = require('escape-html');
import { ApostarContext } from '../core/apostarContext';
import { icoDinero, icoWarning } from '../constants/icons';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';
const API_TOKEN = process.env.API_TOKEN || '';

/**
 * Inicia los pasos del comando apostar si se ejecuta en privado y hay importe disponible
 * @returns
 */
const apostar = () => async (ctx: ApostarContext) => {
  ctx.scene.session.data = {
    iniciado: true,
    descripcion: null,
    importeDisponible: 0,
  };

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
    let message = `*GP de ${gp.nombre}*\n${icoWarning} Ya has agotado el importe disponible para apostar\n
      Usa /misapuestas para ver a que has apostado.`;
    debug(`Triggered "next" command with message \n${message}`);
    await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
    return await ctx.scene.leave();
  }

  if (ctx.scene.session.data !== undefined) {
    ctx.scene.session.data.iniciado = true;
    ctx.scene.session.data.descripcion = null;
    ctx.scene.session.data.importeDisponible = importeDisponible;
  }

  let message = `*GP de ${gp.nombre}*\n${icoDinero}Importe disponible: ${importeDisponible}€\n\n
    Dime la descripción de tu apuesta:`;
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
  return ctx.wizard.next();
};

/**
 * Según el estado en el que se encuentra la sesión, pide el importe o ejecuta la apuesta
 * @returns
 */
const apostarStep2 = () => async (ctx: ApostarContext) => {
  if (ctx.scene.session.data?.iniciado === true) {
    let contenido = ctx.text as string;

    if (contenido.trim() !== '') {
      ctx.scene.session.data.descripcion = escape(ctx.text) ?? '';
      let message = `Descripción:\n<i>${ctx.scene.session.data.descripcion}</i>\n\n`;
      message += 'Dime el importe (solo la cifra):\n\n';
      message += 'Para cancelar: /cancel';
      await ctx.replyWithHTML(message);
      return ctx.wizard.next();
    }
    // este caso no debería darse, telegram no deja enviarlo
    await ctx.reply(
      `${icoWarning} La descripción no puede estar vacía. Vuelve a poner la descripción`,
    );
    return;
  }
};

/**
 * Según el estado en el que se encuentra la sesión, pide el importe o ejecuta la apuesta
 * @returns
 */
const apostarStep3 = () => async (ctx: ApostarContext) => {
  if (ctx.scene.session.data?.iniciado === true) {
    let contenido = ctx.text as string;
    if (
      ctx.scene.session.data.descripcion !== undefined &&
      ctx.scene.session.data.descripcion !== null
    ) {
      let importe = 0;
      importe = parseFloat(contenido.replaceAll(',', '.'));
      if (isNaN(importe)) {
        let message = `${icoWarning} El importe debe ser númerico`;
        message += '\n\nVuelve a indicarme el importe o cancela con /cancel';
        await ctx.reply(message);
        return;
      }
      if (importe <= 0) {
        let message = `${icoWarning} El importe debe ser mayor que 0`;
        message += '\n\nVuelve a indicarme el importe o cancela con /cancel';
        await ctx.reply(message);
        return;
      }
      if (ctx.scene.session.data.importeDisponible < importe) {
        let message = `${icoWarning} El importe indicado supera el máximo disponible: ${ctx.scene.session.data.importeDisponible.toString()}€`;
        message += '\n\nVuelve a indicarme el importe o cancela con /cancel';
        await ctx.replyWithHTML(message);
        return;
      }

      const idUser = (await ctx.getChat()).id;
      const resp = await fetch(`${URL_API}apostar?idTelegram=${idUser}`, {
        method: 'POST',
        headers: { Authorization: `${API_TOKEN}` },
        body: JSON.stringify({
          descripcion: ctx.scene.session.data.descripcion,
          importe: importe,
        }),
      });
      if (resp.status !== 200) {
        const error = await resp.json();
        let message = `${icoWarning} ${error.message}\n\n`;
        message += 'Para cancelar: /cancel';
        await ctx.replyWithHTML(message);
        return;
      }

      let message = `<b>Descripción:</b>\n<i>${ctx.scene.session.data.descripcion}</i>\n\n`;
      message += `<b>Importe:</b> <i>${importe.toString()}€</i>\n\n`;
      message += 'Ok, apuesta insertada\n\n';
      message += 'Usa /misapuestas para ver a que has apostado';

      ctx.scene.session.data = {
        iniciado: false,
        descripcion: null,
        importeDisponible: 0,
      };
      await ctx.replyWithHTML(message);
      return ctx.scene.leave();
    } else {
      await ctx.reply(
        `${icoWarning} La descripción no puede estar vacía. Vuelve a poner la descripción`,
      );
      return;
    }
  }
};

export { apostar, apostarStep2, apostarStep3 };
