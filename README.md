<h1>Bodyfat Calculator</h1>

<p>The bodyfat-calculator is a full stack web app with CRUD (create, read, update, delete) functionality. The purpose of the app is to provide health care workers with a way to calculate a clients bodyfat percentage and then save this data to a database so that it can be tracked over time.</p>

<p>I worked alongside a user experience designer to create a one-page responsive web app for healthcare professionals who would use this in-clinic.</p>

<p>I used HTML, CSS, Bootstrap and JavaScript for front end development. I used NodeJS and Express on the server side. Client data was saved to the non-relational database MongoDB using Mongoose. I used RESTful routing in order to map HTTP methods and CRUD actions. I used Passport.JS middleware for authentication. The app was deployed to Heroku.</p>

<p>After multiple iterations we settled on a minimum viable product (MVP) that would meet the basic calculation needs.</p>

<h2>Challenges:</h2>

<h3>1.	Storing test data in database</h3>
<li>One of the more difficult tasks was deciding the appropriate way of storing client test data and then retrieving it and displaying it. I used MongoDB Atlas to store a user’s name and their test results. The structure I decided on was storing the test results as objects within an array. The array allowed me to store the tests in the sequence that they were created. </li>


<h3>2.	Updating client’s test information.</h3>
<li>Updating was the most challenging CRUD operation. I started by adding an event listener to the ‘Save’ button. The purpose was to save the calculated test data to the selected client. Within the event listener, I ended up using the built-in JavaScript methods fetch(), to make to PUT request and send the data to the server. In order to send the test data, I converted the object to a JSON string. On the server-side, I used an async function to find and update (add a new bodyfat test) the client. I got a little stuck retrieving data to the server-side from the client-side. It turned out that I had not used the middleware bodyParser.json() to parse the incoming JSON string. </li>

<h3>3. Performance</h3>
<li>I Used Google Lighthouse to check the websites performance. Google Lighthouse audits performance, accessibility and search engine optimization. One issue picked up was that the app was vulnerable to cross site scripting. I realised that I had the content security policy set to false running the helmet.js function. I removed this setting and then added directives to helmet.js that would still allow access to URL's the app was using such as bootstrap and google fonts.</li>

