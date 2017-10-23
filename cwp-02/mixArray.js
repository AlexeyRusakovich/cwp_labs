let mixArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = array[num];
        array[num] = array[i];
        array[i] = d;
    }
    return array;
}
module.exports.mixArray = mixArray;