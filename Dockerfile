FROM node:21-alpine as builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

# CMD ["npm", "run", "dev"]

FROM nginx
EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html