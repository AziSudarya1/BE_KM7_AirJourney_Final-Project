# Plane Ticket App

## Rest API Documentation

The API documentation can be found [here](https://bekm7airjourneyfinal-project-248678056888.asia-southeast2.run.app/docs).

## Development

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/mazyaa/BE_KM7_AirJourney_Final-Project.git
   ```

1. Change directory to the project

   ```bash
   cd BE_KM7_AirJourney_Final-Project
   ```

1. Install dependencies

   ```bash
   npm i
   ```

1. Create a copy of the `.env.example` file and name it `.env.local`. Make sure to fill the credentials correctly.

   ```bash
   cp .env.example .env.local
   ```

1. Run migrations

   ```bash
   npm run db:migrate
   ```

1. Run the app

   ```bash
   npm run dev
   ```

1. Run tests

   ```bash
   npm run test
   ```

1. Optional. Run generate OpenAPI documentation. Make sure to fill necessary environment variables in `.env.local` file before running this command.

   ```bash
   npm run openapi:generate
   ```

1. Optional. You can run Prisma Studio to see the data in the database directly on the browser

   ```bash
   npm run db:studio
   ```
