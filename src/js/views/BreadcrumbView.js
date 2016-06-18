/**
 * Facebook Winner
 *
 * render breadcrumbs
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/breadcrumb.html'
], function($, _, Backbone, bcTemplate) {

    var BreadcrumbView = Backbone.View.extend({
        el: $("#breadcrumb"),
        
        initialize: function () {
            this.model.on("change", this.render, this);
        },

        render: function () {
            var compiledTemplate = _.template(bcTemplate);
            this.$el.html(compiledTemplate({breadcrumbs: this.model.toJSON()}));
        }      

    });    

    return BreadcrumbView;
});