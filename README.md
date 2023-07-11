This project requires a db.js file in this directory. The file will look like this. 

```Javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql',
  user: 'gpt_user',
  password: 'Gulfport1',
  database: 'gpt_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```
