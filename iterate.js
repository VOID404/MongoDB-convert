module.exports = function(array, callback) {
  for (var i=0,y=array[i]; i<array.length;i++, y = array[i]){
    callback(i,y)
  }
}
