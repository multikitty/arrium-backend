# For Live 
FROM node:14
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 9000
RUN npm run build
CMD [ "npm", "start" ]

# For Local
# FROM node:14 as base
# WORKDIR /home/node/app
# COPY package.json ./
# RUN npm i
# COPY . .
# FROM base as production
# ENV NODE_PATH=./build
# RUN npm run build