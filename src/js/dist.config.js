/**
 * Facebook Winner
 *
 * Configuration object
 *
 * Update app settings here
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define(['jquery'], function($) {
    return {
        debug: false,
        pageId: null, //force single page posts
        facebook:{
            appId: '1625113581135993', //your facebook app id
            scope: 'user_likes', //app permission scope
            limit: 1000 //number of items obtained via fb api
        },
        perPage: 20, //paging for lists
        showAdminPages: false, //list pages which you manage instead of ones you like, requires app scope 'manage_pages'
        dateTimeFormat: 'mm/dd/y g:ii a', //date time format
        /**
         * Load stored winners - has to return array of objects {id: , name:}
         *
         * @param {string} postId
         * @return {array}
         */
        loadWinners: function(postId){
            var winners = JSON.parse(localStorage.getItem('mgw_' + postId));
            if(!winners){
                winners = []
            }
            return winners;
        },
        /**
         * Store winners
         *
         * @param {string} postId
         * @param {array} winners array of object {id: ..., name: ...}
         */
        saveWinners: function(postId, winners){
            localStorage.setItem('mgw_' + postId, JSON.stringify(winners));
        }
    };
});
