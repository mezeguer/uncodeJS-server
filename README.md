## 2nd Place Facebook Global Community Challenge
This product was made in 48 hours for the 2017 Facebook Global Community Challenge. Out of 148 teams world-wide, Uncode.js just wont the 2nd position! Check it out in the [here](https://developercircles.devpost.com/submissions)


![uncode.js](https://github.com/vidocco/uncodeJS-client/blob/master/uncode.png)



## Uncode.js

Welcome to the github repo for [uncode.js](http://uncodejs.herokuapp.com/)!

Uncode is a 100% free open-source project that translates JavaScript into human readable languages in real time, just as you are typing it. In this way, the platform  gives you a unique insight into how code is structured and how it works by allowing the you to experiment and see the result.

Uncode also allows code snippets to be uploaded in click of a button (or by dragging and dropping .js files into the editor), displaying the translation immediately - no waiting or loading. Users can log in via facebook, write and save snippets to their profile to access them again on demand. The whole app supports multiple languages: currently english, spanish and italian.



## Getting Started

### Prerequisites

- Download and install [mongoDB](https://docs.mongodb.com/getting-started/shell/installation/)
- Setup the .env file to detect your mongoDB collection name.

Use [postman](https://www.getpostman.com/) to test out the end-points, clone [uncodeJS-client](https://github.com/vidocco/uncodeJS-client) or straight up visit [uncode](http://uncodejs.herokuapp.com/) to see the fully functioning platform.

### Installing

- Clone this repo `git clone https://github.com/vidocco/uncodeJS-server`
- Initialize mongoDB client (run `mongo`) and create a new database `use [.env mongoDB collection name]`.
- Move into the new folder `cd uncodeJS-server`
- Install all dependencies `npm install`
- To start the back-end run `npm start`



## Built with

- [Express](https://expressjs.com/)
- [Facebook API](https://developers.facebook.com/)
- [mongodb](https://www.npmjs.com/package/mongodb)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [socket.io](https://socket.io/)



## Sending Feedback

Please feel free to write an issue in this github repo if you have any feedback, suggestions, improvements and (specially) if you bump into any bugs. We will be happy to solve them :).



## Collaborating

If you want to collaborate with this project (be it proposing new features, adding more languages or improving existing ones), please leave an issue beforehand to let us know and to ensure that you are not working on anything that is already on the way.