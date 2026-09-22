# Build context must be the repository root (docker-compose.yml sets it),
# porque este Dockerfile necesita copiar los proyectos hermanos (Domain,
# Application, Infrastructure) referenciados por AppDeclaracion.Api.

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
# Puerto en el que Kestrel escucha dentro del contenedor (ver ASPNETCORE_HTTP_PORTS
# en docker-compose.yml); se expone ese mismo puerto para que el mapeo host:contenedor sea 1 a 1.
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/AppDeclaracion.Api/AppDeclaracion.Api.csproj", "src/AppDeclaracion.Api/"]
COPY ["src/AppDeclaracion.Application/AppDeclaracion.Application.csproj", "src/AppDeclaracion.Application/"]
COPY ["src/AppDeclaracion.Domain/AppDeclaracion.Domain.csproj", "src/AppDeclaracion.Domain/"]
COPY ["src/AppDeclaracion.Infrastructure/AppDeclaracion.Infrastructure.csproj", "src/AppDeclaracion.Infrastructure/"]
RUN dotnet restore "src/AppDeclaracion.Api/AppDeclaracion.Api.csproj"

COPY src/ src/
RUN dotnet publish "src/AppDeclaracion.Api/AppDeclaracion.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AppDeclaracion.Api.dll"]
