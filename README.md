<p align="center">
  <a href="https://kitabisa.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset=".github/assets/logo-light.svg">
      <img alt="Smocker" src=".github/assets/logo-light.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  Supple mock server with random fake data using <a href="https://github.com/faker-js/faker">Faker.js</a>
</p>

<p align="center">
  <a href="https://github.com/kitabisa/smocker/actions/workflows/deploy-stg.yaml"><img src="https://github.com/kitabisa/smocker/actions/workflows/deploy-stg.yaml/badge.svg" alt="Deploy Stg" /></a>
</p>

------

## Features

 * Using [Bun](https://github.com/oven-sh/bun)
 * Using [Next.js](https://github.com/vercel/next.js)
 * Written in [Typescript](https://github.com/microsoft/TypeScript)
 * Get random fake data using [Faker.js](https://github.com/faker-js/faker)
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

## How to use?

Example hit from client app:

```
async function getUsers() {
  const queryParams = new URLSearchParams({
    smocker: {
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

  const response = await fetch(`https://geni.kitabisa.xyz/smocker/users?${queryParams}`, {
    method: "GET",
    headers: {
      "X-Smocker-Secret": `${process.env.SMOCKER_SECRET_KEY}`,
    },
  });
  
  const users = await response.json();
  console.log(users);
}
```
