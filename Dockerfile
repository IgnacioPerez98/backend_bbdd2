FROM node:lts-alpine3.16

WORKDIR /app

COPY . .

RUN mkdir /usr/local/sbin && \
    ln -s /usr/local/bin/node /usr/local/sbin/node && \
    yarn install

CMD node app.js
EXPOSE 3000
