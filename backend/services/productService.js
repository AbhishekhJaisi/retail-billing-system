const { Product } = require('../models');

const createProduct = async (data, shopId) => {
    const payload = {
        name: data.name,
        unit: String(data.unit),
        cost_price: Number(data.cost_price),
        selling_price: Number(data.selling_price),
        stock: Number(data.stock),
        lowStockAlert: Number(data.lowStockAlert || 5),
        shop_id: shopId,
    };

    // console.log(payload.name)
    // console.log(payload.totalPrice)
    // console.log(payload.stock)
    // console.log(payload.lowStockAlert)
    // console.log(payload.shop_id)

    if (!payload.name ||  Number.isNaN(payload.stock) || Number.isNaN(payload.lowStockAlert) || Number.isNaN(payload.cost_price) || Number.isNaN(payload.selling_price)) {
        throw new Error('Please provide valid product details');
    }

    return await Product.create(payload);
}

const getMyProduct = async (shopId) => {
    return await Product.findAll({
        where: {
            shop_id: shopId,
        },
        order: [['createdAt', 'DESC']]
    });
}

const getProductById = async(productId) => {
    return await Product.findAll({
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
        ...(data.unit !== undefined && { unit: data.unit }),
        ...(data.cost_price !== undefined && { cost_price: Number(data.cost_price) }),
        ...(data.selling_price !== undefined && { selling_price: Number(data.selling_price) }),
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

// const getlowStockProduct = async(id, productId) => {
//     const product = await Product.findAll({
//         where:{
//             id,
//             stock<=0
//         }
//     })
// } 

module.exports = { createProduct, getMyProduct, updateProduct,getProductById, deleteProduct };