<p align="center">
  <a href="https://kitabisa.com">
    <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kitabisa/smockr/main/.github/assets/logo-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kitabisa/smockr/main/.github/assets/logo-light.svg"><img src="https://raw.githubusercontent.com/kitabisa/smockr/main/.github/assets/logo-light.svg" alt="smockr" width="350" height="70"></picture>
  </a>
</p>

<p align="center">
  Supple mock server with flexible on-demand response and optional get random fake data using <a href="https://github.com/faker-js/faker">Faker.js</a>
</p>

<p align="center">
  <a href="https://github.com/kitabisa/smockr/actions/workflows/ci.yaml"><img src="https://img.shields.io/github/actions/workflow/status/kitabisa/smockr/ci.yaml?branch=main" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@kitabisa/smockr"><img src="https://img.shields.io/npm/dt/@kitabisa/smockr.svg" alt="NPM Downloads"></a>
  <a href="https://hub.docker.com/r/kitabisa/smockr"><img src="https://img.shields.io/docker/pulls/kitabisa/smockr" alt="Docker Pull"></a>
  <a href="https://github.com/kitabisa/smockr/releases"><img src="https://img.shields.io/github/v/release/kitabisa/smockr" alt="Latest Release"></a>
  <a href="https://github.com/kitabisa/smockr/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@kitabisa/smockr.svg" alt="License"></a>
</p>

------

## Features

 * Using [Bun](https://github.com/oven-sh/bun)
 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Flexible on-demand response (can modify body, status, headers, and delayed response)
 * Optional get random fake data using [Faker.js](https://github.com/faker-js/faker)
 * Request body validation using [JSON Schema](https://json-schema.org/learn/miscellaneous-examples)
 * No data storage needed

## Getting Started

Setup smockr with npm

```
$ npm install -g @kitabisa/smockr
```

Setup smockr with bun

```
$ bun add -g @kitabisa/smockr
```

Setup smockr with docker

```
$ docker pull kitabisa/smockr
```

## Quick Start

### Run with node or bun

Running mock with default params

```
$ smockr
```

Running mock with custom params

```
$ smockr \
--port 3000 \
--secret "mysecret" \
--allowOrigin "https://kitabisa.com" \
--allowMethods "GET, POST, PATCH" \
--allowHeaders "Content-Type, Authorization"
```
When you define `secret` as a parameter and is not empty string, the client request must be include `X-Smockr-Secret` header with the same value

See a list of all available options

```
$ smockr --help
```

See a installed version

```
$ smockr --version
```

### Run with docker

Running mock with default params

```
$ docker run -p 8080:8080 --rm \
kitabisa/smockr
```

Running mock with custom params

```
$ docker run -p 3000:8080 --rm \
-e SECRET_KEY="mysecret" \
-e ALLOWED_ORIGIN="https://kitabisa.com" \
-e ALLOWED_METHODS="GET, POST, PATCH" \
-e ALLOWED_HEADERS="Content-Type, Authorization" \
kitabisa/smockr
```

## Usage

### Body

Specify a search body param to retrieve a response with that body.

```http
GET http://localhost:8080/?mock[response][body]={"ping":"pong"}


HTTP/1.1 200 OK
content-type: application/json
content-length: 18

{
  "ping": "pong"
}
```

Specify a search body param with random fake data using [faker.js api helpers fake](https://fakerjs.dev/api/helpers#fake).

```http
GET http://localhost:8080/?mock[response][body]={"id":{{number.int({"min":100000,"max":900000})}},"name":"{{person.fullName}}","avatar":"{{image.avatar}}"}


HTTP/1.1 200 OK
content-type: application/json
content-length: 107

{
  "id": 429178,
  "name": "Allen Brown",
  "avatar": "https://avatars.githubusercontent.com/u/97165289"
}
```

### Status

Specify a search status param get back that code status. The status must be
inside the range 200 to 599.

```http
GET http://localhost:8080/?mock[response][status]=301


HTTP/1.1 301 Moved Permanently
content-type: application/json
content-length: 0
```

### Headers

Specify a search headers param as json string to get them back.

```http
GET http://localhost:8080/?mock[response][headers]={"x-hello":"world"}


HTTP/1.1 200 OK
content-type: application/json
content-length: 0
x-hello: world
```

### Delay

Specify a search delay param in milliseconds in order to delay the response.

```http
GET http://localhost:8080/?mock[response][delay]=3000


HTTP/1.1 200 OK
content-type: application/json
content-length: 0
```

### Schema Validation

Specify a search schema validation in json schema (stringify) to set request body validation.

```http
POST http://localhost:8080/?mock[request][body][schema]={"type":"object","properties":{"name":{"type":"string"},"age":{"type":"integer","minimum":17}},"required":["name"]}

{
  "age": 20
}


HTTP/1.1 400 Bad Request
content-type: application/json
content-length: 84

{
  "code": 400,
  "message": "Requires property name",
  "type": "SchemaValidationException"
}
```

### Health check

Predefined health check route.

```http
GET http://localhost:8080/health-check


HTTP/1.1 200 OK
content-type: application/json
content-length: 24

{
  "health_check": "up"
}
```

## Caveats

Some cases in production server, there may be problems related to `Request-URI too large`. If you are using kubernetes ingress, try to apply this configuration:
```yml
annotations:
  nginx.ingress.kubernetes.io/client-header-buffer-size: 100k
  nginx.ingress.kubernetes.io/large-client-header-buffers: 4 100k
  nginx.ingress.kubernetes.io/server-snippet: |
    client_header_buffer_size 100k;
    large_client_header_buffers 4 100k;
```


## Contributing

Want to contribute? Awesome! You can find information about contributing to
this project in the [CONTRIBUTING.md](https://github.com/kitabisa/smockr/blob/main/CONTRIBUTING.md)
