FROM node:20.15.1-alpine3.20

WORKDIR /discord-bot/

# Copies source code files (not included in .dockerignore) to the working directory location 
COPY ./ ./

# SSH key directory and file operations
RUN mkdir ~/.ssh/
RUN mv deployments_private_key ~/.ssh/deployments_private_key
RUN chmod 600 ~/.ssh/deployments_private_key
RUN mv db-config.json ./db-config.json
RUN mv ai-config.json ./ai-config.json

# Necessary packages
RUN apk add git openssh

# Update npm
RUN npm install -g npm@10.8
RUN npm install --save

# Remove SSH key file, if found
RUN rm -rf ~/.ssh/deployments_private_key

# CMD specifies commands that should be ran at runtime (when an instance has started)
CMD ["npm", "run", "start"]