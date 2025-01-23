FROM node:20.14.0-alpine AS build
# FROM node:20.14.0 AS build
# FROM public.ecr.aws/lts/node:20.14.0 AS build
#FROM public.ecr.aws/lts/node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller base image for the final stage
FROM node:20.14.0-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built files and node_modules from the previous stage

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
