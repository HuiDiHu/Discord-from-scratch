/*TODO 

(upon clicking server)
1. Load Channels
2. Load Server Members
3. Load Messages Of First Channel

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

*/

--gather all servers the user is in (handled by regis)

--create server with icon
INSERT INTO SERVERS
(
  server_icon,
  serverName,
  serverOwner,
  serverMembers
)
VALUES 
(
  <icon of server>,
  <name of server>,
  <id of server creator>,
  ARRAY[<id of server creator>] --start with 1 index array holding id of server creator, then add other users later
)

--create server without icon
INSERT INTO SERVERS
(
  serverName,
  serverOwner,
  serverMembers
)
VALUES 
(
  <name of server>,
  <id of server creator>,
  ARRAY[<id of server creator>] --start with 1 index array holding id of server creator, then add other users later
)

--change server name
UPDATE 
  SERVERS
SET 
  serverName = <name>
WHERE
  server_id = <id of server having name changed>

--change server icon
UPDATE 
  SERVERS
SET 
  server_icon = <icon>
WHERE
  server_id = <id of server having icon changed>

--add user/joining server
UPDATE 
  SERVERS 
SET 
  serverMembers = array_append(serverMembers, <id of new user>)
WHERE 
  server_id = <id of server having name changed>

--remove user/leaving server
UPDATE 
  SERVERS 
SET 
  serverMembers = array_remove(serverMembers, <id of new user>)
WHERE 
  server_id = <id of server having name changed>

--changing server ownership
UPDATE
  SERVERS 
SET 
  serverOwner = <user id of new owner>
WHERE
  server_id = <id of server with ownership being transferred>

--deleting server
DELETE FROM 
  SERVERS
WHERE 
  server_id = <id of server being deleted>


