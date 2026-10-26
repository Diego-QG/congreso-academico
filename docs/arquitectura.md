# Arquitectura del proyecto

## Estructura

```
src/
├── main.jsx                punto de entrada
├── App.jsx                 solo rutas
├── data/
│   └── seed.json           datos semilla (ver contrato-datos.md)
├── shared/                 módulo compartido: se hace una sola vez y lo usan todos
└── features/               una carpeta por entidad del negocio
    ├── publico/            inicio, portada, página 404
    ├── cuenta/             registro, inicio de sesión, mi cuenta, rutas por rol   (HU-1)
    ├── edicion/            ejes, tipos de trabajo, fechas, criterios              (HU-2)
    ├── trabajos/           envío y edición de trabajos                            (HU-3)
    ├── asignaciones/       asignación de revisores                                (HU-4)
    ├── revisiones/         bandeja, evaluación, consolidado y dictamen            (HU-5)
    └── programa/           sesiones y programa público                            (HU-6)
```

Las carpetas van por **entidad** (lo que maneja el sistema), no por número de historia.
Dentro de cada entidad los archivos van sueltos. Si una entidad pasa de unos 12 archivos,
recién ahí se le agregan subcarpetas (`components/`, `pages/`).

## Reglas

1. **Solo los servicios tocan los datos.** Los archivos `*Servicio.js` son los únicos que leen
   `seed.json` o `localStorage`. Las pantallas piden los datos al servicio o al contexto.
   En la segunda entrega solo cambia el interior de los servicios (de `localStorage` a `fetch`),
   y ninguna pantalla se toca.
2. **Una entidad no importa archivos de otra.** Solo puede importar de `shared/` y `data/`.
   Si dos entidades necesitan lo mismo, va a `shared/`.
3. **Componentes comunes en `shared/`:** encabezado, navegación, pie, formulario de evaluación por
   criterios, tarjetas de trabajo, etiquetas de estado y diálogos de confirmación.
4. **El CSS es global: cada clase lleva un prefijo propio.** En Vite todos los `.css` se aplican a
   todas las páginas, así que dos historias con una clase `.tarjeta` o `.modal-fondo` se pisan entre sí.
   Cada pantalla usa su prefijo (`bandeja-`, `consolidado-`, `decision-`…). Nadie define `body`, `*`,
   el encabezado ni el pie fuera de `shared/`.
5. **Tema común en `shared/tema.css`:** fuentes (incluidas en el proyecto), colores, escala de tamaños y
   espaciado como variables (`var(--color-primary)`, `var(--texto-xl)`, `var(--espacio-4)`), y las
   clases comunes `.boton-primario`, `.boton-secundario` e `.insignia` (`-exito`, `-aviso`, `-peligro`,
   `-neutra`). Se usan las variables en vez de escribir colores o tamaños sueltos.
6. **Nombres**
   - Carpetas técnicas en inglés (`features`, `shared`, `data`); dominio en español (`trabajos`, `Registro`).
   - Componentes: `PascalCase.jsx`, con su `.css` al lado y el mismo nombre.
   - Servicios y contextos: `camelCase` con sufijo (`revisionesServicio.js`, `revisionesContexto.js`).
   - El nombre dice qué hace (`MisTrabajos`, no `Historia3`).

## Segunda entrega: backend

Mientras no exista el backend, el registro y el acceso funcionan como una
simulación local del prototipo: las cuentas se guardan en el navegador y las
contraseñas se derivan con PBKDF2 mediante Web Crypto. Esto no sustituye la
autenticación del servidor ni protege frente a la modificación del almacenamiento
del navegador; no usar para cuentas o datos reales. La versión de producción
debe validar credenciales y sesiones en el backend.
El botón «Entrar como comité (demo)» crea una sesión local para probar HU-2;
debe retirarse o reemplazarse por autenticación real antes de publicar.

El repositorio se divide en `frontend/` (todo lo anterior) y `backend/`, con los mismos nombres de entidad:

```
backend/src/
├── routes/         revisionesRoutes.js        URL → controlador
├── controllers/    revisionesController.js    recibe la petición y responde
├── services/       revisionesService.js       reglas de negocio
├── repositories/   revisionesRepository.js    único acceso a la base de datos
├── middlewares/    autenticación por rol, validación, errores
├── config/         conexión y variables de entorno (sin credenciales en el repo)
├── app.js
└── server.js
```

Cada entidad recorre el sistema con el mismo nombre:
`features/revisiones/revisionesServicio.js` → `GET /api/revisiones` → `revisionesController` →
`revisionesService` → `revisionesRepository` → tabla `revisiones`.
