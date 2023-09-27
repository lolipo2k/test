FROM node:16.18.1-alpine3.15 As development

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

FROM node:16.18.1-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/backend/dist ./dist

CMD ["node", "dist/main"]