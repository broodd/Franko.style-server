### Base
FROM node:14-alpine as base
ENV NODE_ENV=production

RUN apk update --no-cache
RUN mkdir /app && chown -R node:node /app

USER node
WORKDIR /app

# Copy base dependencies describing
COPY --chown=node:node ./static ./static
COPY --chown=node:node ./src ./src

COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./tsconfig*.json ./
COPY --chown=node:node ./.env ./

RUN npm install --only=production


### Builder
FROM base as builder

RUN npm install --only=development
RUN npm run build


### Runtime
FROM node:14-alpine as runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy runtime dependencies
COPY --chown=node:node --from=base /app/node_modules ./node_modules
COPY --chown=node:node --from=base /app/.env ./
COPY --chown=node:node --from=base /app/package.json ./
COPY --chown=node:node --from=base /app/static ./static
COPY --chown=node:node --from=builder /app/dist ./dist

CMD ["npm", "run", "start"]
