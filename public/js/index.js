Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});
// Initialize use of micro modal
MicroModal.init();

// Your web app's Firebase configuration
const routes = new RoutesObj(new Template());
const router = new Router(routes);

var firebaseConfig = {
    apiKey: "AIzaSyApt83e-9UQl2qm0pWT_qTLHttcJvxVHhk",
    authDomain: "pwasbu.firebaseapp.com",
    databaseURL: "https://pwasbu.firebaseio.com",
    projectId: "pwasbu",
    storageBucket: "pwasbu.appspot.com",
    messagingSenderId: "50350195533",
    appId: "1:50350195533:web:6447aabeb5639f634fed04",
    measurementId: "G-QLBTF51T0Y"
};
//     const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let provider = new firebase.auth.GoogleAuthProvider();
var uiConfig = {
    'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccessWithAuthResult': function (authResult, redirectUrl) {
            if (authResult.user) {
                handleSignedInUser(authResult);
            }

            // Do not redirect.
            return false;
        }
    },
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
};



// Initialize the FirebaseUI widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("LOGGED IN WITH EMAIL: " + user.email);
        router.loadRoute('home');
        router.loadNavRoute('navbar');
    } else {
        console.log("LOGGED OUT");
        router.loadRoute('');
        router.hideNav();
    }
});

window.addEventListener('hashchange', hashChangeEvent => {
    console.log("Hash Change: ");
    urlSegments = hashChangeEvent.newURL.split("#");
    // console.log(urlSegments);
    user = firebase.auth().currentUser;
    if (user && urlSegments[1] != "" && urlSegments[1] != "evaluation") {
        router.loadRoute(urlSegments[1]);
    } else if (user && (urlSegments[1] === "" || urlSegments[1] === "evaluation")) {
        router.loadRoute("home");
    } else {
        router.loadRoute("");
    }

    if (document.getElementById("backToActivities")) {
        $("#backToActivities").addClass("hiddenElement");
    }
});

const signUpFB = firebase.initializeApp(firebaseConfig, "signUpFB");

const fs = firebase.firestore()
fs.enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            alert("More than 1 tab is open for this app. Only one of the apps can be accessed offline at a time!");
        } else if (err.code == 'unimplemented') {
            document.getElementById("app-warning").innerHTML = "The browser that you are using does not support offline";
        }
    });

function handleSignedInUser(authResult) {
    console.log(authResult)
    // document.getElementById('firebaseui-auth-container').style.display = 'none';
    document.getElementById('signed-in').style.display = 'block';
}

function init() {
    var docRef = fs.collection("users")
    var data = docRef.get().then(loopOverDocs)

}

function loopOverDocs(docs) {
    docs.forEach(loopOverKeys)
}

function loopOverKeys(doc) {

    Object.keys(doc).forEach(key => {

        var newDiv = document.createElement('div')
        newDiv.setAttribute('id', key);
        document.body.appendChild(newDiv);
    })

}

document.addEventListener("DOMContentLoaded", function () {



    // const selectElement = document.querySelector('.ice-cream');
    //
    // selectElement.addEventListener('change', (event) => {
    //     const result = document.querySelector('.result');
    //     result.textContent = `You like ${event.target.value}`;
    //     console.log(event)
    //     var payload = {
    //         first: event.target.value,
    //         last: "Lovelace",
    //         born: 1815
    //     }
    //
    //     saveData(payload)
    // });
    // document.getElementById("name").addEventListener("change",(evt)=>{



    // })
});
function saveData(payload, key = "users") {
    console.log("Attempting to write store: " + JSON.stringify(payload, null, 2));
    fs.collection(key).add(payload)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });

    // Not using real time database for this setup
    // function writeUserData(userId, name, email, imageUrl) {
    //     firebase.database().ref('users/' + userId).set({
    //         username: name,
    //         email: email,
    //         profile_picture: imageUrl
    //     });
    // }

}
/**
 * DEPRECATED FUNCTION
 */
function saveCurrentUserData() {
    let user = firebase.auth().currentUser;
    let payload = {};
    let name = user.displayName.split(" ");
    if (name.length > 1) {
        payload = generateUser(user.email, name[0], name[1]);
    } else {
        payload = generateUser(user.email, name[0]);
    }
    fs.collection("users").where("email", '==', email).set(payload)
        .then(function () {
            console.log("User does not exist in the database ... adding user now");
            localStorage.setItem("userData", JSON.stringify(payload));
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

function updateOnlineStatus() {
    // console.log("updateOnlineStatus called.");
    onlineStatus = 'Online';

    if (!navigator.onLine) {
        onlineStatus = ' Offline';
    }

    let tooltiptext = "";
    let displayEvaluationWarning = false;
    if (window.location.hash) {
        urlSegments = window.location.hash.split("#");
        // console.log(urlSegments);
        if (urlSegments.length < 1 || urlSegments[1] == "" || urlSegments[1] == "login") {
            tooltiptext = "Important: when device is offline you are unable to login or reset password";
        } else if (urlSegments[1] == "evaluation") {
            displayEvaluationWarning = true;
            tooltiptext = "When offline your changes should still be saved";
        } else {
            tooltiptext = "When offline your changes should still be saved";
        }
    } else {
        tooltiptext = "Important: when device is offline you are unable to login or reset password";
    }

    $('#offline-message').html(
        `<span>${onlineStatus}</span>
        <span class="tooltip">
            <img class="infobutton" src="img/infobutton.png" alt="i">
            <span class="tooltiptext">${tooltiptext}</span>
        </span>`
    );

    if (onlineStatus == 'Online') {
        $('.offline-ready').addClass("online");
        $('.offline-ready').removeClass("offline");
        $('#offline-warnings').addClass("hiddenElement");
    } else {
        $('.offline-ready').addClass("offline");
        $('.offline-ready').removeClass("online");
        $('#offline-warnings').removeClass("hiddenElement");
    
        if (displayEvaluationWarning) {
            $('#offline-warnings').html(
                `<div class="logoff-warning">
                    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                    Warning: Do NOT log out when offline. Changes made while offline will not be saved if you log out.
                </div>
                <div class="offline-save-warning">
                    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                    Warning: Your assessments won't be visible to the administrator until you return online
                </div>`
            );
        } else {
            $('#offline-warnings').html(
                `<div class="logoff-warning">
                    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                    Warning: Do NOT log out when offline. Changes made while offline will not be saved if you log out.
                </div>`);
        }
    }
}

$(() => {
    updateOnlineStatus();
});

$(() => {
    // Enable Service Worker
    navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log(registrations, registrations.length);

        if (!registrations.length) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .register('sw.js')
                    .then((reg) => {
                        var newWorker = reg.installing;
                        console.log('Service Worker Registered', reg)
                    })
                    .catch((err) => console.log('Service Worker not registered', err));
            }
        }
    });
});

// // Enable Service Worker
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//         .register('sw.js')
//         .then((reg) => {
//             var newWorker = reg.installing;
//             console.log('Service Worker Registered', reg)
//         })
//         .catch((err) => console.log('Service Worker not registered', err));
// }

// Code to handle install prompt on desktop

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
// addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    if (addBtn) {
        // Update UI to notify the user they can add to home screen
        addBtn.style.display = 'block';

        addBtn.addEventListener('click', (e) => {
            // hide our user interface that shows our A2HS button
            addBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});
/*
 * Firestore User Queries
 */
function getUserData(email, _callback = () => { }) {
    fs.collection("users").where("email", '==', email).get().then(function (res) {
        if (res.docs.length > 0) {
            res.docs[0].ref.get().then(doc => {
                console.log("Successfully retrieved user data for " + doc.data()['email']);
                localStorage.setItem("userData", JSON.stringify(doc.data()));
                _callback();
            });
        } else {
            console.log("The user of " + email + " does not exist");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}
function forgotPassword() {
    let email = document.getElementById("forgot-email").value;
    $(".loader").show();
    $("#forgot-button").hide();
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert("If the email is valid, a reset has been sent.");
        $(".loader").hide();
        $("#forgot-button").show();
        alert("If the email is valid, a reset has been sent.");
        router.loadRoute('');
    }).catch(function (error) {
        $(".loader").hide();
        $("#forgot-button").show();
        alert("If the email is valid, a reset has been sent.");
        router.loadRoute('');
    });
}

// Also used for setting the user
function setUser(email, payload) {
    fs.collection("users").where('email', '==', email).get().then(res => {
        let batch = fs.batch();
        res.forEach(doc => {
            batch.set(doc.ref, payload);
        });
        batch.commit().catch(err => console.log(err))
    });
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/**
 * This function is purely used for signing the user up.
 * @param {} payload 
 */
// function addUser(payload, _callback = ()=> {}){
//     fs.collection("users").where('email', '==', payload['email']).get()
//     .then(res=> {
//         if(res.docs.length > 0) {
//             console.log("attempting to add a user that already exists");
//         } else {
//             fs.collection("users").get().then((res) => {
//                 let id = makeid(3);
//                 if (payload['email'] == "") {
//                     payload['email'] = id;
//                 }
//                 payload['id'] = id + (res.docs.length + 1);
//                 fs.collection("users").add(payload).then(function(){
//                     console.log("Added user successfully");
//                     alert("Added user successfully");
//                     _callback();
//                 }).catch(function(error) { console.log(error)});
//             });
//         }
//     });
// }

function addUser(payload, _callback = () => { }) {
    var def = $.Deferred();
    fs.collection("users").where('email', '==', payload['email']).get()
        .then(res => {
            if (res.docs.length > 0) {
                console.log("attempting to add a user that already exists");
            } else {
                fs.collection("users").get().then((res) => {
                    let id = makeid(3);
                    if (payload['email'] == "") {
                        payload['email'] = id;
                    }
                    payload['id'] = id + (res.docs.length + 1);
                    def.resolve(payload['id']);
                    fs.collection("users").add(payload).then(function () {
                        console.log("Added user successfully");
                        _callback();
                    }).catch(function (error) { console.log(error) });
                });
            }
        });
    return def;
}

function toy() {
    var def = $.Deferred();
    setTimeout(() => {
        def.resolve("done");
    }, 3000);
    return def;
}

/**
 * This function returns a JSON Object for adding a user to the "users" collection
 * @param {*} email The email of the user. Cannot be a duplicate of an email already in use.
 */
// function generateUser(email, firstName="", lastName="", gender ="Female", priv = "."){
//     return {
//         email: email,
//         birthdate : "1999-07-04", //Needs to be implemented with field
//         creationDate : new Date().toDateInputValue(),
//         firstName: firstName,
//         lastName : lastName, 
//         gender: gender, // Needs to be implemented with field`
//         priv: priv
//     };   
// }

function generateUser(email, firstName = "", lastName = "", gender = "", birthdate = "", priv = ".", pronoun = "They/Them/Theirs") {
    return {
        email: email,
        birthdate: birthdate,
        creationDate: new Date().toDateInputValue(),
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        priv: priv,
        pronoun: pronoun
    };
}

function signIn(email, password) {
    console.log("Attempting to sign in");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log("Attempting to load menu");
                    getUserData(firebase.auth().currentUser.email);
                    location.reload();
                })
                .catch(function (error) {
                    $(".btn").show();
                    $(".loader").hide();
                    document.getElementById("login_error").innerHTML = error.message;
                    $("#login_error").show();
                });
        })
        .catch(function (error) {
            $(".btn").show();
            $(".loader").hide();
            document.getElementById("login_error").innerHTML = error.message;
            $("#login_error").show();
        });
}

function login() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-pass").value;
    if (!emailIsValid(email)) {
        document.getElementById("login_error").innerHTML = "Email field is invalid!"
        $("#login_error").show();
    } else {
        $(".btn").hide();
        $(".loader").show();
        signIn(email, password);
    }
}

function signup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-pass").value;
    let firstName = document.getElementById("signup-user-first").value;
    let lastName = document.getElementById("signup-user-last").value;
    let birthdate = document.getElementById("signup-birthdate").value;
    let name = firstName + " " + lastName;
    if (!emailIsValid(email)) {
        document.getElementById("pass_error").innerHTML = "Email field is invalid!"
        $("#pass_error").show();
    } else if (name.length <= 0) {
        document.getElementById("pass_error").innerHTML = "Name field is empty!"
        $("#pass_error").show();
    } else if (!passIsValid(password) || !(passMatch())) {
        document.getElementById("pass_error").innerHTML = "Password field is invalid or passwords don't match!"
        $("#pass_error").show();
    } else {
        $(".btn").hide();
        $(".loader").show();
        alert("User signup was successful!");
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log("Attempting to register user into DB");
                addUser(generateUser(email, firstName, lastName, "", birthdate, "."));
                firebase.auth().currentUser.updateProfile({
                    displayName: name,
                }).then(function () {
                    console.log("Updated user display name successfully!");
                    signIn(email, password);
                }).catch(function (error) {
                    console.log(error.message);
                    signIn(email, password);
                });
            })
            .catch(function (error) {
                $(".btn").show();
                $(".loader").hide();
                document.getElementById("pass_error").innerHTML = error.message;
                $("#pass_error").show();
            });
    }
}
function signout() {
    console.log("Attempting to signout");
    firebase.auth().signOut().then(function () {
        //loadLogin();
        localStorage.clear();
        console.log("User has signed out successfully");
    }).catch(function (error) {
        localStorage.clear();
        //loadLogin();
        console.log(error.message + " with error code : " + error.code);
    });
}
function googleSignIn() {
    $(".btn").hide();
    $(".loader").show();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        // Not using all of the fields above yet
        fs.collection("users").where('email', '==',).get().then(function (querySnapshot) {
            if (querySnapshot.length > 0) {
                console.log("User exist in the database!");
                getUserData(user.email);
            } else {
                console.log("User does not exist in the database. Adding the user now");
                let name = user.displayName.split(" ");
                if (name.length > 1) {
                    addUser(generateUser(user.email, name[0], name[1]));
                } else {
                    addUser(generateUser(user.email, name[0]));
                }
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            console.log("User does not exist in the database. Adding the user now");
            let name = user.displayName.split(" ");
            if (name.length > 1) {
                addUser(generateUser(user.email, name[0], name[1]));
            } else {
                addUser(generateUser(user.email, name[0]));
            }
        });

    }).catch(function (error) {
        $(".btn").show();
        $(".loader").hide();
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        // Not using all of the fields yet
        document.getElementById("pass_error").innerHTML = errorMessage;
        $("#pass_error").show();
    });
}

//STORAGE Functions
const storageRef = firebase.storage().ref();

function toggleHide(id) {
    let classes = document.getElementById(id).classList;
    if (classes.contains("hiddenElement")) {
        classes.remove("hiddenElement");
    } else {
        classes.add("hiddenElement");
    }
}
