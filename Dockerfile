FROM node:14-slim

LABEL maintainer="dev@larsvansoest.nl"
LABEL version="1.0.0"
LABEL description="Docker container that is built automatically."

ARG HOME_DIR="/home/squadjs"
WORKDIR ${HOME_DIR}

COPY . .

# Install required source.
RUN yarn --ignore-optional install

CMD ["node", "index.js"]