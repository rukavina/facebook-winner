/**
 * Facebook winner
 *
 * render welcome page
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/welcome.html'
], function($, _, Backbone, welcomeTemplate) {

    var WelcomeView = Backbone.View.extend({
        el: $("#page"),
        
        initialize: function () {
        },

        render: function () {
            var compiledTemplate = _.template(welcomeTemplate);
            this.$el.html(compiledTemplate());
        },

        events: {
            'click .login': 'login'
        },

        login: function (e) {
            //trigger login event - app will handle it
            $(document).trigger('login');
            return false;
        }       

    });    

    return WelcomeView;
});