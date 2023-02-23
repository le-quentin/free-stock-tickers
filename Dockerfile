# First stage, copying yarn packages files
FROM node:18.14-alpine as yarn-packages

# Expose app port, with the APP_PORT env var
ENV APP_PORT=3000
EXPOSE ${APP_PORT}

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

# Copy whole app, then remove everything but the package.json files
COPY src src
RUN find src \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

#Second stage, using the previous image to build the app 
FROM node:18.14-alpine

WORKDIR /app
COPY --from=yarn-packages /app .

# Install all dependencies
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Run the app
CMD [ "yarn", "start"]
