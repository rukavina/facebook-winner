/**
 * Facebook Winner
 *
 * require.js entry file, setup and run app
 *
 * @author Milan Rukavina
 * @version 1.0.2
 */

require.config({
    shim: {
        'facebook': {
            "export": 'FB'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min',
        underscore: '../bower_components/underscore/underscore-min',
        backbone: '../bower_components/backbone/backbone-min',
        templates: '../templates',
        facebook: 'https://connect.facebook.net/en_US/all',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
        formatDateTime: '../bower_components/jquery.formatDateTime/dist/jquery.formatDateTime.min'
    },
    urlArgs:"v=1.0.3"
});

//load depenencies and run
require([
    'fb','app'
], function(fbMod,App) {
    App.initialize();
});