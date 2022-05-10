// schedules would contain time ranges for business and employee
// ex. schedules[0] = business time range, schedules[1] = employee time range
function find_times(schedules) {
    matches = [];
    intervals = []
    for (let time_range of schedules) {
        //console.log(time_range);
        for (let time of time_range) {
            intervals.push(time);
        }
    }
    //console.log(intervals);
    intervals = intervals.sort(function(a, b) {return b[0] - a[0];});
    //console.log(intervals);
    check = [];
    while (intervals.length > 0) {
        time = intervals.pop();

        if (check.length > 0 && check[check.length - 1][1] >= time[0]) {
            check[check.length - 1][1] = Math.max(time[1], check[check.length - 1][1]);
        }
        else {
            check.push(time);
        }
        //console.log(check);
    }

    return check;
}

const business_times = [ [700, 1200], [1400, 1800] ];
const employee_times = [ [600, 1000], [1500, 1900] ];
const schedules = [business_times, employee_times];
//console.log(schedules);
console.log(find_times(schedules));