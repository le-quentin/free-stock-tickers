FROM node:18.14-alpine

# Expose app port, with the APP_PORT env var
ENV APP_PORT=3000
EXPOSE ${APP_PORT}

# Copy the necessary files to install
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

# Install all dependencies
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Run the app
CMD [ "yarn", "start"]
