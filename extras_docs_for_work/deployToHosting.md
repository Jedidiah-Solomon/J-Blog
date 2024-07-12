# How to Host Nodejs Apps on Namecheap

To host Nodejs apps on Cpanel like Namecheap can be intuitive and tedious sometimes especially if you are a beginner into the nitty-gritty of these technologies and platforms.

In this little article here, I’ll be showing you how to host your Nodejs apps on Cpanel like Namecheap.

### What is Namecheap?

Namecheap is an ICANN-accredited domain name registrar, which provides domain name registration and web hosting.

Getting Started

##### Step 1: Write some code!

We will create a simple Express application and host it on Namecheap in this tutorial.

##### Write some code!

```
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello ${name}`);
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
```

Save the code above in a file named `app.js`.

## Hosting Express on cPanel

This section assumes we have created a Namecheap account and purchased a domain along with hosting.

#### Step 2: Log in to cPanel

#### Step 3: Create a NodeJs Application

cPanel has tools for operations like SSL management, Databases, File management, Emails, Site metrics, Domain management, etc.

Navigate to the SOFTWARE section and select Setup Node.js App.

Next, click the CREATE APPLICATION button on the right side of the screen.

createnodeappnamecheap.png

You will see a screen similar to the one above, select a Node.js version (preferably the latest).

Provide a name for your application in the Application root form field, and select the domain/subdomain you want the app hosted on in the Application URL section.

fillnodedetailsnamecheap.png

#### Step 4: Upload the Express Application to cPanel

Navigate to the FILES section in cPanel and select File Manager. It is a tool that allows for the management of files on our server.

filemanagernamecheap.png

Next, zip your local project, and upload it to the cPanel file manager.

Then unzip it on the server.

selectfilesnamecheap.png

filemanagerinnamecheap.png

#### Step 5: Install Project Dependencies

Open the Node.js App page again and scroll down and open the project.

Click on the Run NPM Install button.

#### Step 6: Restart the Node.js Application

Whenever you make changes to the web application, you have to restart the application to effect the changes.

To do this, scroll up on the Node.js App page and locate the RESTART button, then click it.

Congratulations! You have successfully hosted a Node.js/Express application on Namecheap cPanel.

It is accessible via the domain you linked to the app during its creation.

Conclusion
We saw the possibility of hosting Node.js web applications on cPanels like Namecheap and learned how to host a Node.js project on cPanel.
