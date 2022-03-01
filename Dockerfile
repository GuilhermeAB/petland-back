FROM node:16-alpine
WORKDIR /petland
COPY . /petland
RUN yarn set version 3.2.0
RUN yarn install