
(function () {

    getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    arrayObjectIndexOf = function(a, value, property) {
        for(var i = 0, len = a.length; i < len; i++) {
            if (a[i][property] === value) return i;
        }
        return -1;
    }

})();