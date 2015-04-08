var addLeadingZeros = function (s, l) {

    var sLength = s.length;
    if (sLength >= l) return s;

    var diff = l - sLength;
    var i = 0;

    while (i < diff) {
        s = '0' + s;
        i++;
    }

    return s;

};

var convertToBin = function (n) {
    return addLeadingZeros(n.toString(2), 8);
};

var getCharacterCode = function (c) {
    return c.charCodeAt(0);
};

var splitInto4 = function (s) {
    return [s.slice(0, 6), s.slice(6, 12), s.slice(12, 18), s.slice(18)];
};

var binToCharCode = function (binaryString) {
    return parseInt(binaryString, 2);
};

var str = 'Man';

var binary = str.split('').map(getCharacterCode).map(convertToBin).join('');

var base64Bin = splitInto4(binary).map(binToCharCode);



