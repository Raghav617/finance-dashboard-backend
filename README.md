# Finance Dashboard Backend API

A robust backend service for managing financial records, users, and generating dashboard summaries.

## Tech Stack
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JWT** (Authentication)
- **Joi** (Input Validation)

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory based on the `.env.example` (ensure `MONGO_URI` is pointing to your MongoDB instance).
4. Run `npm run start` or `node server.js` to start the server.

## Default Roles
- **Admin**: Full access. Can create/edit/delete records, view dashboards, and manage users.
- **Analyst**: Can view records and view the aggregated dashboard summaries.
- **Viewer**: Read-only access to standard individual records.

## Design Highlights
- **Soft Deletes**: Records are never truly deleted from the database to maintain financial audit trails; they are flagged as `isDeleted`.
- **Aggregation Framework**: Dashboard summaries utilize MongoDB's aggregation pipeline for hyper-efficient data calculation on the DB layer.
- **Centralized Error Handling & Validation**: Uses Joi to ensure dirty data never touches the controllers.
