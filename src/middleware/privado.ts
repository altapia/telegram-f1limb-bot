import { Context } from 'telegraf';
import { icoWarning } from '../constants/icons';

export function privado(ctx: Context, next: () => void) {
  if (ctx.chat?.type !== 'private') {
    ctx.reply(`${icoWarning} Este comando solo en privado, crack!`);
    return;
  }
  next();
}
