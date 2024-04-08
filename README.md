# smockr

CLI tools for serve supple mock server with random fake data using <a href="https://github.com/faker-js/faker">Faker.js</a>

## Features

 * Using [Bun](https://github.com/oven-sh/bun)
 * Using [Next.js](https://github.com/vercel/next.js) API routes
 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Random fake data using [Faker.js](https://github.com/faker-js/faker)
 * Schema validation using JSON Schema
 * Flexible on-demand response (can modify body, status, headers, and delayed response)
 * No data storage needed

## Getting Started

Setup smockr

```
$ npm install --global smockr
```

## Usage

Running with default params

```
$ smockr
```

Running with custom params

```
$ smockr \
--port 3000 \
--secret "mysecret" \
--allowOrigin "*.kitabisa.com,*.kitajaga.id" \
--allowMethods "GET,POST,PATCH" \
--allowHeaders "Content-Type,Authorization"
```

See a list of all available options

```
$ smockr --help
```

See a installed version

```
$ smockr --version
```
