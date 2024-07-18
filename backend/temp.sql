/* TODO: delete previous users table in public schema and add the updated table */
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    email VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);
