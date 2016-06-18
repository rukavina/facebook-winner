/**
 * Facebook Winner
 *
 * Winner model
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'underscore',
    'backbone',
    ], function(_, Backbone) {

        var WinnerModel = Backbone.Model.extend({
            defaults: {
                "id":  "",
                "name":     ""
            }

        });

        return WinnerModel;

    });