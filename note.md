<%= locals.title %>: This will output the value of locals.title into your HTML, escaping any HTML characters for security.

<%- locals.title %>: This will output the value of locals.title into your HTML without escaping, allowing HTML content to be rendered.

#### To update the updatedAt field in Mongoose

when saving a document, you typically don't need to manually update it unless you're doing some specific operations that don't automatically trigger Mongoose's update timestamps feature. Here's how you can ensure updatedAt updates correctly:

Using Mongoose's Timestamps Option
Mongoose has a built-in feature to handle createdAt and updatedAt timestamps automatically if you specify { timestamps: true } in your schema options.

##### Define Your Schema:

Ensure your Mongoose schema for Post includes the timestamps option. Here’s an example:

```
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically add `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model("Post", postSchema);
```

In this schema definition, timestamps: true instructs Mongoose to automatically manage createdAt and updatedAt fields.

##### Updating a Document:

When you update a document and save it, Mongoose will automatically update the updatedAt field for you:

```
const Post = require("./models/Post");

// Example of updating a post
async function updatePost(postId, newTitle) {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }

        post.title = newTitle;
        await post.save(); // `updatedAt` will be automatically updated

        console.log("Post updated successfully");
    } catch (error) {
        console.error("Error updating post:", error);
    }
}
```

// Usage example
`updatePost("668da78ac0f3dee81024e63e", "Updated Title");`

We find the post by its `_id`

Modify the title field.

Call post.save() to persist changes. Mongoose will automatically update the updatedAt field for you.
Manually Updating updatedAt
If you need to manually update updatedAt for some reason (though it's generally not recommended because Mongoose handles this automatically), you can do so like this:

```
const post = await Post.findById(postId);
post.title = "Updated Title";
post.updatedAt = new Date(); // Manually update `updatedAt`
await post.save();
```

However, ensure you have a specific reason for manually updating updatedAt, as Mongoose's automatic handling is typically more reliable and less error-prone.

By following these steps, you can effectively manage and update the updatedAt field in your Mongoose documents based on your application's requirements.

---

The line ``const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");` uses the replace method along with a regular expression to remove special characters from the searchTerm string. Here’s how it works:

Regular Expression Explanation:

`/[^a-zA-Z0-9 ]/g`: This is a regular expression pattern enclosed in slashes (/). It specifies a character class ([^...]) that matches any character not in the range a-z, A-Z, 0-9, or a space ( ).
g flag: This flag stands for "global" and ensures that the replacement is applied to all occurrences in the string, not just the first one.
String Method replace:

`searchTerm.replace(regex, "")`: This method searches for substrings that match the regular expression regex (in this case, `/[^a-zA-Z0-9 ]/g)` within the searchTerm string.
When a match is found (i.e., when a special character is encountered), it replaces it with an empty string (""), effectively removing it from the string.
Characters that are not in the specified range (a-z, A-Z, 0-9, space) are removed because of the ^ character at the beginning of the character class [^...], which negates the class.
Result:

After executing `searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");`, searchNoSpecialChar will contain the searchTerm string with all special characters removed.

Example:
If searchTerm is "Hello! World123", the regular expression /[^a-zA-Z0-9 ]/g will match the exclamation mark (!). The replace method will replace it with an empty string, resulting in searchNoSpecialChar being "Hello World123".

---

#### MongoDB Query:

```
const data = await Post.find({
  $or: [
    { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
    { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
  ],
});
```

Performs a MongoDB query using Mongoose's find() method on the Post model.
The query searches for documents where either the title or the body fields match the searchNoSpecialChar string case-insensitively ("i" flag in the regular expression).

$or Operator:

The $or operator in MongoDB allows you to specify multiple conditions, where at least one condition must be true for the document to be included in the query results.
Array of Conditions:

Inside $or, there are two conditions defined as objects:
{ title: { $regex: new RegExp(searchNoSpecialChar, "i") } }
{ body: { $regex: new RegExp(searchNoSpecialChar, "i") } }
Regex Matching:

Each condition uses the $regex operator to perform a case-insensitive regular expression match ("i" flag) against the fields title and body.
new RegExp(searchNoSpecialChar, "i") dynamically creates a regular expression based on the sanitized searchNoSpecialChar string. This string is typically the sanitized search term without special characters.
Matching Criteria:

The first condition { title: ... } matches documents where the title field contains a substring that matches the searchNoSpecialChar string.
The second condition { body: ... } matches documents where the body field contains a substring that matches the searchNoSpecialChar string.
Logical OR Operation:

When MongoDB executes this query, it retrieves documents that satisfy either of the conditions defined in the $or array. This means a document will be included in the query results if either its title field matches the regex or its body field matches the regex.
Example:
If searchNoSpecialChar is "mongodb", the resulting MongoDB query would search for documents where:

The title contains "mongodb" (case-insensitive).
Or the body contains "mongodb" (case-insensitive).
This flexible querying mechanism allows you to search across multiple fields in your documents, providing robust search capabilities within MongoDB using regular expressions.

In regular expressions, the "i" flag (or "ignore case" flag) is used to perform a case-insensitive match. Here's how it works in MongoDB's $regex operator:

Case Sensitivity: By default, regular expressions in MongoDB are case-sensitive. This means that "MongoDB" and "mongodb" would be considered different strings.

Using the "i" Flag: When you include the "i" flag in your regular expression pattern, MongoDB will perform a case-insensitive match. This means that "MongoDB", "mongodb", "MoNgOdB", etc., would all match the pattern "mongodb".

The { $regex: new RegExp(searchNoSpecialChar, "i") } construct is a combination of JavaScript and MongoDB syntax used together for performing regular expression-based searches in MongoDB queries. Here's a breakdown of each part:

1. { $regex: ... } (MongoDB Syntax)
   Purpose: This part is specific to MongoDB. It allows you to specify a regular expression (regex) pattern as part of a query condition.
   Usage: Within MongoDB queries, { $regex: ... } is used to match fields against a regex pattern.
2. new RegExp(searchNoSpecialChar, "i") (JavaScript Syntax)
   Purpose: This part is pure JavaScript syntax for creating a regular expression object.
   Usage: In JavaScript, new RegExp(...) is used to create a regular expression object based on the provided pattern (searchNoSpecialChar in this case) and optional flags ("i" for case insensitivity).

When you configure express-session with connect-mongo using MongoStore.create, it automatically creates and manages a sessions collection in your MongoDB database. This collection is where express-session stores session information such as session IDs, session data, and expiry timestamps.

```
app.use(
  session({
    secret: "keyboard cat", // Secret used to sign the session ID cookie
    resave: false, // Avoid saving sessions that have not been modified
    saveUninitialized: true, // Save new sessions even if they are not modified
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // MongoDB connection string
    }),
    // Optional cookie configuration can also be specified here
  })
);
```

`_id`: Unique identifier for the session.
expires: Expiry time for the session data in MongoDB.
session: Serialized session data, including cookie details like originalMaxAge and expires.

session data in ythe MongoDB (sessions collection) is used by express-session for server-side session management, while cookies (like token) are used in the browser for client-side authentication and state management. Each serves a distinct role in managing user sessions and authentication in your web application.

### cOOKIE-PARSER

Here's a simple example of how you can handle a request that includes cookies using cookie-parser in an

Express application:

`Install cookie-parser`

Setup in Express Application:
Use cookie-parser as middleware in your Express application:

```
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware to parse cookies
app.use(cookieParser());
Handling a Route:
Assume you have a route that sets a cookie (e.g., during login) and another route that retrieves and uses that cookie:

// Route to set a cookie (e.g., during login)
app.post('/login', (req, res) => {
  // Logic to authenticate user
  const userId = 'exampleUserId';

  // Set a cookie
  res.cookie('userId', userId, { maxAge: 900000, httpOnly: true });

  res.send('Login successful');
});

// Route to retrieve and use the cookie
app.get('/profile', (req, res) => {
  // Access the cookie from req.cookies
  const userId = req.cookies.userId;

  if (userId) {
    // Logic to fetch user profile based on userId
    res.send(`User Profile for userId: ${userId}`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

```

Explanation:

Setting Cookie: In the /login route, res.cookie('userId', userId, { maxAge: 900000, httpOnly: true }); sets a cookie named userId with a value of exampleUserId. Options like maxAge set the expiration time of the cookie.
Retrieving Cookie: In the /profile route, req.cookies.userId retrieves the value of the userId cookie sent by the client. You can then use this value to fetch corresponding user data or perform other actions.
Testing with a Client:

You can test these routes using tools like Postman or by sending requests from a frontend application that handles cookies.

This example demonstrates how cookie-parser helps parse incoming cookies (req.cookies) and how res.cookie() sets outgoing cookies in an Express application.

Adjust the routes and logic based on your application's specific requirements.

The cookie-parser middleware is not directly related to setting cookies using res.cookie() in Express.

cookie-parser is a middleware in Express that parses cookies attached to the client's request object (req.cookies).
It parses the Cookie header and populates req.cookies with an object keyed by the cookie names.
After using cookie-parser, you can access cookies sent by the client in req.cookies.

But Setting Cookies with `res.cookie()`:

res.cookie() is a method in Express that sets a cookie in the client's browser as part of the response.
It takes parameters like the cookie name, value, and options (such as maxAge, httpOnly, sameSite, etc.).

use `https://imgbb.com/` for image hosting to get image links like:

```
https://ibb.co/bFmYMYb

<a href="https://ibb.co/bFmYMYb"><img src="https://i.ibb.co/Jqt8w83/namecheap-2.png" alt="namecheap-2" border="0"></a>
```

The line <input type="hidden" name="_method" value="PUT" /> is used for method overriding in HTML forms. HTML forms by default only support GET and POST methods. However, in RESTful applications, you often need to use other HTTP methods like PUT, DELETE, PATCH, etc., to perform actions such as updating or deleting resources.

Purpose of <input type="hidden" name="_method" value="PUT" />:
Method Override: Express.js (and many other web frameworks) support method override using a technique where you include a hidden input field named `_method` in your form. The value of this field specifies the HTTP method you want to use for the request.

### The isActiveRoute function

The isActiveRoute function and its integration into app.js serve to help with determining if a specific route is currently active in the application. This is commonly used in templating engines to add an "active" class to navigation elements, enhancing the user experience by visually indicating which page the user is currently viewing.

```
function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : "";
}

module.exports = { isActiveRoute };
```

##### Purpose: This function takes two arguments:

route: The route to be checked.
currentRoute: The current route of the application (e.g., the route of the page being rendered).
Functionality: It compares the two routes. If they match, it returns the string "active", otherwise, it returns an empty string.

##### Integration in app.js

```
const { isActiveRoute } = require("./server/helpers/routeHelpers");
app.locals.isActiveRoute = isActiveRoute;
```

Purpose: The isActiveRoute function is required from the routeHelpers module and is then assigned to app.locals.
Functionality: By assigning isActiveRoute to app.locals, you make this function available globally in the application's templates. app.locals is a way to define properties that are local to the application and can be accessed in all templates rendered by the app.

#### Using isActiveRoute in Templates

Example: EJS Template for Navigation
Here's an example of how you might use isActiveRoute in an EJS template to add an "active" class to a navigation link:

```
<ul class="nav">
  <li class="<%= isActiveRoute('/', currentRoute) %>"><a href="/">Home</a></li>
  <li class="<%= isActiveRoute('/about', currentRoute) %>"><a href="/about">About</a></li>
  <li class="<%= isActiveRoute('/contact', currentRoute) %>"><a href="/contact">Contact</a></li>
</ul>
```

###### Explanation:

isActiveRoute('/', currentRoute): This checks if the current route is /. If it is, it returns "active", otherwise, it returns an empty string.
The returned value is used as a class for the <li> elements. This helps in applying styles to indicate the active page.
currentRoute would be a variable passed from the server to the template indicating the current route. For example, it could be set in your route handlers.
Example: Setting currentRoute in Route Handlers
In your Express route handlers, you can set currentRoute to be passed to the template:

```
app.get('/', (req, res) => {
  res.render('index', { currentRoute: '/' });
});

app.get('/about', (req, res) => {
  res.render('about', { currentRoute: '/about' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { currentRoute: '/contact' });
});

```

##### Summary

The isActiveRoute function helps in determining if a route is currently active.
It is made globally available in your templates by assigning it to app.locals in app.js.
In templates, it can be used to conditionally add an "active" class to navigation elements based on the current route.
currentRoute is typically set in route handlers and passed to the template to indicate the current route.

## Axios

Axios is a popular JavaScript library used to make HTTP requests from Node.js or the browser. It provides a simple and elegant API for performing various types of HTTP requests, including GET, POST, PUT, DELETE, and more. Axios is often used to communicate with APIs or to send data to a server.

Key Features of Axios
Promise-based: Axios is built on Promises, making it easy to work with asynchronous requests.
Browser and Node.js: Axios works seamlessly in both browser and Node.js environments.
Automatic JSON Data Transformation: Axios automatically transforms JSON data, making it easier to work with APIs.
Request and Response Interception: Axios allows you to intercept requests and responses, enabling you to add custom logic before a request is sent or after a response is received.
Cancel Requests: Axios provides the ability to cancel ongoing requests.
Timeouts: Axios allows you to set timeouts for requests.
Cross-Site Request Forgery (CSRF) Protection: Axios can be configured to handle CSRF protection.
