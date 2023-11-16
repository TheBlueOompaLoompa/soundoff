FROM oven/bun:1.0

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

EXPOSE 8000/tcp
CMD [ "bun", "run", "dev" ]
