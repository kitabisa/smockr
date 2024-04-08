<p align="center">
  <a href="https://www.npmjs.com/package/smockr" target="_blank">
    <h1>smockr</h1>
  </a>
</p>

<p align="center">
  Supple mock server with random fake data using <a href="https://github.com/faker-js/faker">Faker.js</a>
</p>

<p align="center">
  <a href="https://github.com/kitabisa/smockr/actions/workflows/release-please.yaml"><img src="https://github.com/kitabisa/smockr/actions/workflows/release-please.yaml/badge.svg" alt="Release Please" /></a>
</p>

------

## Features

 * Using [Bun](https://github.com/oven-sh/bun)
 * Using [Next.js](https://github.com/vercel/next.js) API routes
 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Random fake data using [Faker.js](https://github.com/faker-js/faker)
 * Schema validation using JSON Schema
 * Flexible on-demand response (can modify body, status, headers, and delayed response)
 * No data storage needed

## Getting Started

Install smockr

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
--allowHeader "Content-Type,Authorization"
```

See a list of all available options

```
$ smockr --help
```

See a installed version

```
$ smockr --version
```
