import { Composer, Scenes, session, Telegraf } from 'telegraf';
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
  apostarStep2,
  apostarStep3,
} from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production, ApostarContext } from './core';
import { privado } from './middleware/privado';
import { icoSunrise } from './constants/icons';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const VERCEL_REGION = process.env.VERCEL_REGION || '';
const VERCEL_GIT_COMMIT_MESSAGE = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';

const bot = new Telegraf<ApostarContext>(BOT_TOKEN);

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
const privateBot = new Composer<ApostarContext>();
privateBot.command('misapuestas', privado, misApuestas());
bot.use(privateBot);

const scene = new Scenes.WizardScene<ApostarContext>(
  'sceneApostar',
  apostar(),
  apostarStep2(),
  apostarStep3(),
);
scene.command('cancel', async (ctx) => {
  await ctx.reply('Cancelado');
  ctx.scene.leave();
});

const stage = new Scenes.Stage<ApostarContext>([scene]);
bot.use(session());
bot.use(stage.middleware());
bot.command('apostar', privado, (ctx) => ctx.scene.enter('sceneApostar'));

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

async function sendStartMessage() {
  await bot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `${icoSunrise} ¡F1LimbBot iniciado correctamente!\n
      Webhook: ${VERCEL_URL}/api
      Region: ${VERCEL_REGION}
      Commit: ${VERCEL_GIT_COMMIT_MESSAGE}`,
  );
}

//dev amode
ENVIRONMENT !== 'production' && development(bot);
ENVIRONMENT === 'production' && sendStartMessage();
