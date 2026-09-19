FROM node:20-alpine

WORKDIR /app

# Install dependencies for sharp, canvas, prisma + ghostscript/poppler/pandoc for PDF thumbnails/text/conversion
RUN apk add --no-cache libc6-compat openssl python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev ghostscript poppler-utils pandoc-cli

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "-p", "4000", "-H", "0.0.0.0"]
