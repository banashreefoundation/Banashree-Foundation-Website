# Server Dockerfile (production)
FROM node:20.17.0-alpine AS build

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.17.0-alpine

WORKDIR /home/node/app

COPY package*.json ./

# Install all dependencies (including devDependencies like mongoose-sequence)
RUN npm install

COPY --from=build /home/node/app/build ./build

# Copy the data folder with default images metadata (to build/data, not build/src/data)
COPY src/data ./build/data

# Copy default images from git to container
COPY uploads ./default-uploads

# Create uploads directory
RUN mkdir -p /home/node/app/uploads

# Expose the server port
EXPOSE 4001

# Copy default images to uploads folder if it's empty, then start server
CMD cp -n default-uploads/* /home/node/app/uploads/ 2>/dev/null || true && node build/server.js