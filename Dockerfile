FROM node:13-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 9090

CMD npm run Dev