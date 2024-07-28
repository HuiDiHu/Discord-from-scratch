/*
CREATE TABLE USERS(
  id SERIAL PRIMARY KEY, /*don't need to insert values for this column*/
  date_registered DATE DEFAULT CURRENT_DATE, /*don't need to insert values for this column*/
  username VARCHAR(28) NOT NULL,
  email VARCHAR(28) NOT NULL UNIQUE,
  passhash VARCHAR NOT NULL,
  userid VARCHAR NOT NULL UNIQUE, 
  profilePicture BYTEA, /*stands for bytearray. extra steps are required for inserting*/
  serverList INTEGER[100] /*array to hold server_id*/ --THIS CAN BE DONE IN REDIS
);

CREATE TABLE SERVERS(
  server_id SERIAL PRIMARY KEY,
  date_created DATE DEFAULT CURRENT_DATE 
  serverName VARCHAR(20) NOT NULL UNIQUE,
  serverOwner INTEGER NOT NULL, /*to hold user_id*/
  serverMembers INTEGER[1000] /*array to hold user_id*/
);

CREATE TABLE DMS(
  dm_id SERIAL PRIMARY KEY,
  members VARCHAR[2] NOT NULL check (array_position(members, null) is null)
);

CREATE TABLE DM_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*includes time value unlike DATE*/
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, /*holds userid*/
  in_dm INTEGER NOT NULL /*holds channel_id*/
);
*/

--gather all dms when user logs in (handled by regis)

--create DM entry after user adds friend (needs to be updated for array)
INSERT INTO DMS
  (
    members
  )
VALUES 
  (
    ARRAY['id of logged in user', 'id of user being sent the message']
  )

