FROM node:18.14-alpine

# Expose app port, with the APP_PORT env var
ENV APP_PORT=3000
EXPOSE ${APP_PORT}

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
# Do it by just copying package.json, which means in the absence of changes we can take advantage of docker
# layers to avoid reinstalling at every build
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Run the app
CMD [ "npm", "start"]


