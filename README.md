# Tech Tracker Website Using Node & React.

## Want to Contribute? Here is what you need to do!

Follow the below instructions

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
There is a db.js.example file already in the repo. Remove the .example and fill out the host, user, password, and database variables to connect to your database.

This project also requires a .env file for the client and server side (In the root directory and client directory)
This file should contain a single line for our API key. The Server side .env will look like this:

```
API_KEY='YOURAPIKEY'
```

The client side .env will look like this:

```
REACT_APP_API_KEY='YOURAPIKEY'
```
There is an example.env file in the root and client directory with the above lines already in them. Rename each file to ".env" and change the API key as well if you would like.

Use the same string for both API keys so that the API calls are successful!

### Now we will make some changes so that we can host the project locally and see our changes live.

In the index.js file, change the port in line 7 from 

```Javascript
const port = 3000
```

to

```Javascript
const port = 3001
```

as React will want to be hosted on port 3000, and that will be the website you will want to visit to get the live changes as you write them.

In the client/package.json file, you need to add a proxy to tell React that Node is running on a separate port. Here is what the file should look like if you used port 3001:

```JSON
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.16.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:3001"
}
```

There is also a package.json.example file with this change already made. If you chose port 3001, you can simply remove the original package.json file and rename the package.json.example file to package.json. If you chose another port, just make sure to change it in the file as well. The only addition you need to make is in the last few lines where "proxy" is.

Once you have made those changes, from the root directory of the project, run 

```Bash
npx nodemon index.js
```

This will start the node server and restart the node server upon any changes made.

Then from the client directory, run 

```Bash
npm start
```

This will host a live server at localhost:3000. You can now visit the website from localhost:3000 and any changes you make on the server or client side will change immediately on save!

You are ready to begin contributing!

## Database Information

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
