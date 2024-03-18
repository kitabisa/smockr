FROM node:lts-slim

ARG GIT_COMMIT
ARG VERSION
LABEL REPO="https://github.com/kitabisa/smocker"
LABEL GIT_COMMIT=$GIT_COMMIT
LABEL VERSION=$VERSION
ENV GIT_COMMIT=$GIT_COMMIT
ENV VERSION=$VERSION
ENV NODE_ENV=production

WORKDIR /opt/smocker

COPY ./.next/standalone /opt/smocker/

RUN chmod -R 777 /opt/smocker/.next
RUN chmod -R 777 /opt/smocker/node_modules

# Create appuser
RUN adduser --disabled-password --gecos '' smocker

USER smocker

CMD ["node", "server.js"]
