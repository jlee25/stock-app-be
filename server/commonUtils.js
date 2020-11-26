let toDate = require('date-fns/toDate');
let subDays = require('date-fns/subDays');
let format = require('date-fns/format')

async function getOldDates(dateType) {
    switch (dateType) {
        case "monthly":
            return format(subDays(new Date(), 30), 'yyyy-MM-dd');
        case "weekly":
            return format(subDays(new Date(), 7), 'yyyy-MM-dd');
        case "yearly":
            return format(subDays(new Date(), 365), 'yyyy-MM-dd');
        default: 
        return format(subDays(new Date(), 30), 'yyyy-MM-dd');
    }
}

module.exports = {
    getOldDates
}