# blog api

## Introduction

blog-api is a project that allows you to create and host your own blog just by interacting with the api endpoints from your frontend using the fetch api or htmx etc.
My main goal with this project is to provide an open source api that allows developers to create their blog with ease. it also allow other developers to implement their creative ideas into it. 

## Technologies

This project is mainly using express as an http requests handler, its also using mongodb to save your blogs data.
here is a list of frameworks and packages used in this project:
  * **[expressjs](https://expressjs.com/):** a nodejs web application framework, used to build the api endpoints and handle incoming http requests.
  * **[mongoose](https://mongoosejs.com/):** an npm package that facilates interacting with mongodb.
  * **[jest](https://jestjs.io/) & [supertest](https://www.npmjs.com/package/supertest):** both are well known libraries used to test programs in general. 
  * **[pm2](https://www.npmjs.com/package/pm2):** a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

## Endpoints:

Currently, myblog api provides 6 different endpoints that will allow you to perform CRUD actions directly to your database. Here a list of them:

### GET `/get_blogs`

this endpoint returns all the blogs data from the database, here are some examples of how the response looks like:

**response:**
```json
{
  "status": 200,
  "error": null,
  "data": {
    "blogs": [
      {
        "_id": "65900df29c592f885580ca0b",
        "title": "example",
        "author": "example",
        "postedAt": 1703939570610,
        "lastModified": 0,
        "content": "blah blah blah blah blah",
        "upVotes": 7,
        "downVotes": 1,
        "visible": true,
        "views": 0,
        "__v": 0
      }
    ],
    "length": 1
  }
}
```

### POST `/add_blog`

`/add_blogs` is used to add new blogs into the database. it takes a post requests, accepts application/json data and takes the next parameters:

 * **title**: the new blog's title.
 * **author**: the blog's author.
 * **content**: the blog's content/body.

a success response from this endpoint looks like this:
```json
{
  "status": 200,
  "error": null,
  "data": null
}
```

### POST `/delete_blog`

as the name indicates, delete_blog is used to delete a blog from the database. this one takes only one parameter in a format of an object, which is basically the query that mongoose is gonna take to delete it.
the response looks exactly like the one above.

### POST `/edit_blog`

used to modify fields of a specific blog, like content and title ect. it takes two parameters, one is the blog id that you want to modify, and a props object to specify what you're trying to modify. the success response looks like this:

**request content:**

```json
{
    "id": "65900df29c592f885580ca0b",
    "props": {
        "content": "new Hello"
    }
}
```

**response:**

```json
{
    "status": 200,
    "error": null,
    "data": {
        "before": {
            "_id": "65900df29c592f885580ca0b",
            "title": "myblog",
            "author": "mark",
            "postedAt": 1703939570610,
            "lastModified": 0,
            "content": "Hello",
            "upVotes": 7,
            "downVotes": 1,
            "visible": true,
            "views": 0,
            "__v": 0
        },
        "after": {
            "_id": "65900df29c592f885580ca0b",
            "title": "myblog",
            "author": "mark",
            "postedAt": 1703939570610,
            "lastModified": 0,
            "content": "new Hello",
            "upVotes": 7,
            "downVotes": 1,
            "visible": true,
            "views": 0,
            "__v": 0
        }
    }
}
```

### POST `/upvote` and `/downvote`

both endpoints complete each other, they are basically used to upvote or downvote a specific blog. that's why the only parameter they take is "id". and their success response is exactly the same for `/add_blog` and `/delete_blog`. here is a demo of the payload:

```json
{
    "id": "65900df29c592f885580ca0b"
}
```

## How to use with the fetch api?

if you're familiar with javascript, you'll definitely be familiar with the built-in fetch api that you can use to make http requests. for those who are confused on how to do that, here are some examples:

this function sends a get request to `/get_blogs` and receives back the blogs data if available 
 ```js
async function getBlogs() {
  let response;
  try {
    response = await fetch("http://localhost:8080/get_blogs").then((data) => data.json());
  } catch(err) {
    console.log(err);
  }

  return response;
}
 ```

another example for post requests, the same function can be used for the rest of them after changing the passed fields:

```js
async function addBlog(props) {
  let response;
  try {
    response = await fetch("http://localhost:8080/add_blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    }).then((data) => data.json());
  } catch (err) {
    console.log(err);
  }

  if(response.status !== 200) return {
    success: false,
    error: `unexpected status code. expected 200, got ${response.status}`
  }
  else return {
    success: true,
    error: null
  };
}

await addBlog({
  title: "My First Blog",
  author: "J. Mark",
  content: "just any content you wanna add really."
});
```

this example is (kind of) all you need to make requests to the post endpoints.

## Testing

the tests for this api can be found in the `test/` folder. to test the api you can run this command:

```
npm run test
```

## Requirements & Setup

now that you've reached this part, let's talk about how you can get started with this api. follow the steps down bellow to get started:

#### Requirements

* Nodejs v18 or above
* git

#### Setup

1. Clone the latest version of this repo, you can do this by running this command on your terminal:

```
git clone https://github.com/mowgly11/blog-api.git
```

2. change directory to the project, you can do it using:

```
cd blog-api
```

3. install the dependecies, this command can get that done:

```
npm install
```

4. rename the `.env.example` to `.env` and fill the required information there. example:

```env
UI_SERVER_IP=192.168.1.18

ADMIN_IP=192.168.1.1

PORT=8080

MONGODB_CONNECT_URL=mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1 //local database, requires mongodb to be installed locally
```

5. and Finally, run the api using:

```
npm run start
```

after that it should be good to go in your localhost:port.


## Contibutions

contributions are welcome! feel free to add your creative ideas to the project. i will review them and approve your requests! really glad to have other people work on this no matter how skilled you are.

last updated: 03/01/2024 3:24PM GMT+1
