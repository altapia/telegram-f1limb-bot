import { Context, Scenes } from 'telegraf';

interface SessionData {
  iniciado: boolean;
  descripcion: string | null;
  importeDisponible: number;
}

interface MyWizardSession extends Scenes.WizardSessionData {
  data: SessionData;
}

interface ApostarContext extends Context {
  scene: Scenes.SceneContextScene<ApostarContext, MyWizardSession>;
  wizard: Scenes.WizardContextWizard<ApostarContext>;
}
export { ApostarContext };
