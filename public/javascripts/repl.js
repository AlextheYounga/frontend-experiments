var pixelsToMM = function (element) {
    element = document.getElementById(element);
    var width = parseInt(window.getComputedStyle(element, null).width);
    var height = parseInt(window.getComputedStyle(element, null).height);
    var converted = {};

    converted['width'] = Math.floor(width * 0.264583);
    converted['height'] = Math.floor(height * 0.264583);
    return {
        'width': converted.width,
        'height': converted.height,
    }
}


console.log(pixelsToMM('canvas'));