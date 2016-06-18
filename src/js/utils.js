/**
 * Facebook Winner
 *
 * jquery utility methods
 *
 * @author Milan Rukavina
 * @version 1.0
 */

define(['jquery', 'facebook', 'config'], function($, fb, Config) {
    /**
     * Show alter message on top
     *
     * @param {string} messageText is empty hieds message
     * 
     * @param {string} messageType: success, warning, danger
     */
    $.message = function(messageText, messageType) {
        var $message = $("#message"), $alert = $message.find(".alert");
        var currType = $message.data("type");
        if (!messageText) {
            $message.hide();
            return;
        }
        $alert.removeClass("alert-" + currType).addClass("alert-" + messageType);
        $alert.find("div.text").html(messageText);
        $message.data("type", messageType);
        $message.show();
    }

    /**
     * Write to console if config.debug
     *
     */
    $.debug = function(message){
        if(Config.debug){
            console.log(message);
        }
    }
    
    var loadingCount = 0;

    /**
     * FB.api wrapper, shows/hides loader anim.
     *
     * @param {string} url api url
     *
     * @param {function} cb callback
     */
    $.fbApi = function(url, cb) {
        loadingCount++;
        $("#loader").show();
        FB.api(url, function(response) {
            loadingCount--;
            //no others loading, hide loader
            if(loadingCount == 0){
                $("#loader").hide();
            }
            if (!response || response.error) {
                var messageText = "Facebook API error";
                if (response && response.error) {
                    messageText += ": " + response.error.message;
                }
                $.message("Facebook API error: " + response.error, "danger");
            }
            //exec callback
            cb(response);
        });
    }

    /**
     * Escape html chars
     * 
     * original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     */
    $.htmlentities = function(string, quote_style, charset, double_encode) {
        var hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style),
                symbol = '';
        string = string == null ? '' : string + '';

        if (!hash_map) {
            return false;
        }

        if (quote_style && quote_style === 'ENT_QUOTES') {
            hash_map["'"] = '&#039;';
        }

        if (!!double_encode || double_encode == null) {
            for (symbol in hash_map) {
                if (hash_map.hasOwnProperty(symbol)) {
                    string = string.split(symbol).join(hash_map[symbol]);
                }
            }
        } else {
            string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function(ignore, text, entity) {
                for (symbol in hash_map) {
                    if (hash_map.hasOwnProperty(symbol)) {
                        text = text.split(symbol).join(hash_map[symbol]);
                    }
                }

                return text + entity;
            });
        }

        return string;
    }

    /**
     * POSTED BY PAUL SOWDEN AT 19:40
     *
     * @param {string} string iso date
     */
    Date.prototype.setISO8601 = function (string) {
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        var d = string.match(new RegExp(regexp));

        var offset = 0;
        var date = new Date(d[1], 0, 1);

        if (d[3]) {
            date.setMonth(d[3] - 1);
        }
        if (d[5]) {
            date.setDate(d[5]);
        }
        if (d[7]) {
            date.setHours(d[7]);
        }
        if (d[8]) {
            date.setMinutes(d[8]);
        }
        if (d[10]) {
            date.setSeconds(d[10]);
        }
        if (d[12]) {
            date.setMilliseconds(Number("0." + d[12]) * 1000);
        }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17]);
            offset *= ((d[15] == '-') ? 1 : -1);
        }

        offset -= date.getTimezoneOffset();
        var time = (Number(date) + (offset * 60 * 1000));
        this.setTime(Number(time));
    }
});