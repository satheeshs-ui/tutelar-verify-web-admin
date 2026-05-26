# Stage 1: Build React app
FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build:uat

# Stage 2: Serve using NGINX
FROM nginx:alpine

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port used internally by NGINX
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
