<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

The Task Management App is a backend application designed to facilitate task management and improve productivity. Built using Nest.js, a modern Node.js framework, this application provides users with a robust backend system to create, track, and manage tasks efficiently.

### Live on Render: [Nest App](https://nest-app-3nf1.onrender.com)

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/KarimAbdelnasser/Nest-App.git
   ```

2. Install dependencies:

   ```bash
   cd Nest-App
   npm install
   ```

3. Configure environment variables:

Create a .env file in the project root directory and add the following environment variables:

    MONGO_URL_PRO= # MongoDB Atlas connection URL
    MONGO_URL=# MongoDB Compass connection URL
    JWT_SECRET= # Secret key for JWT authentication
    SALT= # Salt for password hashing
    PORT= # Port number for the server

- Make sure to provide the appropriate values for each environment variable.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
