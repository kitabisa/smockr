<p align="center">
  <a href="https://kitabisa.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kitabisa/smockr/main/.github/assets/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kitabisa/smockr/main/.github/assets/logo-light.svg">
      <img src="https://raw.githubusercontent.com/kitabisa/smockr/main/.github/assets/logo-light.svg" alt="smockr" width="350" height="70">
    </picture>
  </a>
</p>

<p align="center">
  Supple mock server with random fake data using <a href="https://github.com/faker-js/faker">Faker.js</a>
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
 * Using [Express.js](https://github.com/expressjs/express)
 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Random fake data using [Faker.js](https://github.com/faker-js/faker)
 * Request body validation using [JSON Schema](https://json-schema.org/learn/miscellaneous-examples)
 * Flexible on-demand response (can modify body, status, headers, and delayed response)
 * No data storage needed

## Getting Started

Setup Bum (Bun Version Manager):

```
$ curl -fsSL https://github.com/owenizedd/bum/raw/main/install.sh | bash
$ source ~/.zshrc
$ bum use
```
Bum is supported on Linux x86_64 and Darwin x86_64 (Mac OS),<br/>
You can enter `uname -ms` command in your terminal to see yours.

## Quick Start

Install dependencies:

```
$ bun install
```

Run in local:

```
$ PORT=8080 \
SECRET_KEY="" \
ALLOWED_ORIGIN="*" \
ALLOWED_METHODS="GET, HEAD, PUT, PATCH, POST, DELETE" \
ALLOWED_HEADERS="*" \
bun server.ts
```
When you define `SECRET_KEY` as a parameter and is not empty string, the client request must be include `X-Smockr-Secret` header with the same value

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

Specify a search body param with random fake data using faker.js.

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
