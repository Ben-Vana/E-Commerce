# E-Commerce website

A Gaming products website that allows users to search for any item that available on the site and purchase it(the app has no payment system).
Only registered users can add products to cart, write reviews and report inappropriate reviews.
User can Register the normal way with Email and Password or via their Google account.
User can write one review every 24 hours to prevent spam.
Admins can delete user, make other users admins and delete or unreport user reviews.
Admin can create, edit or delete products.
Admins can only make product and user changes from the dashboard page.

Front-End bulid with React and TypeScript, React-Redux, Routing with React-Router V6, API calls using Axios.

Back-End build using NodeJS with Express, Password encryption with BcryptJS, Request body validation using Joi, Token created with JSONWebToken,
When resetting password an email will be sent via NodeMailer(Email can sometimes be sent to spam), Mongoose to create MongoDB database and Atlas, 
Using Cors on server and Helmet for extra protection, When admin add new product images will be stored inside a folder in the server using Multer.


Admin user to mess with:

Email: admin@gmail.com
password: Admin@pass1
