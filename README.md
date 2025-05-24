This online platform facilitates trips/bus ticket bookings. Its backend APIs are built using Node.js, Express.js, and MongoDB.

Authentication and authorization are implemented JWT npm packages.
Users input validations implementated into backend side using Joi npm.
This is multi role based system.

Key Features :- 
1. Admin can add,edit,read,delete the trips for users.
2. Admin can approve and canceled the users booking.
3. Users can book the tickets for specific trip.
4. Users can check the status the booking and it's details.
5. Users can download the confirmed tickets and see the show the ticket scanner.
6. Users delete/cancelled their the booking within 24 hours.

Remaining features will be introduce soon
1. Send the confirmation about tickets and discounts coupon via email/text message.
2. Many more.

The backend application is running on port 9000 and can be accessed at http://localhost:9000.

Checkout the public repo :- https://github.com/Durgesh1037/online-booking

Instructions to run the application:

1. Clone the repository :- https://github.com/Durgesh1037/online-booking.git
2. Navigate to the backend directory using cd backend.
3. Open a terminal and run npm install to install dependencies.
4. Create a database named onlinebooking in your local MongoDB environment.
5. Run the application using npm start.
