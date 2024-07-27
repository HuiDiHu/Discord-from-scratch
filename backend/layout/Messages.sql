/*
CREATE TABLE CHANNELS(
  channel_id SERIAL PRIMARY KEY,
  in_server INTEGER NOT NULL,
  channelName VARCHAR(20) NOT NULL,
  CONSTRAINT fk_channel_constraint FOREIGN KEY (in_server) REFERENCES SERVERS (server_id) ON DELETE CASCADE --if in_server does not match a server_id, the channel row is deleted automatically
);

CREATE TABLE DMS(
  dm_id SERIAL PRIMARY KEY,
  members VARCHAR[] NOT NULL check (array_position(members, null) is null)
  /*
  user1_id INTEGER NOT NULL, 
  user2_id INTEGER NOT NULL
  */
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
*/

--get all messages upon clicking on a dm
SELECT
  *
FROM
  DM_MESSAGES m
WHERE
  m.in_dm = <id of the dm selected by user>

--get all messages upon clicking on a channel
SELECT  
  *
FROM  
  CHANNEL_MESSAGES c
WHERE 
  c.in_channel = <channel id selected by user>

--edit DM messages
UPDATE 
  DM_MESSAGES
SET 
  content = <updated content>,
  is_edited = 1
WHERE 
  message_id = <id of message being updated>

--edit CHANNEL messages
UPDATE 
  CHANNEL_MESSAGES
SET 
  content = <updated content>,
  is_edited = 1
WHERE 
  message_id = <id of message being updated>

--delete messages in DM
DELETE FROM 
  DM_MESSAGES
WHERE 
  message_id = <id of message to be deleted>

--delete messages in CHANNEL
DELETE FROM 
  CHANNEL_MESSAGES
WHERE 
  message_id = <id of message to be deleted>

--send message in DM
INSERT INTO DM_MESSAGES
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
INSERT INTO CHANNEL_MESSAGES
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

--search for DM messages in the search bar based on user input
SELECT  
    *
FROM    
    DM_MESSAGES d
WHERE
    d.content LIKE '%<user input in the search bar>%'
    AND 
        d.in_dm = <id of the DM the user is searching in>

--search for channel messages in the search bar based on user input
SELECT  
    *
FROM    
    CHANNEL_MESSAGES d
WHERE
    d.content LIKE '%<user input in the search bar>%'
    AND 
        d.in_channel = <id of the channel the user is searching in>
