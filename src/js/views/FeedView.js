/**
 * Facebook Winner
 *
 * render posts of a page
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/feed.html',
    'config',
    'views/BreadcrumbView',
    'formatDateTime',
    'bootstrap'
], function($, _, Backbone, feedTemplate, Config, BreadcrumbView, formatDt) {


    var FeedView = Backbone.View.extend({
        el: $("#page"),
        csvContent: '',
        initialize: function() {
            this.model.on("change", this.render, this);

            //render breadcrumb info
            var breadCrumbModel = {
                "Pages":"#pages"
            }
            //get page name
            $.fbApi("/" + this.options.pageId,  function(response) {
                if(response.name){
                    breadCrumbModel[response.name] = null;
                }                
                new BreadcrumbView({model: new Backbone.Model(breadCrumbModel)}).render();                
            });
        },
        render: function() {
            // main view
            var data = this.model.toJSON();
            data.pageId = this.options.pageId;
            data.Config = Config;
            var compiledTemplate = _.template(feedTemplate);
            this.$el.html(compiledTemplate(data));
        },
        events: {
            'click .next': 'next',
            'click .previous': 'previous',
            'click .export.comments': 'exportComments',
            'click .export.likes': 'exportLikes',
            'click #csvContentBtn': 'exportTextArea'
        },
        /**
         * Populate data by looping until no paging.next
         *
         * @param {string} url fb api url
         * @param {object} data
         * @param {function} onDone callback
         */
        recursePopulate: function (url,data,onDone){
            var self = this;
            $.fbApi(url, function(response){
                if(response.data && response.data.length){
                    data = data.concat(response.data);
                    if(response.paging && response.paging.next){
                        //keep looping
                        self.recursePopulate(response.paging.next, data, onDone);
                    }
                    else{
                        onDone(data);
                    }
                }
                else{
                    onDone(data);
                }
            });
        },
        escapeRegExp: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },     
        replaceAll: function(find, replace, str) {
            return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
        },        
        /**
         * Encode csv value
         *
         * @param {string} value
         * @return {string}
         */
        encodeCsv: function(value){
            if(!value){
                return value;
            }
            value = this.replaceAll('"','""',value);
            //value = this.replaceAll("\r\n",'\n',value);
            //value = this.replaceAll("\n",'\n',value);
            return '"' + value + '"';
        },
        /**
         * Export to csv
         * @param {event} event
         * @param {string} entity likes or comments
         * @param {function} getRowData
         *
         */
        genericExport: function(event, entity, getRowData, fields){
            var self = this;
            var $link = $(event.currentTarget);
            var postId = $link.parents('tr').data('id');
            var data = [];
            self.csvContent = '';
            if(fields){
                fields = '&fields=' + fields;
            } else {
                fields = '';
            }
            this.recursePopulate('/' + postId + '/' + entity + '/?limit=' + Config.facebook.limit + fields, data, function(data){
                //console.log(data);
                for(var i in data){
                    var row = getRowData(data[i]);
                    self.csvContent += row.join(',') + "\n";
                }
                var encodedUri = "data:text/csv;charset=utf-8," + encodeURI(self.csvContent);
                $('#downloadLink').attr('href',encodedUri).attr('download',$link.attr('download'));
                $("#csvContent").hide();
                $('#downloadModal').modal('show');
            });
            return false;
        },
        exportTextArea: function(){
            $("#csvContent").val(this.csvContent).show();
            return false;
        },
        /**
         * Export comments in csv
         */
        exportComments: function(event){
            var self = this;
            this.genericExport(event, 'comments', function(data){
                return [self.encodeCsv(data.created_time),self.encodeCsv(data.from.name),self.encodeCsv(data.from.id),self.encodeCsv(data.message)];
            });
            return false;
        },
        /**
         * Export likes in csv
         */
        exportLikes: function(event){
            var self = this;
            this.genericExport(event, 'likes', function(data){
                return [self.encodeCsv(data.id),self.encodeCsv(data.name)];
            }, 'name');
            return false;            
        },
        next: function() {
            this.fetch(this.model.get('paging').next);
            return false;
        },
        previous: function() {
            this.fetch(this.model.get('paging').previous);
            return false;
        },
        fetchForPage: function(pageId){
            this.fetch('/' + pageId + '/posts/?limit=' + Config.perPage + '&fields=story,name,message,updated_time,picture,type,comments.limit(1).summary(true),likes.limit(1).summary(true)');
        },
        fetch: function(url) {
            var self = this;
            $.fbApi(url,  function(response) {
                self.model.set(response);
            });
        }

    });

    return FeedView;
});

