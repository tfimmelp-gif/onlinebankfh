FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV WRANGLER_LOG_PATH=.wrangler/wrangler.log
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=4007 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 northstar
COPY --from=builder --chown=northstar:nodejs /app ./
USER northstar
EXPOSE 4007
CMD ["npm","run","start"]
