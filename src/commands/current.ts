import { Context } from 'telegraf';
import createDebug from 'debug';

import { author, name, version } from '../../package.json';

const debug = createDebug('bot:current_command');

const current = () => async (ctx: Context) => {
  debug(`Antes de fetch`);
  const response = await fetch('https://f1limb.vercel.app/api/gp/current');
  const body = await response.text();
  const gp = JSON.parse(body);
  console.log(gp);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const carrera = new Date(gp.carrera);
  const libres1 = new Date(gp.libres1);
  const libres2 = new Date(gp.libres2);
  const libres3 = new Date(gp.libres3);
  const clasificacion = new Date(gp.clasificacion);

  const message = `*GP ${gp.nombre}*\n
    Libres 1: ${libres1.toLocaleDateString('es-ES', options)}
    Libres 2: ${libres2.toLocaleDateString('es-ES', options)}
    Libres 3: ${libres3.toLocaleDateString('es-ES', options)}
    Clasificación: ${clasificacion.toLocaleDateString('es-ES', options)}
    Carrera: ${carrera.toLocaleDateString('es-ES', options)}
  `;
  debug(`Triggered "current" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};

export { current };
