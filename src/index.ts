import { Telegraf } from 'telegraf';

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
} from './commands';
// import { about } from './commands';
// import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

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

// bot.command('about', about());
// bot.on('message', greeting());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
