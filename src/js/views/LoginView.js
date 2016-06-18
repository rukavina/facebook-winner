/**
 * Facebook Winner
 *
 * render login menu
 *
 * @author Milan Rukavina
 * @version 1.0
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/UserModel',
    'text!templates/login.html'
], function($, _, Backbone, UserModel, loginTemplate) {

    var LoginView = Backbone.View.extend({
        el: $("#login"),
        
        initialize: function () {
            this.model.on("change", this.render, this);
        },

        render: function () {
            var compiledTemplate = _.template(loginTemplate);
            this.$el.html(compiledTemplate(this.model.toJSON()));
        },

        events: {
            'click .login': 'login',
            'click .logout': 'logout'
        },

        login: function (e) {
            //trigger login event - app will handle it
            $(document).trigger('login');
            return false;
        },

        logout: function (e) {
            //trigger logout event - app will handle it
            $(document).trigger('logout');
            return false;
        }        

    });
    return LoginView;
});