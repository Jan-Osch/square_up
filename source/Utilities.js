function createTwoDimensionalArray(rows, columns, value) {
    if (!value) {
        value = 0;
    }
    var result = [];
    var temp;
    for (var i = 0; i < rows; i++) {
        temp = [];
        for (var j = 0; j < columns; j++) {
            temp.push(value);
        }
        result.push(temp);
    }
    return result;
}
