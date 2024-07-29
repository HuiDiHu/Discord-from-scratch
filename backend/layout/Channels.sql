/*
CREATE TABLE SERVERS(
  server_id SERIAL PRIMARY KEY,
  date_created DATE DEFAULT CURRENT_DATE, 
  server_icon BYTEA,
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

CREATE TABLE CHANNEL_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, /*includes time value unlike DATE*/
  is_edited INTEGER DEFAULT 0,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, /*holds userid*/
  in_channel INTEGER NOT NULL, /*holds channel_id*/
  CONSTRAINT fk_message_constraint FOREIGN KEY (in_channel) REFERENCES CHANNELS (channel_id) ON DELETE CASCADE --messages should be deleted automatically upon server/channel deletion
);
*/

--get all channels when clicking on server
SELECT 
  *
FROM
  CHANNELS c
WHERE
  c.in_server = <id of clicked server>

--create channel in server
INSERT INTO CHANNELS
(
  in_server,
  channelName,
)
VALUES
(
  <server id the channel was created in>,
  <input of the user for channel name>
)

--delete channel in server
DELETE FROM 
  CHANNELS
WHERE 
  channel_id = <id of channel to be deleted>

--rename channel name
UPDATE 
  CHANNELS
SET
  channelName = <new name>
WHERE 
  channel_id = <id of channel with name being changed>







