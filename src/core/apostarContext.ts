import { Context } from 'telegraf';

interface SessionData {
  iniciado: boolean;
  descripcion: string | null;
  importeDisponible: number;
}

interface ApostarContext extends Context {
  session?: SessionData;
}
export { ApostarContext };
