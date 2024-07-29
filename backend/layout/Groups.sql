/*
CREATE TABLE GROUP_CHATS(
  group_id SERIAL PRIMARY KEY,
  members INTEGER[10] NOT NULL check (array_position(members, null) is null),
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

--load all group chats the user is a part of (handled by regis)

--creating group chat
INSERT INTO GROUP_CHATS
(
  members,
  groupName
)
VALUES 
(
  ARRAY[<id of user1>], --initialize group chat with the id of the person who created it, and then add more ids later
  <name of group>
)

--editing name of group chat
UPDATE 
  GROUP_CHATS
SET
  groupName = <the new name>
WHERE
  group_id = <id of group chat the user is editing>

--adding members/joining group chat
UPDATE 
  GROUP_CHATS
SET
  members = array_append(members, <id of added user>) --may have to do nested query to get id of added user if we decide to add by email
WHERE
  group_id = <id of group chat the user is adding to>

--removing members/leaving group chat
UPDATE
  GROUP_CHATS
SET
  members = array_remove(members, <id of removed user>)
WHERE 
  group_id = <id of group chat the user is removing from>

--deleting group chat
DELETE FROM 
  GROUP_CHATS
WHERE 
  group_id = <id of the group chat to be deleted>








