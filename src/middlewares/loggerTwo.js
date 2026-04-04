const loggerTwo = (request, response, next) => {
    console.log('Log 2');
    next();
}

module.exports = loggerTwo;