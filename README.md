## NestJS Boilerplate

### Description

A Nest service that handles different types of digital contents and categorize them.
It handles Videos, PDFs and images.


### Dependencies

Set node version using:
```bash
$ nvm use
```


To install the projects dependencies, run the following command:

```bash
$ npm install
```

> For M1 Users check [here](###M1-Users)

### Running the app

We need an instance of mySQL running to connect to and also one from RabbitMQ. For that, we have a docker-compose file to help. Just execute the following command to spin it up:

```bash
$ docker-compose up db queue
```

> For M1 Users check [here](###M1-Users)

You also need to have the .env file configured correctly. To do that, just create a copy of `environments/.env.local` named `environments/.env`.

Once that's done, we can run the app with one of these:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Testing

We have several kinds of tests for our application:

```bash
# unit tests
$ npm run test:unit

# integration tests
$ npm run test:int

# component tests
$ npm run test:component

# to run all tests at once
$ npm run test
```

#### Database migrations

To automatically generate a new migration based on our TypeORM entities, simply execute:

```bash
npm run typeorm migration:generate -- -n <NameOfTheMigration>
```

### M1 Users

Issues you may find while setup:

* [`npm install`] Puppeteer: The chromium binary is not available for arm64. Add to your `~/.zshrc`
```
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=`which chromium`
```

* [`docker-compose up db`] MySQL image: no matching manifest for linux/arm64/v8 in the manifest list entries. You need to pull the image manually:
```bash
$ docker pull --platform linux/amd64 mysql:8.0.20
```
> In case you're still facing issues running it, try to install rosetta `softwareupdate --install-rosetta`
