# Contrato de datos

Estructura de las entidades que comparten las historias. Cada entidad tiene un
responsable; cambiar un campo requiere acuerdo del grupo.
Los datos de prueba están en `src/data/seed.json`.

## Usuario (HU-1 · Hugo)
_Por definir._

## Edición (HU-2 · Josué)
_Por definir._ Los criterios de evaluación deben tener `id`, `nombre`,
`descripcion` y `peso` (la HU-5 los usa por su `id`).

## Trabajo (HU-3 · Carlos)
_Por definir._

## Asignación (HU-4 · Alonso)
_Por definir._ La HU-5 usa `id`, `trabajoId`, `revisorId`, `fecha` y `estado`.

## Revisión (HU-5 · Diego)

| Campo | Tipo | Valores / notas |
| --- | --- | --- |
| id | texto | `REV-` + id de la asignación (ej. `REV-A2`) |
| asignacionId | texto | id de la asignación (HU-4) |
| trabajoId | texto | id del trabajo (HU-3) |
| revisorId | texto | id del revisor (HU-1) |
| estado | texto | `borrador` · `enviada` |
| puntajes | lista | un elemento por criterio: `{ criterioId, puntaje, comentario }` |
| puntajes[].puntaje | número o null | 0 a 20; `null` si aún no se califica (solo en borrador) |
| comentarioAutor | texto | lo ve el autor |
| observacionComite | texto | reservado: solo lo ve el comité |
| recomendacion | texto | `aceptar` · `aceptar_con_observaciones` · `rechazar` (vacío en borrador) |
| fechaEnvio | fecha o null | `AAAA-MM-DD`; `null` en borrador |

**Puntaje total de una revisión:** promedio ponderado de sus puntajes con los
pesos de los criterios: `suma(puntaje × peso) / suma(pesos)`. Resultado de 0 a 20.

## Dictamen (HU-5 · Diego)

| Campo | Tipo | Valores / notas |
| --- | --- | --- |
| trabajoId | texto | id del trabajo (HU-3); un solo dictamen por trabajo |
| decision | texto | `aceptado` · `aceptado_con_observaciones` · `rechazado` |
| retroalimentacion | texto | mensaje para el autor (la HU-3 lo muestra en "Mis trabajos") |
| fecha | fecha | `AAAA-MM-DD` |

**Reglas:**
- El comité solo puede registrar el dictamen con al menos 2 revisiones enviadas.
- Sugerencia según el promedio de las revisiones: 70 o más → aceptar;
  50 a 69 → aceptar con observaciones; menos de 50 → revisar a detalle.
  La decisión final siempre es del comité.