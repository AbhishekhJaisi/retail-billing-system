const success = (res, message, data, status = 200) => {
    return res.status(status).json({
        success: true,
        message: message,
        data: data
    });
};

const error = (res, message, data, status = 500) => {
    return res.status(status).json({
        success: false,
        message: message,
        data: data
    })
}

module.exports = {success, error};