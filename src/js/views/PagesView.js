/**
 * Facebook Winner
 *
 * render fb page list
 *
 * @author Milan Rukavina
 * @version 1.0
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages.html',
    'views/BreadcrumbView',
    'config'
], function($, _, Backbone, pagesTemplate, BreadcrumbView, Config) {


    var PagesView = Backbone.View.extend({
        el: $("#page"),
        initialize: function() {
            this.model.on("change", this.render, this);
            var breadCrumbModel = {
                "Pages": null
            }
            new BreadcrumbView({model: new Backbone.Model(breadCrumbModel)}).render();
        },
        render: function() {
            // main view  
            var compiledTemplate = _.template(pagesTemplate);
            this.$el.html(compiledTemplate(this.model.toJSON()));
        },
        events: {
            'click .next': 'next',
            'click .previous': 'previous',
            'click #selectPage': 'selectPage'
        },
        next: function() {
            this.fetch(this.model.get('paging').next);
            return false;
        },
        previous: function() {
            this.fetch(this.model.get('paging').previous);
            return false;
        },
        fetchMyPages: function(){
            //admin or liked pages
            if(Config.showAdminPages){
                this.fetch('/me/accounts/?limit=' + Config.perPage);
            }
            else{
                this.fetch('/me/likes/?limit=' + Config.perPage);
            }
        },
        fetch: function(url) {
            var self = this;
            $.fbApi(url,  function(response) {
                self.model.set(response);
            });
        },
        selectPage: function(ev){
            //get page if
            if($(ev.currentTarget).hasClass('pageLink')){
                var pageId = $(ev.currentTarget).data('page_id');
            }
            else{
                var pageId = this.$el.find('#pageId').val();
            }
            var url = '/' + pageId;
            //get page info
            $.fbApi(url,  function(response) {
                //page found
                if(response.id){
                    window.location.hash="pages/" + response.id + '/feed';
                }
            });
            return false;
        }

    });

    return PagesView;
});