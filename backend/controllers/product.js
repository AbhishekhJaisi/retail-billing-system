const { createProduct } = require('../services/productService');
const { success, error } = require('../utils/responseHelper');

const create = async (req, res) => {
    try {
        const product = await createProduct(
            req.body,
            req.user.id
        );

        return success(res, "Product created successfully", product, 201);
    }
    catch (err) {
        return error(res, err.message, null, 500);
    }
}

module.exports = { create };