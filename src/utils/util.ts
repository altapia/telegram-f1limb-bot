const createMessageGP = (gp: any) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'CET',
  };

  let message = `*GP ${gp.nombre}*\n\n`;

  const libres1 = new Date(gp.libres1);
  message += `Libres 1: ${libres1.toLocaleDateString('es-ES', options)}\n`;

  if (gp.libres2 !== undefined) {
    const libres2 = new Date(gp.libres2);
    message += `Libres 2: ${libres2.toLocaleDateString('es-ES', options)}\n`;
  }

  if (gp.libres3 !== undefined) {
    const libres3 = new Date(gp.libres3);
    message += `Libres 3: ${libres3.toLocaleDateString('es-ES', options)}\n`;
  }

  if (gp.clasificacionSprint !== undefined) {
    const clasificacionSprint = new Date(gp.clasificacionSprint);
    message += `Clasificación Spring: ${clasificacionSprint.toLocaleDateString('es-ES', options)}\n`;
  }

  if (gp.sprint !== undefined) {
    const sprint = new Date(gp.sprint);
    message += `Sprint: ${sprint.toLocaleDateString('es-ES', options)}\n`;
  }

  const clasificacion = new Date(gp.clasificacion);
  message += `Clasificación: ${clasificacion.toLocaleDateString('es-ES', options)}\n`;

  const carrera = new Date(gp.carrera);
  message += `Carrera: ${carrera.toLocaleDateString('es-ES', options)}`;

  if (gp.limite_apostar !== undefined) {
    message += `\n\n`;
    message += msgLimiteApostar(gp.limite_apostar);
  }

  return message;
};

const msgLimiteApostar = (limite: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'CET',
  };

  let message = '';
  if (limite !== undefined) {
    const limite_apostar = new Date(limite);
    message += `⏱️*Limite para apostar: ${limite_apostar.toLocaleDateString('es-ES', options)}*`;

    if (limite_apostar > new Date()) {
      const quedan = limite_apostar.getTime() - new Date().getTime();
      const dias = Math.floor(quedan / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (quedan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutos = Math.floor((quedan % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((quedan % (1000 * 60)) / 1000);
      message += `\n⚠️Quedan ${dias} días, ${horas} horas, ${minutos} minutos y ${segundos} segundos.`;
    }
  }
  return message;
};

export { createMessageGP, msgLimiteApostar };
