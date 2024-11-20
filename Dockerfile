FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install && \
    mkdir -p output    

EXPOSE 3000

ENTRYPOINT ["npx", "ts-node", "src/benchmark.ts"]