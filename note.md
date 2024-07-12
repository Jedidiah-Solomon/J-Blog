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
