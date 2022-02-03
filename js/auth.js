class Auth {
     // setup the class and hide the body by default
    constructor() {
        document.querySelector("body").style.display = "none";
        this.business_id = localStorage.getItem("business_id");
        this.validateAuth();
    }
    // check to see if the localStorage item passed to the function is valid and set
    validateAuth() {
        if (this.business_id == null) {
            window.location.replace("/business");
        } else {
            document.querySelector("body").style.display = "block";
            amplitude.getInstance().setUserId(this.business_id);
        }
    }
    // will remove the localStorage item and redirect to login  screen
    logOut() {
        localStorage.removeItem("business_id");
        window.location.replace("/business");
    }
}

export {Auth}