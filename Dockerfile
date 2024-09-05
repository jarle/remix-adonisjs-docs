FROM node:20-alpine

RUN apk add git

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm i -g serve

COPY . .

RUN npm run docs:build

EXPOSE 3000
CMD [ "serve", "-s", "docs/.vitepress/dist" ]
