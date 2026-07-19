const  product  = require('../services/productService');
const { success, error } = require('../utils/responseHelper');

const create = async (req, res) => {
    // console.log("Incoming data:", data);
    try {
        const products = await product.createProduct(req.body, req.user.id);

        return success(res, "Product created successfully", products, 201);
    }
    catch (err) {
        return error(res, err.message || 'Unable to create product', null, 500);
    }
}

const getAll = async (req, res) => {
    try {
        const products = await product.getMyProduct(req.user.id);

        if (products.length === 0) {
            return error(res, "No Products found", [], 200);
        }

        return success(res, "Fetched all products", products, 200);
    }
    catch (err) {
        return error(res, err.message || 'Internal Server Error', null, 500);
    }
}

const getById = async (req, res) => {
    try {
        const products = await product.getProductById(req.params.id);
        
        return success(res, "Fetched product by ID", products, 200);
    }
    catch (err) {
        return error(res, err.message || 'Internal Server Error', null, 500);
    }
}

const update = async (req, res) => {
    try {
        const updatedProduct = await product.updateProduct(req.params.id, req.body, req.user.id);
        return success(res, "Product updated successfully", updatedProduct, 200);
    }
    catch (err) {
        return error(res, err.message || 'Unable to update product', null, 500);
    }
}

const remove = async (req, res) => {
    try {
        await product.deleteProduct(req.params.id, req.user.id);
        return success(res, "Product deleted successfully", null, 200);
    }
    catch (err) {
        return error(res, err.message || 'Unable to delete product', null, 500);
    }
}

module.exports = { create, getAll, update, remove, getById };