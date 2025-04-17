function compareTime(timeString1, timeString2) {
  let date1 = new Date(timeString1);
  let date2 = new Date(timeString2);

  return date1.getTime() > date2.getTime();
}

module.exports = {
  compareTime,
};

// example:
// let date = new Date("2025-04-15 10:12:00")
// console.log(date)
// => Tue Apr 15 2025 10:12:00 GMT+0530 (India Standard Time)
// date.getTime()
// => 1744692120000        // returns the number of milliseconds since 1 January 1970
