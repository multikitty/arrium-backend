FROM node:14

# WORKDIR /home/node/app

# COPY package*.json ./

# RUN npm i

# COPY . .

# FROM base as production

# ENV NODE_PATH=./build

# EXPOSE 9000

# RUN npm run build
#RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
RUN npm run build
CMD [ "node", "start" ]

# FROM node:12.13-alpine as production
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --only=production
# COPY . .
# COPY --from=development /app/dist ./dist
# EXPOSE 5000
# CMD npm run start:prod