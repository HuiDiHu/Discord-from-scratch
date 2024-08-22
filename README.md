# Discord From Scratch

## A real time communication website heavily inspired by Discord.

This project is created using the PERN stack and a secondary redis database for cache. 

Features include:
* Real time chat interface with ability to edit and delete messages
* Customizable server and user profile
* Friendlist, message channels, and servers.

Website Link: http://discord-from-scratch.vercel.app

## Dev setup instructions
> Tested with npm v10.2.4 Node v20.11.1 

1. ```git clone``` the repository
2. set up environment variables in the frontend folder by creating a .env file and adding
   ```
   VITE_IS_DEV = true
   VITE_SERVER_DEV_URL = http://localhost:4000
   VITE_SERVER_URL = <your production client url>
   ```
3. set up environment variables in the backend folder by creating a .env file and adding 
   ```
   PORT = 4000
   IS_DEV = true
   CLIENT_URL = <your production server url>
   CLIENT_DEV_URL = http://localhost:5173
   DATABASE_NAME = <your postgreSQL database name>
   DATABASE_HOST = <your postgreSQL database host>
   DATABASE_USER = <your postgreSQL database user>
   DATABASE_PASSWORD = <your postgreSQL database password>
   DATABASE_PORT = 5432
   REDIS_URL = <your production redis url>
   JWT_SECRET = <128 byte secrets string>
   ```
4. Run development backend server with ```cd backend```, ```npm install```, and ```npm run dev```
5. Run development frontend server on another terminal with ```cd frontend```, ```npm install```, and ```npm run dev```

## How to set up the database
All postgreSQL table CREATE commands are in /backend/layout/tables.sql

## Known issues (Work In Progress)
* desync between main database and cache database due to render's redis free tier being non-persistent
* WIP: Stop using websocket to send blobs
* WIP: User profile page
* WIP: Adding file upload and multiple data types

## Endpoints
v1 backend API Documentation: todo

## Find a bug?
Before sending a PR, squash all your merges and file an issue first.

Contact andyhhdi@gmail.com or huidihu@utexas.edu for any questions.

**discord_from_scratch v1 - 8/13/2024**
