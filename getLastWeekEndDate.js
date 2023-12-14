let getLastWeekEndDate = () => {
    var today = new Date();
    //set time in hours, min, seconds to 0 for the API
    today.setHours(-(today.getTimezoneOffset() / 60),0,0,0)
    //this takes the current date and moves back to saturday, which is the final day of the week for the API
    today.setDate(today.getDate() - today.getDay() - 9);
    console.log(today.getDay());
    return today;
}

 module.exports = {getLastWeekEndDate};
