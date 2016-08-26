FROM node:5.10
MAINTAINER Andy Edwards

RUN mkdir -p /usr/src
WORKDIR /usr/src

ENV NODE_ENV=production

# IMPORTANT: Before copying app code, the package.json and npm-shrinkwrap.json files should be copied
# and npm installed.  That way these layers can be reused if the app code changes but the deps don't.

COPY package.json /usr/src/app/
RUN cd app && npm install

COPY lib /usr/src/app/

CMD ["node", "app/index.js"]
