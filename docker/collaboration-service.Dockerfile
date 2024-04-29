FROM node:20

WORKDIR /app

RUN npm i -g @nestjs/cli

COPY backend/collaboration-service/package*.json ./

RUN npm install

COPY backend/collaboration-service/. .

EXPOSE 3000

CMD ["nest", "start"]
