/**
 * Facebook Winner
 *
 * App main file
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'models/UserModel',
    'views/LoginView',
    'config',
    'utils'
], function($, _, Backbone, Router, UserModel, LoginView, Config) {
    var App = {
        user: new UserModel(),
        initialize: function() {
            App.user.set(App.user.defaults);
            //run router
            Router.initialize(App);

            //on dom ready
            $(document).ready(function(){
                var loginView = new LoginView({model: App.user});
                loginView.render();
                
                $("#message button.close").click(function(){
                   $.message(); 
                });
            });

            //on db login status change - not in use now,
            //check FB.getLoginStatus in router.js
            $(document).on('fbStatusChange', function (event, data) {
                if (data.status === 'connected') {
                    //on logged in
                    $.fbApi('/me', function (response) {
                        App.user.set(response); // Store the newly authenticated FB user
                    });
                } else {
                    //on logged out
                    App.user.set(App.user.defaults); // Reset current FB user
                }
            });

            //logout clicked
            $(document).on('logout', function () {
                FB.logout(function(response) {
                    window.location.hash="welcome";
                });
                return false;
            });

            //login clicked
            $(document).on('login', function () {
                FB.login(function(response) {
                    window.location.hash="pages";
                }, {scope: Config.facebook.scope});
                return false;
            });                        
        }        
    };  

    return App;
});