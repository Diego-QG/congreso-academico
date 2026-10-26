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
4. **Nombres**
   - Carpetas técnicas en inglés (`features`, `shared`, `data`); dominio en español (`trabajos`, `Registro`).
   - Componentes: `PascalCase.jsx`, con su `.css` al lado y el mismo nombre.
   - Servicios y contextos: `camelCase` con sufijo (`revisionesServicio.js`, `revisionesContexto.js`).
   - El nombre dice qué hace (`MisTrabajos`, no `Historia3`).

## Segunda entrega: backend

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
