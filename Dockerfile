FROM oven/bun:1
WORKDIR /usr/src/app

# setup labels
LABEL repository="https://github.com/kitabisa/smockr"
LABEL maintainer="adeherysh"

# setup arg
ARG SECRET_KEY
ARG ALLOWED_ORIGIN
ARG ALLOWED_METHODS
ARG ALLOWED_HEADERS

# setup env
ENV NODE_ENV=production
ENV PORT=8080
ENV SECRET_KEY=$SECRET_KEY
ENV ALLOWED_ORIGIN=$ALLOWED_ORIGIN
ENV ALLOWED_METHODS=$ALLOWED_METHODS
ENV ALLOWED_HEADERS=$ALLOWED_HEADERS

# copy binary
COPY ./bin /usr/src/app/

# run the app
USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "run", "server.js" ]
