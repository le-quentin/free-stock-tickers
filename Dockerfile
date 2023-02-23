FROM node:18.14-alpine

# Expose app port, with the APP_PORT env var
ENV APP_PORT=3000
EXPOSE ${APP_PORT}

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
# Do it by just copying package.json, which means in the absence of changes we can take advantage of docker
# layers to avoid reinstalling at every build
COPY package.json ./
COPY yarn.lock ./
COPY ./src/package.json ./src/
COPY ./src/http/package.json ./src/http/
COPY ./src/scrapers/package.json ./src/scrapers/
COPY ./src/service/package.json ./src/service/
RUN yarn install

# Bundle app source
COPY . .

# Run the app
CMD [ "yarn", "start"]


