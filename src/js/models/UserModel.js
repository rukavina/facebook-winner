/**
 * Facebook Winner
 *
 * FBUser model
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var UserModel = Backbone.Model.extend({
        defaults: {
            "id":  "",
            "name":     "",
            "first_name":    "",
            "last_name":    "",
            "gender":    "",
            "username":    "",
            "link":    "",
            "locale":    "",
            "timezone":    ""
        }

    });

    return UserModel;

});