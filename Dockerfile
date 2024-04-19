FROM oven/bun:1
WORKDIR /usr/src/app

# setup labels
LABEL repository="https://github.com/kitabisa/smockr"
LABEL maintainer="adeherysh"

# copy binary files
COPY bin /usr/src/app/
COPY dist /usr/src/app/

# setup env
ENV NODE_ENV=production

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "dist/cli.js" ]
