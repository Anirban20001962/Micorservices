FROM node:14.17.1-alpine

WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .

CMD ["npm","start"]