(function ($) {
    var input = '';
    var callback;
    function key_press(e) {
        c = String.fromCharCode(e.which);
        if (e.keyCode == 13 || e.keyCode == 35) {
            callback(input);
            input = '';
            return;
        }
        
        if (/^[0-9]+$/.test(c))
            input += c;
    }
    /*
    function key_press(e) {
        c = String.fromCharCode(e.which);
        console.log(e.keyCode)
        if (/^[0-9]+$/.test(c))
            input += c;
        else if (e.keyCode == 13 || e.keyCode == 35) {
            callback(input);
            input = '';
        }    
    }
    */

    $.codescanner = function (callbackFunction) {
        if (callbackFunction) {
            input = '';
            callback = callbackFunction;
            $(document).keypress(key_press);
        }
        else {
            $(document).keypress(null);
        }
    }
}(jQuery));