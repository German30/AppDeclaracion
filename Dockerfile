# ---- Build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime ----
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist/app-declaracion-front/browser /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Where the backend lives from inside this container. On Docker Desktop,
# host.docker.internal reaches a backend running on the host (e.g. via
# `dotnet run` or the backend's own docker-compose exposing port 5000).
# Point this at a service name instead (e.g. http://api:5000) when both
# stacks share a Docker network.
ENV API_UPSTREAM=http://host.docker.internal:5000

EXPOSE 80
