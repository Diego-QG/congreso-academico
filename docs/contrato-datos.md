# Contrato de datos

Estructura de las entidades que comparten las historias. Cada entidad tiene un
responsable; cambiar un campo requiere acuerdo del grupo.
Los datos de prueba están en `src/data/seed.json`.

## Usuario (HU-1 · Hugo)

| Campo | Tipo | Valores / notas |
| --- | --- | --- |
| nombres | texto | Nombres de la persona |
| apellidos | texto | Apellidos de la persona |
| email | texto | Correo institucional; único por cuenta |
| institucion | texto | Institución del participante |
| rolParticipacion | texto | `autor` · `revisor` · `ambos` · `comite` |
| carrera | texto | Carrera del participante, si corresponde |
| codigoAlumno | texto | Código de alumno, si corresponde |

El rol `comite` lo asigna la organización; no se ofrece en el registro público.
En el prototipo local, la contraseña se guarda como derivación PBKDF2 en el
navegador y no forma parte de los datos de sesión del participante. La
autenticación de producción corresponde al backend.

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

## Sesión (HU-6 · Sacha)

| Campo | Tipo | Valores / notas |
| --- | --- | --- |
| id | texto | `S1`, `S2`… |
| nombre | texto | nombre de la sesión |
| eje | texto | nombre del eje temático (igual que `trabajos[].eje`) |
| fecha | fecha | `AAAA-MM-DD`; un día del congreso |
| horaInicio | texto | `HH:MM` |
| horaFin | texto | `HH:MM`; posterior a `horaInicio` |
| sala | texto | `A-101` · `B-201` · `C-305` |
| moderador | texto | nombre del moderador |
| trabajos | lista | ids de trabajos (HU-3) en orden de exposición |

**Programa:** `{ publicado, fechaPublicacion }`. El programa público solo se
muestra cuando `publicado` es `true`.

**Reglas:**
- Solo se asignan trabajos con dictamen `aceptado` o `aceptado_con_observaciones` (HU-5).
- Cada trabajo dura 20 minutos; su hora es `horaInicio + 20 min × posición`.
- Dos sesiones no pueden usar la misma sala el mismo día con horarios que se crucen.