#Payment Form Application
This project is a React-based payment form application that allows users to enter their name, email, mobile number, and card details. It validates the email and mobile number, sends a PIN for verification, and upon successful verification, allows the user to enter their card details and send them to an API.

##Features
###Email and Mobile Number Validation: Validates the email format and ensures the mobile number has 10 digits.
###PIN Verification: Sends a PIN to the user's mobile number and verifies it before allowing card details input.
###Card Details Input: Uses react-credit-cards for handling card number, expiry date, and CVV inputs.
###API Integration: Sends user details and card information to specified APIs.

##Usage
###Enter Name: Input your name in the provided field.
###Enter Email: Input your email address. The email must follow a valid email format.
###Enter Mobile Number: Select the dialing code and enter your 10-digit mobile number.
###Send PIN: If the email and mobile number are valid, a PIN will be sent to your mobile number automatically.
###Enter PIN: Input the received PIN in the provided fields. Once the PIN is verified, you can proceed to the next step.
###Enter Card Details: Input your card number, expiry date, and CVV.
###Submit: Click the submit button to send the card details to the API.

##Code Overview
##App.js
This is the main component of the application. It handles the form data, PIN verification, and card details submission.

###State Management: Manages the state for form data, PIN code, and validation statuses.
###Event Handlers: Handles input changes, PIN code changes, and form submission.
###API Calls: Sends requests to APIs for sending and verifying the PIN, and for sending card details.
##App.css
Contains the styling for the application, including the layout of the form and input fields.

##Dependencies
###React: A JavaScript library for building user interfaces.
###react-credit-cards: A React component for rendering credit card previews.
##API Endpoints
###Send PIN:  (POST request with user details to send a PIN)
###Verify PIN:  (POST request with user details and PIN code to verify the PIN)
###Add Visa Direct Instrument:  (POST request with user details and card information)
###Add Account:  (POST request with user details and account information)


##Acknowledgements
react-credit-cards
