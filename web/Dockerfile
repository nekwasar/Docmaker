FROM node:20-alpine

WORKDIR /app

# Install dependencies for sharp, canvas, prisma + ghostscript/poppler for PDF thumbnails/text
RUN apk add --no-cache libc6-compat openssl python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev ghostscript poppler-utils

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "-p", "4000", "-H", "0.0.0.0"]
