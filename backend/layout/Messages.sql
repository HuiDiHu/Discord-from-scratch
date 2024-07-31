/*
CREATE TABLE CHANNELS(
  channel_id SERIAL PRIMARY KEY,
  in_server INTEGER NOT NULL,
  channel_name VARCHAR(20) NOT NULL,
  CONSTRAINT fk_channel_constraint FOREIGN KEY (in_server) REFERENCES SERVERS (server_id) ON DELETE CASCADE 
);

CREATE TABLE CHANNEL_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  is_edited INTEGER DEFAULT 0,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL, 
  in_channel INTEGER NOT NULL, 
  CONSTRAINT fk_message_constraint FOREIGN KEY (in_channel) REFERENCES CHANNELS (channel_id) ON DELETE CASCADE 
);

CREATE TABLE DMS(
  dm_id SERIAL PRIMARY KEY,
  members VARCHAR[] NOT NULL check (array_position(members, null) is null)
);

CREATE TABLE DM_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_edited INTEGER DEFAULT 0,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL,
  in_dm INTEGER NOT NULL
);

CREATE TABLE GROUP_CHATS(
  group_id SERIAL PRIMARY KEY,
  members VARCHAR[] NOT NULL check (array_position(members, null) is null),
  groupName VARCHAR(20) NOT NULL
);

CREATE TABLE GROUP_MESSAGES(
  message_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_edited INTEGER DEFAULT 0,
  content VARCHAR(10000) NOT NULL,
  posted_by VARCHAR NOT NULL,
  in_group INTEGER NOT NULL,
  CONSTRAINT fk_message_constraint FOREIGN KEY (in_group) REFERENCES GROUP_CHATS (group_id) ON DELETE CASCADE
);
*/

--get all messages upon clicking on a dm
SELECT
  *
FROM
  DM_MESSAGES d
WHERE
  d.in_dm = <id of the dm selected by user>

--get all messages upon clicking on a channel
SELECT  
  *
FROM  
  CHANNEL_MESSAGES c
WHERE 
  c.in_channel = <channel id selected by user>

--get the most recent 50 messages upon clicking on a channel
SELECT  
  *
FROM  
  CHANNEL_MESSAGES c
WHERE 
  c.in_channel = <channel id selected by user>
ORDER BY 
  created_at DESC
LIMIT 50

--load the next 50 most recent messages upon clicking on a channel (after loading most recent 50)
SELECT  
  *
FROM  
  CHANNEL_MESSAGES c
WHERE 
  c.in_channel = <channel id selected by user>
ORDER BY 
  created_at DESC
LIMIT 50 OFFSET 50 * <number of times the user scrolled to the top>

--get all messages upon clicking on a group
SELECT  
  *
FROM  
  GROUP_MESSAGES g
WHERE 
  g.in_group = <group id selected by user>

  
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

--edit GROUP messages
UPDATE 
  GROUP_MESSAGES
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

--delete messages in GROUP
DELETE FROM 
  GROUP_MESSAGES
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

--send message in group
INSERT INTO GROUP_MESSAGES
  (
    content,
    posted_by,
    in_group 
  )
VALUES
  (
    <content>,
    <id of user who posted message>,
    <id of group the message was posted in>
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

--search for group messages in the search bar based on user input
SELECT  
    *
FROM    
    GROUP_MESSAGES g
WHERE
    g.content LIKE '%<user input in the search bar>%'
    AND 
        g.in_group = <id of the group the user is searching in>
