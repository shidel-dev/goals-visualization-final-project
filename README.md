### Setup

Requirements: PostgreSQL, MongoDB. On OS X both are available through brew.

Clone the repo, then run these commands to setup:
````
bundle install

rake db:create

rake db:migrate

rails server
````

