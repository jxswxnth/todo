// this line is used to export this function to other modules
//module.exports.test can also written as exports.test
exports.getDate = function(){
  const date = new Date();
  let options = {
    month: 'long',
    weekday: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString("en-US", options);
}

exports.getDay = function (){
  const date = new Date();
  let options = {
    weekday: 'long',
  }
  return date.toLocaleDateString("en-US", options);
}

// console.log(module) to see all exports from this date.js module.
