FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies so tsx is available)
RUN npm install

# Copy the rest of the application
COPY . .

# Build mastra framework so `.mastra/output` is generated
RUN npm run build

# Expose the API server port (Render will also provide the PORT env var)
EXPOSE 3001

# Start the API server utilizing tsx (avoids needing a separate tsc build step)
CMD ["npx", "tsx", "src/api/server.ts"]
