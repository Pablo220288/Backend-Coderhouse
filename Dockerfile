FROM node:18.16.0

WORKDIR /backend-node

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm","run","dev"]
