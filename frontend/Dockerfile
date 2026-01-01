# Multi-stage build for BioDockViz Frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runtime

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1000 -S biodock && \
    adduser -D -S -h /var/empty -u 1000 -G biodock -s /sbin/nologin biodock

WORKDIR /app

COPY --from=builder --chown=biodock:biodock /app/.next /app/.next
COPY --from=builder --chown=biodock:biodock /app/node_modules /app/node_modules
COPY --from=builder --chown=biodock:biodock /app/public /app/public
COPY --from=builder --chown=biodock:biodock /app/package.json /app/package.json

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://backend:8000

USER biodock

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
