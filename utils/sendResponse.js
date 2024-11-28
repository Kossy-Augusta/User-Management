
const sendResponse = (res, statusCode, message, data = null, error = false) =>{
        const response = {
            status: error ? 'error' : 'success',
            data: data || null,
            message,
            error: error || false,
        };

        return res.status(statusCode).json(response);
    }

module.exports = sendResponse