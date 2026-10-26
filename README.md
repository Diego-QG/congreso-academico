# Congreso Académico Estudiantil

Proyecto de Programación Web 2026-2 · Universidad de Lima · Tema 6

## Cómo correrlo

```bash
npm install
npm run dev
```

Para probar el acceso, cree una cuenta desde «Crear cuenta» y luego inicie
sesión con ese correo y contraseña en el mismo navegador. Las cuentas del
prototipo se guardan localmente; no existe una cuenta de prueba predeterminada.
Después de ingresar, cada rol llega a su espacio (autor a «Mis trabajos»,
revisor a «Mi bandeja» y comité a «Edición»). El rol de comité debe ser asignado
por la organización y no aparece en el registro público. Para recorrer HU-2
localmente, use «Entrar como comité (demo)» en el inicio de sesión. Ese botón
crea una sesión de demostración en este navegador; no es un acceso real ni debe
estar habilitado en producción. Esta autenticación local no debe usarse en producción.

## Historias

| Historia | Responsable | Carpeta |
| --- | --- | --- |
| HU-1 · Cuenta y acceso | Hugo | `src/features/cuenta` |
| HU-2 · Configuración de la edición | Josué | `src/features/edicion` |
| HU-3 · Envío de trabajos | Carlos | `src/features/trabajos` |
| HU-4 · Asignación de revisiones | Alonso | `src/features/asignaciones` |
| HU-5 · Revisión y dictamen | Diego-QG | `src/features/revisiones` |
| HU-6 · Programa del congreso | Sacha | `src/features/programa` |
| HU-7 · Métricas y usuarios | - | `src/features/metricas` |

La estructura del código y sus reglas están en [`docs/arquitectura.md`](docs/arquitectura.md).
El formato de los datos compartidos está en [`docs/contrato-datos.md`](docs/contrato-datos.md).

## Reglas del equipo

1. Nadie sube directo a `main`.
2. Antes de empezar: `git checkout main` → `git pull` → crear rama.
3. Ramas con el formato `tipo/descripcion` (ej. `feat/mis-trabajos`, `fix/login`, `refactor/estructura`).
4. Todo entra por Pull Request revisado por otro integrante.
5. Nunca se suben archivos copiados o descargados encima del repo: siempre se trabaja en la carpeta clonada.
6. Lo que está en `src/shared` se cambia solo avisando al grupo.
