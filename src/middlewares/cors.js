const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3005');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
}

module.exports = cors;