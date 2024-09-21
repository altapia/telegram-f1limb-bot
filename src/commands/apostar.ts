import createDebug from 'debug';
import { escapers } from '@telegraf/entity';

const debug = createDebug('bot:next_command');
const URL_API = process.env.URL_API || '';
const API_TOKEN = process.env.API_TOKEN || '';

/**
 * Cancela el comando /apostar en curso.
 * Reincia la sesión
 * @returns
 */
const cancel = () => async (ctx: any) => {
  ctx.session = { iniciado: false, descripcion: null, importeDisponible: 0 };
  await ctx.reply('Comando cancelado');
};

/**
 * Inicia los pasos del comando apostar si se ejecuta en privado y hay importe disponible
 * @returns
 */
const apostar = () => async (ctx: any) => {
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
const apostarSteps = () => async (ctx: any) => {
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
        await ctx.replyWithMarkdownV2(message);
        return;
      }
      if (ctx.session.importeDisponible < importe) {
        let message = `⚠️El importe indicado supera el máximo disponible: ${escapers.MarkdownV2(ctx.session.importeDisponible.toString())}€`;
        message += '\n\nVuelve a indicarme el importe o cancela con /cancel';
        await ctx.replyWithMarkdownV2(message);
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
        await ctx.replyWithMarkdownV2(escapers.MarkdownV2(message));
        return;
      }

      let message = `*Descripción:*\n_${escapers.MarkdownV2(ctx.session.descripcion)}_\n`;
      message += `*Importe:* _${escapers.MarkdownV2(importe.toString())}€_\n\n`;
      message += 'Ok, apuesta insertada\n';
      message += 'Usa /misapuestas para ver a que has apostado';

      ctx.session = {
        iniciado: false,
        descripcion: null,
        importeDisponible: 0,
      };
      await ctx.replyWithMarkdownV2(message);
    } else {
      if (contenido.trim() !== '') {
        ctx.session.descripcion = ctx.text ?? '';
        let message = `Descripción:\n_${escapers.MarkdownV2(ctx.session.descripcion)}_\n\n`;
        message += 'Dime el importe \\(solo la cifra\\):\n\n';
        message += 'Para cancelar: /cancel';
        await ctx.replyWithMarkdownV2(message);
        return;
      }
      // este caso no debería darse, telegram no deja enviarlo
      const message = 'La descripción no puede estar vacía';
      await ctx.replyWithMarkdownV2(message);
    }
  }
};

export { apostar, apostarSteps, cancel };
