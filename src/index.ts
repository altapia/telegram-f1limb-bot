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
import { icoSunrise } from './constants/icons';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const VERCEL_REGION = process.env.VERCEL_REGION || '';
const VERCEL_GIT_COMMIT_MESSAGE = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';

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

function sendStartMessage() {
  bot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `${icoSunrise} ¡F1LimbBot iniciado correctamente!\n\nWebhook: ${VERCEL_URL}/api\nRegion: ${VERCEL_REGION}\nCommit: ${VERCEL_GIT_COMMIT_MESSAGE}`,
  );
}

//dev amode
ENVIRONMENT !== 'production' && development(bot);
ENVIRONMENT === 'production' && sendStartMessage();
