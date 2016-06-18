/**
 * Facebook winner
 *
 * render winners page
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/winners.html',
    'models/WinnerCollection',
    'text!templates/winners_list.html',
    'views/BreadcrumbView',
    'config',
], function($, _, Backbone, winnersTemplate, WinnerCollection, winnersListTemplate, BreadcrumbView, Config) {


    var WinnersView = Backbone.View.extend({
        loaded: false,
        commenters: [],
        likers: [],
        el: $("#page"),
        $winners: null,
        likeCount:  0,
        commentCount: 0,
        candidateCount: 0,
        initialize: function() {
            var self = this;
            //setup winner collection
            this.collection = new WinnerCollection([],{"postId": this.options.postId});
            this.collection.on("add", this.renderWinners, this);
            this.collection.on("remove", this.renderWinners, this);
            //render breadcrumb view
            var breadCrumbModel = {
                "Pages":"#pages"
            }
            this.loaded = false;
            this.likeCount = 0;
            this.commentCount = 0;
            this.candidateCount = 0;
            this.commenters = [];
            this.likers = [];
            //get page name
            $.fbApi("/" + this.options.pageId,  function(response) {
                if(response.name){
                    breadCrumbModel[response.name] = "#pages/" + self.options.pageId + '/feed';
                }
                //get post name
                $.fbApi("/" + self.options.postId + '?fields=name,message,story,comments.limit(1).summary(true),likes.limit(1).summary(true)',  function(response) {
                    var postName = (response.message)? response.message: response.story? response.story:response.name;
                    if(postName){
                        breadCrumbModel[postName.substring(0,50)] = null;
                    }
                    //like count
                    if(response.likes && response.likes.summary && response.likes.summary.total_count){
                        self.likeCount = response.likes.summary.total_count;
                    }
                    //comment count
                    if(response.comments && response.comments.summary && response.comments.summary.total_count){
                        self.commentCount = response.comments.summary.total_count;
                    }
                    self.candidateCount = self.likeCount + self.commentCount;
                    //console.log(self.candidateCount);
                    breadCrumbModel["Winners"] = null;
                    new BreadcrumbView({model: new Backbone.Model(breadCrumbModel)}).render();                
                });                                
            });            
        },
        render: function() {
            // main view  
            var compiledTemplate = _.template(winnersTemplate);
            this.$el.html(compiledTemplate({"pageId": this.options.pageId, "postId": this.options.postId}));
            this.$winners = this.$el.find("#winners");
            //load existing winners
            this.collection.loadWinners();
            //render winners list
            this.renderWinners();
        },
        updateLoading: function(loaded,close){
            if (!this.candidateCount){
                return false;
            }
            if(close){
                this.$el.find('#winnerProgessDialog').modal('hide');
                return;
            }
            $.debug(['loaded',loaded,'this.commenters.length',this.commenters.length,'this.likers.length',this.likers.length, 'total', this.candidateCount].join(','));
            var progress = Math.round(((loaded + this.commenters.length + this.likers.length) / this.candidateCount) * 100);
            this.$el.find('#winnerProgess').css('width',progress + '%').find('span').text(progress);
            this.$el.find('#winnerProgessDialog').modal('show');
        },
        renderWinners: function() {
            // main view
            var compiledTemplate = _.template(winnersListTemplate);
            this.$winners.html(compiledTemplate({winners: this.collection.toJSON()}));
        },
        events: {
            'click #generate': 'generate',
            'click #commenters': 'showUnique',
            'click .remove': 'removeWinner'
        },
        showUnique: function(){
            var self = this;
            if(self.$el.find('#commenters').is(':checked')){
                self.$el.find('#uniquePanel').show();
            }
            else{
                self.$el.find('#uniquePanel').hide();
            }
        },
        //pick a new winners
        generate: function(){
            var self = this;
            //something must be checked
            if(!this.$el.find('#likers').is(':checked') && !this.$el.find('#commenters').is(':checked')){
                $.message("Please select commenters and/or likers.","danger");
                return false;
            }

            //when candidates are loaded execute selection
            function pickWinner(){
                //get result from collection
                var result = self.collection.pickWinner(
                    self.likers,
                    self.commenters,
                    self.$el.find('#likers').is(':checked'),
                    self.$el.find('#commenters').is(':checked'),
                    self.$el.find('#commentersUnique').is(':checked')
                );
                $.debug('Winners calculated');
                //check result
                if(!result){
                    $.message("No valid candidates found","warning");
                    return false;
                }
                else{
                    $.message("The Winner selected!","success");
                }
                //save new winner
                self.collection.saveWinners();
            }
            
            //load and cache ALL commenters and likers
            if(!this.loaded){
                $.debug('Loading comments');
                this.loadCommenters(function(){
                    $.debug('Loading likes');
                    self.loadLikers(function(){
                        $.debug('All loaded, picking winner');
                        self.updateLoading(0,true);
                        self.loaded = true;
                        pickWinner();
                    })
                })
            }
            else{
                pickWinner();
            }
            
            return false;
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
            self.updateLoading(data.length);
            $.fbApi(url, function(response){
                if(response.data && response.data.length){
                    data = data.concat(response.data);
                    self.updateLoading(data.length);
                    if(response.paging && response.paging.next){
                        self.recursePopulate(response.paging.next, data, onDone);
                    }
                    else{
                        onDone(data);
                    }
                }
                else{
                    self.updateLoading(data.length);
                    onDone(data);
                }
            });
        },
        /**
         * Load raw candidates
         * @param {string} entity: likes or comments
         * @param {function} onCandidate callback on new candidate data
         * @param {function} onDone callback
         */
        load: function(entity,onCandidate,onDone, fields){
            var self = this, data = [];
            if(fields){
                fields = '&fields=' + fields;
            } else {
                fields = '';
            }            
            this.recursePopulate('/' + this.options.postId + '/' + entity +'/?limit=' + Config.facebook.limit + fields, data, function(data){
                for(var i in data){
                    onCandidate(data[i]);
                }
                if(onDone){
                    onDone();
                }
            });
        },
        loadCommenters: function(onDone){
            var self = this;
            this.load('comments',function(data){
                self.commenters.push({'id': data.from.id, 'name': data.from.name});
            },onDone);
        },
        loadLikers: function(onDone){
            var self = this;
            this.load('likes',function(data){
                self.likers.push({'id': data.id, 'name': data.name});
            },onDone, 'name');
        },
        removeWinner: function(ev){
            var winnerIndex = $(ev.currentTarget).parents('tr').data('index');
            var winner = this.collection.at(winnerIndex);
            this.collection.remove(winner);
            this.collection.saveWinners();
        }

    });

    return WinnersView;
});

