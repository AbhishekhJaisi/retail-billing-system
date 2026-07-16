const { Product } = require('../models');

const createProduct = async (data, shopId) => {
    const payload = {
        name: data.name,
        price: Number(data.price),
        stock: Number(data.stock),
        lowStockAlert: Number(data.lowStockAlert || 5),
        shop_id: shopId
    };

    if (!payload.name || Number.isNaN(payload.price) || Number.isNaN(payload.stock) || Number.isNaN(payload.lowStockAlert)) {
        throw new Error('Please provide valid product details');
    }

    return await Product.create(payload);
}

const getAllProduct = async (shopId) => {
    return await Product.findAll({
        where: {
            shop_id: shopId,
        },
        order: [['createdAt', 'DESC']]
    });
}

const getProductById = async(productId) => {
    return await Product.findOne({
        where: {
            id: productId,
        },
        order: [['createdAt', 'DESC']]
    })
}

const updateProduct = async (id, data, shopId) => {
    const product = await Product.findOne({
        where: {
            id,
            shop_id: shopId,
        }
    });

    if (!product) {
        throw new Error('Product not found');
    }

    const payload = {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.price !== undefined && { price: Number(data.price) }),
        ...(data.stock !== undefined && { stock: Number(data.stock) }),
        ...(data.lowStockAlert !== undefined && { lowStockAlert: Number(data.lowStockAlert) })
    };

    await product.update(payload);
    return product;
}

const deleteProduct = async (id, shopId) => {
    const product = await Product.findOne({
        where: {
            id,
            shop_id: shopId,
        }
    });

    if (!product) {
        throw new Error('Product not found');
    }

    await product.destroy();
    return true;
}

module.exports = { createProduct, getAllProduct, updateProduct,getProductById, deleteProduct };