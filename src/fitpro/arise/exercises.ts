// @ts-nocheck
// Biblioteca de ejercicios con estándares de fuerza
// t: w = con peso (std = 1RM / peso corporal), bw = reps, time = segundos
const E = (id, name, m, t, std, sec = []) => ({ id, name, m, t, std, sec });
export const EXERCISES = [
  E('banca','Press banca','pecho','w',1.9,['triceps','hombros']), E('inclinado','Press inclinado','pecho','w',1.6,['hombros']),
  E('flexiones','Flexiones','pecho','bw',60,['triceps']), E('fondos','Fondos','triceps','bw',35,['pecho']),
  E('muerto','Peso muerto','espalda','w',2.9,['isquios','gluteos']), E('remo','Remo con barra','espalda','w',1.5,['biceps']),
  E('dominadas','Dominadas','espalda','bw',22,['biceps']), E('jalon','Jalón al pecho','espalda','w',1.4,['biceps']),
  E('remo_inv','Remo invertido','espalda','bw',35,['biceps']), E('militar','Press militar','hombros','w',1.2,['triceps']),
  E('laterales','Elevaciones laterales','hombros','w',0.3), E('pike','Pike push-ups','hombros','bw',30,['triceps']),
  E('curl','Curl con barra','biceps','w',0.75), E('curl_m','Curl mancuerna','biceps','w',0.38),
  E('frances','Press francés','triceps','w',0.65), E('polea_t','Extensión en polea','triceps','w',0.7),
  E('diamante','Flexiones diamante','triceps','bw',45,['pecho']), E('plancha','Plancha','abdomen','time',240),
  E('elev_p','Elevación de piernas','abdomen','bw',30), E('crunch','Crunch','abdomen','bw',80),
  E('sentadilla','Sentadilla','cuadriceps','w',2.5,['gluteos']), E('prensa','Prensa','cuadriceps','w',4.5,['gluteos']),
  E('bulgara','Sentadilla búlgara','cuadriceps','w',1.0,['gluteos']), E('sent_libre','Sentadilla libre','cuadriceps','bw',100,['gluteos']),
  E('rumano','Peso muerto rumano','isquios','w',2.0,['gluteos']), E('femoral','Curl femoral','isquios','w',0.85),
  E('hip','Hip thrust','gluteos','w',3.0,['isquios']), E('puente','Puente de glúteo','gluteos','bw',60),
  E('gemelos','Gemelos con peso','gemelos','w',2.0), E('talones','Gemelos sin peso','gemelos','bw',80),
];
