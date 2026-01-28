FROM node:23.3.0-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

FROM node:23.3.0-alpine3.21 AS prod

RUN apk add --no-cache tzdata=2025b-r0 && \
    cp /usr/share/zoneinfo/America/Santiago /etc/localtime && \
    echo "America/Santiago" > /etc/timezone && \
    addgroup -S -g 10000 usercopa && adduser -S -u 10000 -G usercopa usercopa

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts --only=production

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/logs  \
    && chown -R userpreupdv:userpreupdv /logs

USER usercopa

EXPOSE 3000/tcp
CMD ["node", "dist/main"]
