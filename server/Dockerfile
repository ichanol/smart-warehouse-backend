FROM node:alpine

WORKDIR /app

RUN npm install -g nodemon && npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]

