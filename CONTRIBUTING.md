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

Setup Bum (Bun Version Manager):

```
$ curl -fsSL https://github.com/owenizedd/bum/raw/main/install.sh | bash
$ source ~/.zshrc
$ bum use
```
Bum is supported on Linux x86_64 and Darwin x86_64 (Mac OS),<br/>
You can enter `uname -ms` command in your terminal to see yours.

## Quick Start

Setup environment (and modify your env):

```
$ cp .env.example .env
```

Install dependencies:

```
$ bun install
```

Run in local:

```
$ bun dev
```

Run in prod:

```
$ bun run build && bun .next/standalone/server.js
```

## Usage

### Body

Specify a search body param to retrieve a response with that body.

```http
GET http://localhost:3000/?mock\[response\]\[body\]={"ping":"pong"}


HTTP/1.1 200 OK
content-type: application/json
content-length: 15

{"ping":"pong"}
```

### Status

Specify a search status param get back that code status. The status must be
inside the range 200 to 599.

```http
GET http://localhost:3000/?mock\[response\]\[status\]=301


HTTP/1.1 301 Moved Permanently
content-type: application/json
content-length: 0
```

### Headers

Specify a search header param as json string to get them back.

```http
GET http://localhost:3000/?mock\[response\]\[headers\]={"x-hello":"world"}


HTTP/1.1 200 OK
x-hello: world
content-length: 0
```

### Delay

Specify a search delay param in milliseconds in order to delay the response.

```http
GET http://localhost:3000/?mock\[response\]\[delay\]=1000
```

### Schema Validations

Specify a search schema validation in json schema (stringify) to set request body validations.

```http
GET http://localhost:3000/?mock\[request\]\[body\]\[schema\]=${{ stringify json schema }}
```

## Example Code

```
async function getUsers() {
  const queryParams = new URLSearchParams({
    smockr: {
      response: {
        body: {
          api_code: 101000,
          data: [
            ...(() => {
              let items = [];
              for (let i = 0; i < 10; i++) {
                items.push({
                  id: 1,
                  username: "{{internet.userName}}",
                  email: "{{internet.email}}",
                  avatar: "{{image.avatar}}",
                  birthdate: "{{date.birthdate}}",
                });
              }
              return items;
            })()
          ],
          meta: {
            version: "v1.84.0",
            api_status: "unstable",
            api_env: "prod"
          },
        },
        headers: {
          "Content-Type": "application/json"
        },
        status: 200,
        delay: 3000,
      },
    },
  }).toString();

  const response = await fetch(`http://localhost:3000/users?${queryParams}`, {
    method: "GET",
    headers: {
      "X-Smockr-Secret": `${process.env.SMOCKER_SECRET_KEY}`,
    },
  });
  
  const users = await response.json();
  console.log(users);
}
```
