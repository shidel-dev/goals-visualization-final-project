## LifeBar - "Fill your life with goals, not tasks."

LifeBar is for the things in life you want to do, not the things you need to do.

This is a Rails app using NoSQL MongoDB, and a custom front-end logic layer over Raphael.js.


### Setup

Requirements: PostgreSQL, MongoDB. On OS X both are available through brew.

Clone the repo, then run these commands to setup:
````
bundle install

rake db:create

rake db:migrate

rails server
````
