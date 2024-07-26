/*TODO 
(upon user login)
1. Find User And Record Information
2. Load Servers
3. Load Friend List

(upon clicking server)
1. Load Channels
2. Load Server Members
3. Load Messages Of First Channel

(upon clicking channel)
1. Load Messages Of Clicked Channel

(upon clicking dm or user in friend list)
1. Load Messages Of Dm
2. Load 2 Users Of Dm
*/

--potential way to gather all servers when user logs in (other way would be to test each server id within USERS serverList)
SELECT  
  * 
FROM
  SERVERS s 
WHERE
  <id of signed in user> IN s.serverMembers

--load all the servers the user is a part of upon their login (better way)
SELECT 
    *
FROM 
    SERVERS s,
    USERS u
WHERE 
    s.