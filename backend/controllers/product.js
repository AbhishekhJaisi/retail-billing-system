const { createProduct, getAllProduct, updateProduct, deleteProduct } = require('../services/productService');
const { success, error } = require('../utils/responseHelper');

const create = async (req, res) => {
    try {
        const product = await createProduct(req.body, req.user.id);
        return success(res, "Product created successfully", product, 201);
    }
    catch (err) {
        return error(res, err.message || 'Unable to create product', null, 500);
    }
}

const getAll = async (req, res) => {
    try {
        const products = await getAllProduct(req.user.id);
        return success(res, "Fetched all products", products, 200);
    }
    catch (err) {
        return error(res, err.message || 'Internal Server Error', null, 500);
    }
}

const update = async (req, res) => {
    try {
        const product = await updateProduct(req.params.id, req.body, req.user.id);
        return success(res, "Product updated successfully", product, 200);
    }
    catch (err) {
        return error(res, err.message || 'Unable to update product', null, 500);
    }
}

const remove = async (req, res) => {
    try {
        await deleteProduct(req.params.id, req.user.id);
        return success(res, "Product deleted successfully", null, 200);
    }
    catch (err) {
        return error(res, err.message || 'Unable to delete product', null, 500);
    }
}

module.exports = { create, getAll, update, remove };