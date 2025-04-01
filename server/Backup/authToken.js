const jwt = require('jsonwebtoken');
const secretKey = '1234';

const auth = async(req, res) => {
    const token = req.cookies['user'];
    if (!token) return res.status(200).json({ auth:false});
    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        res.status(200).json({ auth: true});
    } catch (err) {
        console.error(err);
        res.status(200).json({ auth: false});
    }
};

const authenticateToken = (req, res, role,next) => {
    const token = req.cookies['user'];
    if (!token) return res.status(401).json({ error: 'Access denied 1' });
    try {
        const verified = jwt.verify(token, secretKey);
        if(role.includes(verified.role)){
            next();
        }else{
            res.status(400).json({error: 'Access denied 2'})
        }
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });

    }
  };


module.exports = {
    authenticateToken,
    auth
};
