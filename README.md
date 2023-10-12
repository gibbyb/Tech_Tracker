This project requires a db.js file in this directory. The file will look like this. 

```Javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```
This project also requires a .env file for the client and server side (In the root directory and client directory)
This file should contain a single line for our API key. The Server side .env will look like this:

```
API_KEY='YOURAPIKEY'
```

The client side .env will look like this:

```
REACT_APP_API_KEY='YOURAPIKEY'
```

This app connects to a database with a users and status_history table.

The users table has the following columns:

- user_id - int unsigned, primary key, Auto Increment
- name - varchar
- status - varchar
- time - datetime, default value: CURRENT_TIMESTAMP

The status_history table has the following columns:

- history_id - int unsigned, primary key, Auto Increment
- user_id - int unsigned, foreign key
- status - varchar
- time - datetime

The "users" table also has a trigger to update the status_history table upon updating the status of a user.

The trigger is set to **Time:** AFTER, **Event:** UPDATE **Type:** FOR EACH ROW and has the following SQL:

```SQL
BEGIN
  INSERT INTO status_history (user_id, status, time) VALUES (OLD.user_id, NEW.status, Now());
END
```

This means that the database takes care of the history table on it's own. This Website only displays
and updates the status of technicians, as per the APIs found in the index.js file.
