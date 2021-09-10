FROM node:14

WORKDIR ./app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app


EXPOSE 9090

ENTRYPOINT ["sh", "entrypoint.sh"]