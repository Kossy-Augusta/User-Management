
const validateReqBody = (validationSchema)=> async (req, res, next)=>{
    try {
        await validationSchema.validateAsync(req.body);
        next()
    } catch (err) {
        res.status(400).send({error: true, message: err.message})
    }
}

module.exports = validateReqBody;