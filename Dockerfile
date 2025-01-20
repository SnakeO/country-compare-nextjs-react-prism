# 1. Use Node.js 18 as the base image for the build
FROM node:18 AS builder

# 2. Set the working directory within the container
WORKDIR /app

# 3. Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all files from your local app directory into the container
COPY . .

# 6. Build the Next.js app (production-ready output in .next/)
RUN npm run build

# ----------------------------------------------

# 7. Use a smaller Node.js image for running the app
FROM node:18 AS runner

# 8. Set the working directory in the container
WORKDIR /app

# 9. Copy only the essential files needed for production into this smaller image
COPY package.json package-lock.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# 10. Set an environment variable for production mode
ENV NODE_ENV=production

# 11. Expose port 3000 so the app is accessible externally
EXPOSE 3000

# 12. The command to start the app in production
CMD ["npm", "start"]