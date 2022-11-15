FROM node:16.15.0-alpine as builder

LABEL org.opencontainers.image.title="X Service"
LABEL org.opencontainers.image.authors=tech.acquisitions@sanar.com
LABEL org.opencontainers.image.source=https://gitlab.com/sanardigital/y/boilerplate-service.git

EXPOSE 3000

RUN apk add --no-cache tini curl

WORKDIR /sanar

ENTRYPOINT ["/sbin/tini", "--"]

# DEVELOPMENT STAGE
FROM builder as development
ENV NODE_ENV=development

RUN apk add --no-cache git

USER node
RUN git config --global --add safe.directory /sanar

CMD ["npm", "run", "start:dev"]

# PRODUCTION STAGE
FROM builder as production

ENV NODE_ENV=production

COPY --chown=node ./scripts/env.sh ./env.sh
RUN ["chmod", "+x", "/sanar/env.sh"]

COPY --chown=node package*.json ./
COPY --chown=node node_modules ./node_modules
RUN npm prune --production
COPY --chown=node dist ./dist

USER node

CMD ["/bin/sh", "-c", "source /sanar/env.sh && npm run start:prod"]
