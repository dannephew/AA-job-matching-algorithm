// schedules would contain time ranges for business and employee
// ex. schedules[0] = business time range, schedules[1] = employee time range
function getSlots(person) {
    slots = [];
    for (let i = 0; i < person.length; i++) {
        start = person[i][0];
        end = person[i][1];
        //console.log([start, end]);
        inc = 0;
        while ((start + inc) < end) {
            slots.push([start+inc, start+100+inc]);
            inc += 100;
        }
    }
    return slots;
}

const includeArray = (val, array) => {
    return val.some(e => Array.isArray(e) && e.every((j, i) => Object.is(array[i], j)));
  }

function find_times(schedules) {
    allSlots = [];
    for (let i = 0; i < 24; i++) {
        allSlots.push([i*100, (i+1)*100]);
    }

    freeSlots = [];
    for (let i = 0; i < allSlots.length; i++) {
        goodTime = true;
        for (let j = 0; j < schedules.length; j++) {
            entityFreeSlots = getSlots(schedules[j]);
            if (!includeArray(entityFreeSlots, allSlots[i])) {
                goodTime = false;
                break;
            }
        if (goodTime) {
            freeSlots.push(allSlots[i]);
            }
        }
    }
    return freeSlots;
}

const business_times = [ [700, 1200], [1900, 2000] ];
const employee_times = [ [600, 1000], [1500, 1900] ];
const schedules = [business_times, employee_times];
console.log(find_times(schedules));