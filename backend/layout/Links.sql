/*
CREATE TABLE INVITE_TOKENS(
  invite_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  token VARCHAR(6) NOT NULL UNIQUE,
  references_server INTEGER NOT NULL
  CONSTRAINT fk_server_constraint FOREIGN KEY (references_server) REFERENCES SERVERS (server_id) ON DELETE CASCADE
)
*/

--create new invite token
INSERT INTO INVITE_TOKENS
(
  token,
  references_server,
)
VALUES
(
  <random 6 digit token generated in backend>,
  <id of server the token is for>
)

--delete invite token when the user tries to use it after it expires (after 1 day)
DELETE FROM 
  INVITE_TOKENS
WHERE
  token = <user input>

--check if the token exists in the table (if it exists, run the query that adds the user to the associated server)
SELECT 
  references_server
FROM 
  INVITE_TOKENS
WHERE
  token = <user input>
