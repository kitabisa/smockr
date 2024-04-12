# smockr

CLI tools for serve supple mock server with random fake data using <a href="https://github.com/faker-js/faker">Faker.js</a>

## Features

 * Using [Bun](https://github.com/oven-sh/bun)
 * Using [Express.js](https://github.com/expressjs/express) for API routes
 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Random fake data using [Faker.js](https://github.com/faker-js/faker)
 * Schema validation using JSON Schema
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
$ bun --watch server.ts
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
  ping: "pong"
}
```

Specify a search body param with random generate mock data using faker.js.

```http
GET http://localhost:8080/?mock[response][body]={"name":"{{person.fullName}}","avatar":"{{image.avatar}}"}


HTTP/1.1 200 OK
content-type: application/json
content-length: 87

{
  name: "Allen Brown",
  avatar: "https://avatars.githubusercontent.com/u/97165289"
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

Specify a search header param as json string to get them back.

```http
GET http://localhost:8080/?mock[response][headers]={"x-hello":"world"}


HTTP/1.1 200 OK
x-hello: world
content-length: 0
```

### Delay

Specify a search delay param in milliseconds in order to delay the response.

```http
GET http://localhost:8080/?mock[response][delay]=3000
```

### Schema Validations

Specify a search schema validation in json schema (stringify) to set request body validations.

```http
GET http://localhost:8080/?mock[request][body][schema]=${{ stringify json schema }}
```

### Health check

Predefined health check route.

```http
GET http://localhost:8080/health-check


HTTP/1.1 200 OK
content-type: application/json
content-length: 24

{
  health_check: "up"
}
```
