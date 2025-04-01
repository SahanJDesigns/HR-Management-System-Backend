const jwt = require('jsonwebtoken');


const roleHierarchy = {
    Admin: 4,
    "HR Manager": 3,
    Supervisor: 2,
    Employee: 1
};

const grantPrivileges = (requiredRole) => {
    return (req, res, next) => {
        const token = req.cookies.user;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
       
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const role = verified.role;

        // Check if the role exists and compare the hierarchy
        if (roleHierarchy[role] >= roleHierarchy[requiredRole]) {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    };
};

exports.grantPrivileges = grantPrivileges;
