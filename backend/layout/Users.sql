/*
  CREATE TABLE USERS(
    id SERIAL PRIMARY KEY, /*don't need to insert values for this column*/
    date_registered DATE DEFAULT CURRENT_DATE, /*don't need to insert values for this column*/
    username VARCHAR(28) NOT NULL,
    email VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    userid VARCHAR NOT NULL UNIQUE, --PURPOSE?
    profilePicture BYTEA /*stands for bytearray. extra steps are required for inserting*/
  );
*/

--getting user servers, friendlist, dms, and groupchats are all handled by redis 

--create new account
INSERT INTO USERS
(  
  username,
  email,
  passhash,
  userid,
  profilePicture
)
VALUES
(
  <user input for username>,
  <user input for email>,
  <user input for password after being hashed>,
  <user id> --created by random generator probably
  <user profile picture>
)

--delete account
DELETE FROM 
  USERS
WHERE
  id = <id of user to be deleted>

--change pfp
UPDATE 
  USERS 
SET 
  profilePicture = <new profile picture>
WHERE 
  id = <id of user>

--change username
UPDATE 
  USERS 
SET 
  username = <new username>
WHERE 
  id = <id of user>

--change password
UPDATE 
  USERS 
SET 
  passhash = <user input for new password after being hashed>
WHERE 
  id = <id of user>

--allows users to change userid or email?







