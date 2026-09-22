# AppDeclaracion

Backend de una app web para ayudar a personas físicas en México a preparar su declaración anual del SAT. Cubre cuatro regímenes: **RESICO Personas Físicas**, **Sueldos y Salarios**, **Actividad Empresarial y Profesional** y **Arrendamiento**.

> Proyecto de portafolio con fidelidad razonable a la LISR vigente. Las tasas y tarifas (RESICO, tarifa anual Art. 152, tope de deducciones personales) están parametrizadas en el código y deben verificarse contra la publicación oficial del SAT/DOF para el ejercicio fiscal que se declare.

## Stack

- .NET 9 / ASP.NET Core Web API
- Entity Framework Core + MySQL (Pomelo.EntityFrameworkCore.MySql)
- ASP.NET Core Identity + JWT Bearer para autenticación
- Swagger UI (Swashbuckle) para explorar y probar la API
- xUnit para pruebas unitarias
- Docker / Docker Compose

## Arquitectura

Clean Architecture por capas:

```
src/
  AppDeclaracion.Domain          Entidades y calculators puros de cada régimen (sin dependencias externas)
  AppDeclaracion.Application     Casos de uso, DTOs, interfaces (repositorio, JWT, usuario actual)
  AppDeclaracion.Infrastructure  EF Core + MySQL, Identity, JwtTokenService, migraciones
  AppDeclaracion.Api             Controllers, Program.cs, Swagger, Dockerfile

tests/
  AppDeclaracion.Domain.Tests        Unit tests de los calculators fiscales (sin BD)
  AppDeclaracion.Application.Tests   Unit tests del servicio orquestador (repositorio en memoria)
```

## Cómo correrlo

### Opción 1: Docker (recomendado)

Requiere Docker y Docker Compose.

```bash
cp .env.example .env
# edita .env si quieres cambiar la contraseña de MySQL o la llave JWT
docker compose up -d --build
```

Esto levanta MySQL y la API (con migraciones aplicadas automáticamente al arrancar). La API queda en `http://localhost:5000`, con Swagger en `http://localhost:5000/swagger`.

Para bajar el stack: `docker compose down` (agrega `-v` si también quieres borrar los datos de MySQL).

### Opción 2: Local con `dotnet run`

Requiere el SDK de .NET 9 y una instancia de MySQL accesible.

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=appdeclaracion;User=root;Password=<tu-password>;" --project src/AppDeclaracion.Api
dotnet user-secrets set "Jwt:SigningKey" "<una-llave-larga-y-aleatoria>" --project src/AppDeclaracion.Api

dotnet ef database update --project src/AppDeclaracion.Infrastructure --startup-project src/AppDeclaracion.Api

dotnet run --project src/AppDeclaracion.Api
```

Swagger queda disponible en la URL que indique la consola (perfil `http` o `https` de `launchSettings.json`).

## Pruebas

```bash
dotnet test
```

28 pruebas unitarias: cálculo de ISR por régimen (RESICO, Sueldos, Actividad Empresarial, Arrendamiento), tarifa anual, tope de deducciones personales, y el flujo consolidado del `DeclaracionAnualService`.

## Endpoints principales

**Auth**
- `POST /api/auth/registro` — crea un usuario y regresa un JWT.
- `POST /api/auth/login` — autentica y regresa un JWT.

**Declaraciones** (requieren `Authorization: Bearer <token>`)
- `POST /api/declaraciones` — crea una declaración para un ejercicio fiscal.
- `GET /api/declaraciones` — lista las declaraciones del usuario autenticado.
- `GET /api/declaraciones/{id}` — detalle de una declaración.
- `PUT /api/declaraciones/{id}/ingresos/resico` — captura ingresos mensuales RESICO.
- `PUT /api/declaraciones/{id}/ingresos/sueldos` — captura ingreso gravado e ISR retenido (constancia de percepciones).
- `PUT /api/declaraciones/{id}/ingresos/actividad-empresarial` — captura ingresos, deducciones autorizadas y pagos provisionales.
- `PUT /api/declaraciones/{id}/ingresos/arrendamiento` — captura ingresos, tipo de deducción (ciega 35% o real) y pagos provisionales.
- `PUT /api/declaraciones/{id}/deducciones-personales` — captura deducciones personales.
- `POST /api/declaraciones/{id}/calcular` — ejecuta el cálculo consolidado y regresa el ISR causado, retenido y el saldo a favor/a cargo.

La documentación interactiva completa (con esquemas de request/response) está en Swagger.
