# Prive store website

The website allows users to search for any item that available on the site and purchase it(can't actually buy it's a demo).
Only registered users can add products to cart, write reviews and report inappropriate reviews.
User can write one review every 24 hours to prevent spam.
Admins can delete user, make other users admins and delete or unreport user reviews.
Admin can create, edit or delete products.
Admins can only make product and user changes on dashboard.

Front-End bulid with React and TypeScript, React-Redux, Routing with React-Router V6, API calls using Axios.

Back-End build using NodeJS with Express, Password encryption with BcryptJS, Request validation with Joi, Token created by JSONWebToken,
When resetting password an email will be sent via NodeMailer(Email can sometimes be sent to spam), Mongoose to create MongoDB database, 
Using Cors on server and Helmet for extra protection.

