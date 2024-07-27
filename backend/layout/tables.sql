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
  date_created DATE DEFAULT CURRENT_DATE, 
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
  members VARCHAR[2] NOT NULL check (array_position(members, null) is null)
);

CREATE TABLE CHANNEL_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*includes time value unlike DATE*/
  is_edited INTEGER DEFAULT 0,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, /*holds userid*/
  in_channel INTEGER NOT NULL, /*holds channel_id*/
  CONSTRAINT fk_message_constraint FOREIGN KEY (in_channel) REFERENCES CHANNELS (channel_id) ON DELETE CASCADE --messages should be deleted automatically upon server/channel deletion
);

CREATE TABLE DM_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*includes time value unlike DATE*/
  is_edited INTEGER DEFAULT 0,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, /*holds userid*/
  in_dm INTEGER NOT NULL /*holds channel_id*/
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











