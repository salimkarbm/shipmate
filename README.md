# SHIPMATE

## Introduction

Shipmate is an interstate delivery platform,this platform allows people to send items to other geographical states through individuals traveling to those destinations...This project will provide api for the corresponding web app.

## API Documentation

 An Express based RESTful API design was used to access a Postgres database for data storage and retrieval.
 This API provides the following Endpoints, documentation for the API can be found here [Shipmate]()


## Technologies used

This project was build with the following stack:

* [Node](https://nodejs.org/en/) (Javacript runtime).
* [Express](https://expressjs.com/) (For creating endpoints, routing, and serving files).
* [TypeScript](https://www.typescriptlang.org/) (A super set of Javacript).
* [KnexJs](https://knexjs.org/guide/) (Postgres SQL query builder).
* [ObjectionJs](https://knexjs.org/guide/) (Postgres SQL query build on knexJs).
* [PostgreSQL](https://www.postgresql.org/) (for creating database).

  All of these dependencies required are listed in the package.json file. Use `npm install` on the command line. Environment variables are defined in a .env file on the root of the project folder.

> However, you will may need to install node and postgreSQL on your local machine

* Other dependencies required are listed in the package.json file. Use `npm install` on the command line
* Environment variables are defined in a .env file. You can find a example.env file in the config folder to guide you on setting up your .env file.


## How to Setup and contribute 

The steps outline will provide a walkthrough on how to install or setup the app on your local machine and start contributing.

* Open the terminal and execute the following command to make a local copy of the project `git clone`
* Run $ `cd Shipmate` to navigate into the folder
* Run $ `git pull origin Dev` to get the latest version
* Run $ `npm install` from your terminal in your project directory to install all dependencies
* Add a connection to the original repo using $ `git remote add origin`. 
* Run git $ `remote -v` to verify that the connection is established
* create a .env file on the root of the project and fill it with the necessary details from example.env file
* Once these are set, start an instance of Postgres ensure Postgres is started on port **5432**.
  NOTE: Depending on your system configuration it may be necessary to install db-migrate globally, i.e.

  ```
  npm intstall -g db-migrate
  ```
* Run $`npm run start:dev` to start the app.
* Make your contributions to your local copy of the project.
* Run $ `git add filename`, `git commit -m "commit message"` to add and commit your contributions
* Run $ `git push origin proposed-feature-name` to push your changes to your copy of the repository
* If you feel you've made a contribution that will improve the project, raise a Pull Request against Dev branch.
Be descriptive enough about your contributions so other contributors will understand what you've done


### Working with Database:

* Creating new migration file `npm run migrate:dev:add  table name` example npm run migrate:dev:add users_table
* To run the next migration that has not yet been run `npm run migrate:dev:up`
* To rollback the last batch of migrations `npm run migrate:dev:rollback`
* To undo the last migration that was run`npm run migrate:dev:down`

### Linting and formating:
* To run eslint `npm run lint`
* To run prettier `npm run format`

### Pull Requests should:

* Contain code written in Typescript files.
* Lint and adhere to the [Airbnb javascript style guide](https://github.com/airbnb/javascript).


## Usage

To test out the endpoints, follow the following 

* Once all dependencies have been installed, in the terminal type `npm run start:dev` on your terminal to test the    endpoints  using postman or any other platform of your choice. you can find the app hosted link" [here]().


## Authors

Github:[@salimkarbm](https://github.com/salimkarbm)\
Twitter:[@salimkarbm](https://twitter.com/salimkarbm)\
Linkedin:[Salim Imuzai](www.linkedin.com/in/salimkarbim)