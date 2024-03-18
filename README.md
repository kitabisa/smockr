<h1 align="center">Smocker</h1>

<p align="center">
  Supple mock server with <a href="https://github.com/faker-js/faker">Faker.js</a>
</p>

<p align="center">
  <a href="https://github.com/kitabisa/smocker/actions/workflows/deploy-stg.yaml"><img src="https://github.com/kitabisa/smocker/actions/workflows/deploy-stg.yaml/badge.svg" alt="Deploy Stg" /></a>
</p>

------

## Features

 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Using [Next.js](https://github.com/vercel/next.js) (with catch all api route)
 * Get random fake data using [Faker.js](https://github.com/faker-js/faker)
 * Flexible on-demand response api (can modify body, status, headers, and delayed response)

## Getting Started

Setup Node.js:

```
$ brew install nvm
$ nvm install
```

## Quick Start

Install dependencies:

```
$ pnpm i
```

Run in local:

```
$ pnpm dev
```

## How to use?

Example:

```
async function getUsers() {
  const response = await fetch("https://smocker.kitabisa.xyz/users", {
    method: "GET",
    headers: {
      "X-Smocker-Body": JSON.stringify({
        api_code: 101000,
        data: [
          {
            id: 1,
            username: "{{internet.userName}}",
            email: "{{internet.email}}",
            avatar: "{{image.avatar}}",
            birthdate: "{{date.birthdate}}",
          },
          {
            id: 2,
            username: "{{internet.userName}}",
            email: "{{internet.email}}",
            avatar: "{{image.avatar}}",
            birthdate: "{{date.birthdate}}",
          },
          {
            id: 3,
            username: "{{internet.userName}}",
            email: "{{internet.email}}",
            avatar: "{{image.avatar}}",
            birthdate: "{{date.birthdate}}",
          }
        ],
        meta: {
          version: "v1.84.0",
          api_status: "unstable",
          api_env: "prod"
        },
      }),
      "X-Smocker-Status": 200,
      "X-Smocker-Header": JSON.stringify({
        "Content-Type": "application/json"
      }),
      "X-Smocker-Delay": 3000,
    },
  });
  const users = await response.json();
  console.log(users);
}
```
