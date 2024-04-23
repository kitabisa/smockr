FROM oven/bun:1

# setup labels
LABEL repository="https://github.com/kitabisa/smockr"
LABEL maintainer="adeherysh"

# setup arg
ARG PORT
ARG SECRET_KEY
ARG ALLOWED_ORIGIN
ARG ALLOWED_METHODS
ARG ALLOWED_HEADERS

# setup env
ENV NODE_ENV=production
ENV PORT=$PORT
ENV SECRET_KEY=$SECRET_KEY
ENV ALLOWED_ORIGIN=$ALLOWED_ORIGIN
ENV ALLOWED_METHODS=$ALLOWED_METHODS
ENV ALLOWED_HEADERS=$ALLOWED_HEADERS

# copy binary
COPY bin .

# run the app
USER bun
EXPOSE $PORT/tcp
ENTRYPOINT [ "bun", "run", "bin/server.js" ]
