## VCommmerce
Just another e-commerce application with both subscription and one-time order support.

## Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Usage](#usage)
- [Additional Information](#additional-information)


## Installation
Follow these steps to get a local copy up and running.

#### Clone the repository
gh repo clone virTripathi/progress-tracking-system
#### Install dependencies
Run the following command to install all necessary packages:
``` bash
 npm install
```

## Environment Variables
Create an .env file
Duplicate .env.example as .env and update the variables according to your setup. You can do this by running:
``` bash
cp .env.example .env
```
Add environment variables

Open the newly created .env file and set the required values for your database, port, and other settings as indicated in .env.example.

## Database Setup
Get the ecommerce_2.sql file and run it on your database.

### Seed the Database
Populate your database with superadmin user data:
``` bash
npm run seed:custom
``` 

## Running the App
Build the Application
Prepare the app for production by building it:
``` bash
npm run build
``` 
### Start the Application
Run the app:
``` bash
npm run start
``` 
Your app should now be running, and you can access it at the configured port in your .env file.

## Usage
Once the app is running, you can start ordering.

## Additional Information
For further information on advanced configuration or troubleshooting, please [contact me](mailto:viratofficial07@gmail.com).
