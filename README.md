# myblog api

## Introduction

myblog-api is basically a blog api that allows you to create and host your own blog just by interacting with the api endpoints from your frontend using the fetch api or htmx etc.
my main goal with this project is to provide an open source api that allows developers to create their blog with ease. and also allow other developers to include their creative ideas into it. 

## Technologies

This project is mainly using express as an http requests handler, its also using mongodb to save your blogs data.
here is a list of frameworks and packages used in this project:
  * **[expressjs](https://expressjs.com/):** a nodejs web application framework, used to build the api endpoints and handle incoming http requests.
  * **[mongoose](https://mongoosejs.com/):** an npm package that facilates interacting with mongodb.
  * **[jest](https://jestjs.io/) & [supertest](https://www.npmjs.com/package/supertest):** both are well known libraries used to test programs in general. 
  * **[pm2](https://www.npmjs.com/package/pm2):** a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

## Endpoints:

Currently, myblog api provides 6 different endpoints that will allow you to perform CRUD actions directly to your database. Here a list of them:

### `GET /get_blogs`
