
var Utils = {};

(function () {

/**
 * Returns an object of the URL parameters.
 *
 * Adapted from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
 *
 * @return {Object} an object of the URL parameters
 */
Utils.getUrlParameters = function () {
    var params = {};
    var vars = window.location.search.substring(1).split('&');

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        // If first entry with this name
        if (typeof params[pair[0]] === 'undefined') {
            params[pair[0]] = pair[1];
        // If second entry with this name
        } else if (typeof params[pair[0]] === 'string') {
            var arr = [params[pair[0]], pair[1]];
            params[pair[0]] = arr;
        // If third or later entry with this name
        } else {
            params[pair[0]].push(pair[1]);
        }
    }

    return params;
};

})();
