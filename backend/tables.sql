/* TODO: delete previous users table in public schema and add the updated table */
/*
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL,
    email VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    userid VARCHAR NOT NULL UNIQUE
);
*/

CREATE TABLE USERS(
  user_id SERIAL PRIMARY KEY, /*don't need to insert values for this column*/
  date_registered DATE DEFAULT CURRENT_DATE, /*don't need to insert values for this column*/
  username VARCHAR(28) NOT NULL,
  passhash VARCHAR(28) NOT NULL,
  email VARCHAR(28) NOT NULL UNIQUE,
  profilePicture BYTEA, /*stands for bytearray. extra steps are required for inserting*/
  friendList INTEGER[1000], /*array to hold user_id*/
  serverList INTEGER[100] /*array to hold server_id*/
  dmList INTEGER[] /*array to hold dm_id*/
);

CREATE TABLE SERVERS(
  server_id SERIAL PRIMARY KEY,
  date_created DATE DEFAULT CURRENT_DATE 
  serverName VARCHAR(20) NOT NULL UNIQUE,
  serverOwner INTEGER NOT NULL, /*to hold user_id*/
  serverMembers INTEGER[1000] /*array to hold user_id*/
  serverChannels INTEGER[10] /*array to hold channel_id*/
);

CREATE TABLE CHANNELS(
  channel_id SERIAL PRIMARY KEY,
  channelName VARCHAR(20) NOT NULL,
  channelMessages INTEGER[] /*array to hold message_id*/
);

CREATE TABLE DMS(
  dm_id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL, /*combine with user2_id to make array?*/
  user2_id INTEGER NOT NULL, 
  dmMessages INTEGER[] /*array to hold message_id*/
);

CREATE TABLE MESSAGES(
  message_id SERIAL PRIMARY KEY,
  posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*includes time value unlike DATE*/
  content VARCHAR(10000) NOT NULL,
  posted_by INTEGER NOT NULL, /*holds user_id*/
  in_channel INTEGER /*holds channel_id (can be null)*/
  in_dm INTEGER /*holds dm_id (can be null)*/
);
