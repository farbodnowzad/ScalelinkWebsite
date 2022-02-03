class UserAuth {
    // setup the class and hide the body by default
   constructor() {
       document.querySelector("body").style.display = "none";
       this.user_id = localStorage.getItem("user_id");
       this.instagram_id = localStorage.getItem("instagram_id");
       this.validateAuth();
   }
   // check to see if the localStorage item passed to the function is valid and set
   validateAuth() {
       if (this.user_id == null) {
           window.location.replace("/app");
       } else {
            amplitude.getInstance().setUserId(this.user_id);
            document.querySelector("body").style.display = "block";
       }
   }
   // will remove the localStorage item and redirect to login  screen
   logOut() {
       localStorage.removeItem("user_id");
       localStorage.removeItem("instagram_id");
       window.location.replace("/app");
   }
}

export {UserAuth}