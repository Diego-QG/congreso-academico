// edicion
export const EDICION_INICIAL = {
  nombre: 'VIII Congreso Académico Estudiantil',
  anio: '2026',
  sede: 'Auditorio Central, Universidad de Lima — Santiago de Surco',
  descripcion:
    'Encuentro anual de investigación estudiantil. Se reciben artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis ejes temáticos.',
};

// ejes tematicos
export const EJES_INICIALES = [
  { id: 1, nombre: 'Inteligencia artificial y datos', descripcion: 'Aprendizaje automático y ciencia de datos aplicada.', responsable: 'Dra. Ana Salazar', trabajos: 4 },
  { id: 2, nombre: 'Ingeniería de software', descripcion: 'Arquitectura, calidad y procesos de desarrollo.', responsable: 'Mg. Luis Ramírez', trabajos: 3 },
  { id: 3, nombre: 'Sostenibilidad y ciudad', descripcion: 'Movilidad, gestión del agua y ciudades resilientes.', responsable: 'Mg. Carmen Effio', trabajos: 3 },
  { id: 4, nombre: 'Innovación y emprendimiento', descripcion: 'Modelos de negocio y transferencia tecnológica.', responsable: 'Ing. Jorge Palomino', trabajos: 2 },
  { id: 5, nombre: 'Salud y sociedad', descripcion: 'Salud pública y bienestar estudiantil.', responsable: 'Dra. Milagros Yupanqui', trabajos: 1 },
  { id: 6, nombre: 'Economía y mercados', descripcion: 'Mercados financieros, comercio y desarrollo.', responsable: 'Mg. Renzo Bustamante', trabajos: 1 },
];

// tipos de trabajo
export const TIPOS_INICIALES = [
  { id: 1, nombre: 'Artículo completo', extension: '8 000 palabras', formato: 'PDF · plantilla IEEE', admite: true, maximo: 4 },
  { id: 2, nombre: 'Resumen extendido', extension: '2 500 palabras', formato: 'PDF', admite: true, maximo: 3 },
  { id: 3, nombre: 'Póster', extension: '1 lámina A1', formato: 'PDF · orientación vertical', admite: true, maximo: 5 },
  { id: 4, nombre: 'Caso de estudio', extension: '5 000 palabras', formato: 'PDF', admite: false, maximo: 0 },
];

export const FORMATOS = ['PDF', 'PDF · plantilla IEEE', 'PDF · orientación vertical'];

// fechas limite
export const CRONOGRAMA_INICIAL = {
  recepcion: { fecha: '2026-09-30', hora: '23:59' },
  revision: { fecha: '2026-10-20', hora: '18:00' },
  resultados: { fecha: '2026-10-28', hora: '12:00' },
};

export const ETAPAS = [
  { clave: 'recepcion', etiqueta: 'CIERRE DE RECEPCIÓN DE TRABAJOS', punto: 'punto-primario' },
  { clave: 'revision', etiqueta: 'CIERRE DE LA ETAPA DE REVISIÓN', punto: 'punto-acento' },
  { clave: 'resultados', etiqueta: 'PUBLICACIÓN DE RESULTADOS', punto: 'punto-exito' },
];

// criterios de evaluacion
export const CRITERIOS_INICIALES = [
  { id: 1, nombre: 'Originalidad', descripcion: 'Aporte novedoso frente a la literatura consultada.', peso: 25 },
  { id: 2, nombre: 'Rigor metodológico', descripcion: 'Coherencia del diseño, los datos y el análisis.', peso: 30 },
  { id: 3, nombre: 'Claridad de la exposición', descripcion: 'Redacción, estructura y calidad de las figuras.', peso: 20 },
  { id: 4, nombre: 'Relevancia y aporte', descripcion: 'Pertinencia para el eje temático y utilidad práctica.', peso: 20 },
];

// pestañas
export const PESTANAS = [
  { texto: 'Edición', ruta: '/comite/edicion' },
  { texto: 'Ejes temáticos', ruta: '/comite/edicion/ejes' },
  { texto: 'Tipos de trabajo', ruta: '/comite/edicion/tipos' },
  { texto: 'Fechas límite', ruta: '/comite/edicion/fechas' },
  { texto: 'Criterios de evaluación', ruta: '/comite/edicion/criterios' },
];

// menu de la cabecera
export const OPCIONES_MENU = [
  'Configuración',
  'Trabajos recibidos',
  'Revisores',
  'Seguimiento',
  'Programa',
  'Tablero',
  'Usuarios',
];

// cambio de estado de la edicion (modal 2.6 del mockup)
// Cada estado indica a cual pasa y que debe confirmar el comite
export const TRANSICIONES_ESTADO = {
  'En preparación': {
    siguiente: 'Recepción abierta',
    titulo: 'Abrir la recepción de trabajos',
    aviso: 'Los autores podrán registrar y enviar trabajos hasta la fecha de cierre de la recepción.',
    casilla: 'Entiendo que la edición quedará abierta para los autores.',
    palabra: 'ABRIR',
    boton: 'Abrir la recepción',
  },
  'Recepción abierta': {
    siguiente: 'En revisión',
    titulo: 'Cerrar la recepción de trabajos',
    aviso:
      'Los autores ya no podrán editar ni enviar trabajos. Los 2 borradores sin enviar quedarán fuera del proceso y los 12 trabajos enviados pasarán a la etapa de asignación de revisores.',
    casilla: 'Entiendo que los autores ya no podrán editar sus trabajos.',
    palabra: 'CERRAR',
    boton: 'Cerrar la recepción',
  },
  'En revisión': {
    siguiente: 'Resultados publicados',
    titulo: 'Publicar los resultados',
    aviso:
      'Los autores podrán ver el dictamen de sus trabajos y recibirán un correo con la decisión. La publicación no se puede deshacer.',
    casilla: 'Entiendo que los resultados serán visibles para los autores.',
    palabra: 'PUBLICAR',
    boton: 'Publicar resultados',
  },
};

// texto del aviso lateral segun el estado
export const AVISOS_ESTADO = {
  'En preparación': 'Defina ejes, tipos, fechas y criterios antes de abrir la recepción de trabajos.',
  'Recepción abierta':
    'Cierra el 30/09/2026 a las 23:59. Mientras esté abierta, los autores pueden editar sus trabajos.',
  'En revisión': 'La recepción cerró. Los revisores evalúan los trabajos hasta el 20/10/2026 a las 18:00.',
  'Resultados publicados': 'Los resultados ya fueron publicados. Los autores pueden consultar su dictamen.',
};
