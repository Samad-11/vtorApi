Here is a sample `README.md` file for your project:

````md
# Turf Management System

This project is a Turf Management System that allows you to manage turf details, bookings, and other related functionalities.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure Node.js is installed. You can verify this by running:
  ```bash
  node -v
  ```
````

- **npm**: Ensure npm is installed along with Node.js:
  ```bash
  npm -v
  ```
- **PostgreSQL**: You must have PostgreSQL installed and running on your machine. Create a database and update the connection string in the `.env` file.

## Environment Variables

Create a `.env` file in the root directory of your project and include the following:

```bash
DATABASE_URL=""
PORT=
ENV=
SERVER_URL=
JWT_SECRET=
```

Ensure you modify the `DATABASE_URL` to match your database configuration.

## Installation

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Project

### Development Mode

To run the project in development mode:

1. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will start the server using `nodemon`, which automatically restarts the server when changes are detected in the source files.

2. **Access the application:**

   Open your browser and go to [http://localhost:3000](http://localhost:3000).

### Production Mode

To build and run the project in production mode:

1. **Build the project:**

   ```bash
   npm run build
   ```

   This command compiles the TypeScript code into JavaScript and stores the output in the `dist` directory.

2. **Start the production server:**

   ```bash
   npm start
   ```

   The server will run on the port specified in your `.env` file (default is `3000`).

3. **Access the application:**

   Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Linting

To ensure code quality and consistency, you can run the following commands:

- **Lint the code:**

  ```bash
  npm run lint
  ```

- **Lint and automatically fix issues:**
  ```bash
  npm run lint-fix
  ```

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are welcome.

## License

This project is licensed under the MIT License.
