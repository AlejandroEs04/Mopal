function getDaysPerMonth(month, year) {
    if (month === 1) { 
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return 29;
        } else {
            return 28;
        }
    } else {
        return (month === 3 || month === 5 || month === 8 || month === 10) ? 30 : 31;
    }
}

export default getDaysPerMonth