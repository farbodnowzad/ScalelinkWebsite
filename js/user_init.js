import {UserAuth} from './user_auth.js'
const user_auth = new UserAuth();

document.querySelector(".logout").addEventListener("click", (e) => {
    user_auth.logOut();
});