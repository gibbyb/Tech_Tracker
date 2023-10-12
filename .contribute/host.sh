#!/bin/bash

mv ./develop/index.js.example ../index.js
mv ./develop/db.js.example ../db.js
mv ./node_example.env ../.env
mv ./develop/package.json.example ../client/package.json
mv ./develop/react_example.env ../client/.env

cd ..
npm install
cd client
npm install
cd ..
echo
echo "Before you host the app, make sure to update the db.js file with your database credentials."
echo
echo "To host the app, run \"npx nodemon index.js\" in the root directory."
echo "This will start the node server."
echo
echo "In another terminal window/tab, from the client directory run \"npm start\"."
echo "This will start the react server."
echo "You can now visit the app at http://localhost:3000/"
