FROM node:12-alpine

ENV APP_HOME /usr/src/x5-test

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

RUN apk update && apk upgrade && apk add --no-cache git

COPY . $APP_HOME

RUN npm install --production
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE $PORT

CMD [ "npm", "start" ]


