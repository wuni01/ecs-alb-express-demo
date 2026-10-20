FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./
ENV NODE_ENV=production
ENV PORT=80
ENV APP_VERSION=v2
EXPOSE 80
CMD ["node", "server.js"]
