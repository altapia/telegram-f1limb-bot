import { session, Telegraf } from 'telegraf';
import {
  current,
  next,
  apuestas,
  clasificacionGP,
  clasificacionTeamGP,
  clasificacion,
  clasificacionTeam,
  euros,
  eurosGP,
  web,
  apostadya,
  misApuestas,
  apostar,
  apostarSteps,
  cancel,
} from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { ApostarContext } from './core/apostarContext';
import { privado } from './middleware/privado';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf<ApostarContext>(BOT_TOKEN);
bot.use(session());

bot.command('gp', current());
bot.command('gp_next', next());
bot.command('apuestas', apuestas());
bot.command('clasificacion_gp', clasificacionGP());
bot.command('clasificacion_team_gp', clasificacionTeamGP());
bot.command('clasificacion', clasificacion());
bot.command('clasificacion_team', clasificacionTeam());
bot.command('euros', euros());
bot.command('euros_gp', eurosGP());
bot.command('web', web());
bot.command('apostadya', apostadya());

// comandos privados
bot.command('misapuestas', privado, misApuestas());
bot.command('apostar', privado, apostar());
bot.command('cancel', privado, cancel());
bot.on('message', privado, apostarSteps());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev amode
ENVIRONMENT !== 'production' && development(bot);
