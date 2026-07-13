const { Product } = require('../models');

const createProduct = async (data, shopId) => {
    return await Product.create({
        ...data,
        shop_id: shopId
    });
}

module.exports = { createProduct };