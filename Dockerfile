FROM node:22-alpine AS build

WORKDIR /home/node/app

COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY ./src ./src
COPY ./tsconfig.build.json ./tsconfig.json ./
COPY ./types ./types

RUN npm run build

RUN npm prune

FROM node:22-alpine

WORKDIR /home/node/app

COPY --from=build /home/node/app/dist ./dist
COPY --from=build /home/node/app/node_modules ./node_modules

CMD ["node", "dist/app.js"]