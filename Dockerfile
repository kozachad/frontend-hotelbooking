# Build stage: Use Node.js image to build the React app
FROM node:20 AS build
WORKDIR /app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . ./

# Build the React app for production
RUN npm run build

# Production stage: Use Nginx to serve the built app
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy built React app from the build stage
COPY --from=build /app/build ./

# Copy custom Nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
