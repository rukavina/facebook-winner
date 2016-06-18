/**
 * Facebook Winner
 *
 * Winner collection of winner models
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'underscore',
    'backbone',
    'models/WinnerModel',
    'config'
    ], function(_, Backbone, WinnerModel, Config){

        var WinnerCollection = Backbone.Collection.extend({

            model: WinnerModel,
            //selected post
            postId: null,

            initialize : function(models, options) {
                this.postId = options.postId;
            },

            /**
             * Load existing winners
             */
            loadWinners: function(){
                var winners = Config.loadWinners(this.postId);
                if(winners.length > 0){
                    this.add(winners);
                }
                
            },

            /**
             * Store winners
             */
            saveWinners: function(){
                Config.saveWinners(this.postId, this.toJSON());
            },

            /**
             * Pick a winner
             *
             * @param {array} likers
             * @param {array} commenters
             * @param {boolean} includeLikers
             * @param {boolean} includeCommenters
             * @param {boolean} unique - same liker/commenters is single candidate
             * @return {boolean}
             *
             */
            pickWinner: function(likers, commenters, includeLikers, includeCommenters, unique){
                var self = this, candidates = [], ids = [];

                /**
                 * Pick random number from min to max
                 *
                 * @param {int} min
                 * @param {int} max
                 *
                 * @return {int}
                 */
                var rand = function (min, max) {
                    var argc = arguments.length;
                    if (argc === 0) {
                        min = 0;
                        max = 2147483647;
                    } else if (argc === 1) {
                        throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
                    }
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                /**
                 * Concat fromArray to candidates
                 *
                 * @param {array} fromArray
                 */
                var concatArr = function(fromArray){
                    for(var i in fromArray){
                        var candidate = fromArray[i];
                        //check if exists as candidate already
                        if(unique && _.indexOf(ids, candidate.id) >= 0){
                            continue;
                        }
                        //check if already a winner
                        if(!_.find(self.toJSON(), function(winner){
                            return winner.id == candidate.id;
                        }))
                        {
                            ids.push(candidate.id);
                            candidates.push(candidate);
                        }
                    }
                }
                //from likers
                if(includeLikers){
                    concatArr(likers);
                }
                //from commenters
                if(includeCommenters){
                    concatArr(commenters);
                }
                //no candidates
                if(candidates.length == 0){
                    return false;
                }
                var winnerIndex = rand(0, candidates.length -1);
                //winner selected
                this.add(candidates[winnerIndex]);
                return true;
            }

        });

        return WinnerCollection;

    });