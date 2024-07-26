/*

*/

--get all channels when clicking on server
SELECT 
  *
FROM
  CHANNELS c
WHERE
  c.in_server = <id of clicked server>
