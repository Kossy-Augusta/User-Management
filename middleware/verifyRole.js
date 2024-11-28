
const verifyRoles = (...allowedRoles)=>{
    return(req, res, next)=>{
        if(!req?.roles) return res.status(401).send({"message": "Unauthorized acces"});
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => allowedRoles.includes(role)).find(value => value === true);
        if (!result) return res.status(401).send({message: "Unauthorized, not ennough privilleges"});
        next();
    }
}
module.exports = verifyRoles;