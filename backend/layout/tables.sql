/* TODO: delete previous users table in public schema and add the updated table */
/*
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL,
    email VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    userid VARCHAR NOT NULL UNIQUE
);

CREATE TABLE USERS(
  id SERIAL PRIMARY KEY,
  date_registered DATE DEFAULT CURRENT_DATE,
  username VARCHAR(28) NOT NULL,
  email VARCHAR(28) NOT NULL UNIQUE,
  passhash VARCHAR NOT NULL,
  userid VARCHAR NOT NULL UNIQUE, 
  profilePicture BYTEA,
  serverList INTEGER[100]
);

CREATE TABLE DMS(
  dm_id SERIAL PRIMARY KEY,
  members VARCHAR[] NOT NULL check (array_position(members, null) is null)
);

CREATE TABLE MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, 
  in_channel INTEGER,
  in_dm INTEGER
);

*/

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

CREATE TABLE CHANNELS(
  channel_id SERIAL PRIMARY KEY,
  in_server INTEGER NOT NULL,
  channelName VARCHAR(20) NOT NULL,
  CONSTRAINT fk_channel_constraint FOREIGN KEY (in_server) REFERENCES SERVERS (server_id) ON DELETE CASCADE --if in_server does not match a server_id, the channel row is deleted automatically
);

CREATE TABLE DMS(
  dm_id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL, /*combine with user2_id to make array?*/ --sure! make sure both are not NULL
  user2_id INTEGER NOT NULL
);

CREATE TABLE MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*includes time value unlike DATE*/
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, /*holds userid*/
  in_channel INTEGER, /*holds channel_id (can be null)*/
  in_dm INTEGER, /*holds dm_id (can be null)*/
  CONSTRAINT fk_message_constraint FOREIGN KEY (in_channel) REFERENCES CHANNELS (channel_id) ON DELETE CASCADE --messages should be deleted automatically upon server/channel deletion
);


/* 
  TODO

  DM ADD FRIEND
  - when user add friend a DMS entry is created with their userid
  - the dm id is going to get stored inside redis "friends" and returned along with "friends" during initialize and "add_friend"
  
  LOAD DM ROOMS: should be in friendList after initialize

  LOAD MESSAGES
  - frontend will first check if dm id exist in dm context
  - if it does, filter messages by current dm id
  - if it doesn't, then when user selects a DM, frontend will do a get request and the backend will query all messages with in_dms = current dm id and send back to frontend

  SEND MESSAGES
  - on submit will make an async axios request to backend to update messages table
  - emit "create_message" with message {posted: new Date().toJSON(), content: message, posted_by: userid, in_channel: NULL, in_dm: dm_id}
*/

--edit messages
UPDATE 
  MESSAGES
SET 
  content = <updated content>
WHERE 
  message_id = <id of message being updated>

--delete messages
DELETE FROM 
  MESSAGES
WHERE 
  message_id = <id of message to be deleted>

--send message in DM
INSERT INTO MESSAGES
  (
    content,
    posted_by,
    in_dm 
  )
VALUES
  (
    <content>,
    <id of user who posted message>,
    <id of DM the message was posted in>
  )

--send message in channel
INSERT INTO MESSAGES
  (
    content,
    posted_by,
    in_channel 
  )
VALUES
  (
    <content>,
    <id of user who posted message>,
    <id of channel the message was posted in>
  )

--create DM entry after user adds friend
INSERT INTO
  DMS
VALUES 
  (
    <id of logged in user>,
    <id of user being sent the message>
  )

--gather all dms when user logs in
SELECT
  *
FROM
  DMS d 
WHERE 
  d.user1_id = <id of the signed in user>
  OR d.user2_id = <id of the signed in user>

--get all messages upon clicking on a dm
SELECT
  *
FROM
  MESSAGES m
WHERE
  m.in_dm = <id of the dm selected by user>

--get all messages upon clicking on a channel
SELECT  
  *
FROM  
  MESSAGES m
WHERE 
  m.in_channel = <channel id selected by user>

--potential way to gather all servers when user logs in (other way would be to test each server id within USERS serverList)
SELECT  
  * 
FROM
  SERVERS s 
WHERE
  <id of signed in user> IN s.serverMembers

--get all channels when clicking on server
SELECT 
  *
FROM
  CHANNELS c
WHERE
  c.in_server = <id of clicked server>



