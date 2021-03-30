Active Sight - Camp Abilities Progressive Web Application 
===============
A progressive web application that will allow Camp Abilities coaches and Camp Administrators to access, log, and manage fitness data for Camp Abilities athletes. This application was built using Google Firebase frameworks.

You can find the deployed live website here:
[Camp Abilities Live Website](https://pwasbu.web.app/).

This project also involves a hardware component which is able to interact with the PWA via bluetooth. Here is the code for the hardware device:
[Camp Abilities Hardware](https://github.com/SBU-VIP-BEAR/active-sight-hardware/)

Getting started
---------------

**Requirements:**
 - npm

### Host this application locally

1. Install the ```firebase-tools``` npm module using : ```npm install -g firebase-tools ```. You can skip this step if you have already installed firebase.
2. Make sure you are logged into an authorized account that can access the PWASBU project. Do this using ```firebase login``` or ```firebase logout``` if you are using another account. Alternatively, you can re-initialize the project to just run this locally (Dependent on Authentication, Firestore, and Hosting). 
3. Run ```firebase serve``` in the PWASBU directory. The web application should be hosted on http://localhost:5000/.

### Deploying this application

1. Make sure you have installed ```firebase-tools``` from step 1 and 2 of local hosting. 
2. Run ```firebase deploy``` in the PWASBU directory. The web application should be hosted on https://pwasbu.web.app/.
