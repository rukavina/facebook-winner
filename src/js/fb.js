/**
 * Facebook Winner
 *
 * Fb API init
 *
 * Update app settings here
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define(['jquery', 'facebook', 'config'], function($, fb, Config) {
    FB.init({
        appId: Config.facebook.appId,
        //channelUrl: Config.facebook.channelUrl,
        //status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML        
    });
    /*FB.Event.subscribe('auth.statusChange', function(response) {
        $(document).trigger('fbStatusChange', response);
    });*/
});