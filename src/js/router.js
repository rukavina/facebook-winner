/**
 * Facebook Winner
 *
 * Routing definition
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/PagesView',
    'views/FeedView',
    'views/WinnersView',
    'config',
    'views/WelcomeView'
], function($, _, Backbone, PagesView, FeedView, WinnersView, Config, WelcomeView) {

    var AppRouter = Backbone.Router.extend({
        //our routes
        routes: {
            '': 'showPages',
            'pages': 'showPages',
            'pages/:pageId/winners/:postId': 'showWinners',
            'pages/:id/feed': 'showFeed',
            'welcome': 'showWelcome'
        }
    });

    var initialize = function(App) {

        var app_router = new AppRouter;

        /**
         * Check if user logged in, if yes execute callback
         * 
         * @param {function} onConnected
         */
        var afterConnected = function(onConnected){            
            //check login status
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    //on logged in
                    $.fbApi('/me', function (response) {
                        App.user.set(response); // Store the newly authenticated FB user
                    });
                    onConnected();
                } else if (response.status === 'not_authorized') {
                    window.location.hash="welcome";
                    App.user.set(App.user.defaults);
                } else {
                    window.location.hash="welcome";
                    App.user.set(App.user.defaults);
                }
            });
        }

        //welcome page
        app_router.on('route:showWelcome', function() {
            //reset message
            $.message();
            var welcomeView = new WelcomeView();
            welcomeView.render();
        });

        //list fb pages
        app_router.on('route:showPages', function() {
            //reset message
            $.message();
            //force single fb page
            if(Config.pageId){
                window.location.hash="pages/" + Config.pageId + '/feed';
                return false;
            }
            afterConnected(function(){
                var pagesView = new PagesView({model: new Backbone.Model({})});
                pagesView.fetchMyPages();
            });
        });

        //show a page posts
        app_router.on('route:showFeed', function(id) {
            //reset message
            $.message();
            //force single fb page
            if(Config.pageId){
                id = Config.pageId;
            }
            afterConnected(function(){
                var feedView = new FeedView({model: new Backbone.Model({}), pageId: id});
                feedView.fetchForPage(id);
            });
        });

        //show winners page
        app_router.on('route:showWinners', function(pageId,postId) {
            //reset message
            $.message();
            //force single fb page
            if(Config.pageId){
                pageId = Config.pageId;
            }
            afterConnected(function(){
                var winnersView = new WinnersView({"pageId": pageId, "postId": postId});
                winnersView.render();
            });
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
