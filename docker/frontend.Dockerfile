FROM node:20

WORKDIR /app

RUN npm install -g @angular/cli@17.3.3

COPY frontend/package*.json ./

RUN npm install

COPY frontend/. .

EXPOSE 4200

CMD ["ng", "serve", "--port", "4200", "--host", "0.0.0.0"]
