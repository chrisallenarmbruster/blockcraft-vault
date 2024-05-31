FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd server && npm install

EXPOSE 8000

CMD ["node", "server/src/index.js"]