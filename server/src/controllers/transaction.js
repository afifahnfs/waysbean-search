// import model here
const { transaction, product, user, order } = require("../../models");

exports.getTransactions = async (req, res) => {
  try {
    let transactions = await transaction.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role", "image"],
          },
        },
        {
          model: order,
          as: "order",
          attributes: {
            exclude: ["createdAt", "updatedAt", "product_id", "transaction_id"],
          },
          include: {
            model: product,
            as: "products",
            attributes: {
              exclude: ["createdAt", "updatedAt", "admin_id"],
            },
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    res.send({
      status: "success...",
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.myTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role", "image"],
          },
        },
        {
          model: order,
          as: "order",
          attributes: {
            exclude: ["createdAt", "updatedAt", "product_id", "transaction_id"],
          },
          include: {
            model: product,
            as: "products",
            attributes: {
              exclude: ["createdAt", "updatedAt", "admin_id"],
            },
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    res.send({
      status: "success...",
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const data = req.body;

    console.log(data);

    const newProducts = req.body.products;

    let dataProduct = JSON.parse(newProducts);

    console.log(dataProduct);
    console.log(typeof dataProduct);
    // console.log(newProducts[0].id);

    const newTransaction = await transaction.create({
      ...data,
      attachment: req.file.filename,
      user_id: req.user.id,
    });

    console.log(newTransaction);

    const orderProducts = dataProduct.map((product) => {
      return {
        product_id: `${product.id}`,
        orderQuantity: `${product.orderQuantity}`,
        transaction_id: `${newTransaction.id}`,
      };
    });
    await order.bulkCreate(orderProducts);

    const showTransaction = await transaction.findOne({
      where: {
        id: newTransaction.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role", "image"],
          },
        },
      ],
      exclude: ["createdAt", "updatedAt", "user_id"],
    });

    console.log(newTransaction.id);

    let showOrder = await order.findAll({
      where: {
        transaction_id: newTransaction.id,
      },
      include: {
        model: product,
        as: "products",
      },
    });

    console.log(showOrder);

    productOrder = showOrder.map((detailOrder) => {
      return {
        id: detailOrder.products.id,
        name: detailOrder.products.name,
        price: detailOrder.products.price,
        description: detailOrder.products.description,
        photo: detailOrder.products.photo,
        orderQuantity: detailOrder.orderQuantity,
      };
    });

    res.send({
      status: "success",
      data: {
        transaction: {
          id: showTransaction.id,
          user: showTransaction.user,
          name: showTransaction.name,
          email: showTransaction.email,
          phone: showTransaction.phone,
          address: showTransaction.address,
          attachment: showTransaction.attachment,
          status: showTransaction.status,
          products: productOrder,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await transaction.update(req.body, {
      where: {
        id,
      },
    });

    const transactionUpdate = await transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    let showOrder = await order.findAll({
      where: {
        transaction_id: transactionUpdate.id,
      },
      include: {
        model: product,
        as: "products",
      },
    });

    productOrder = showOrder.map((detailOrder) => {
      return {
        id: detailOrder.products.id,
        name: detailOrder.products.name,
        price: detailOrder.products.price,
        description: detailOrder.products.description,
        photo: detailOrder.products.photo,
        orderQuantity: detailOrder.orderQuantity,
      };
    });

    res.send({
      status: "success",
      data: {
        transaction: {
          id: transactionUpdate.id,
          user: transactionUpdate.user,
          name: transactionUpdate.name,
          email: transactionUpdate.email,
          phone: transactionUpdate.phone,
          address: transactionUpdate.address,
          attachment: transactionUpdate.attachment,
          status: transactionUpdate.status,
          products: productOrder,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const dataTransaction = await transaction.findOne({
      where: {
        id: id,
      },
    });

    if (dataTransaction.attachment === null) {
      await transaction.destroy({
        where: {
          id,
        },
      });
    } else {
      var fs = require("fs");
      var filePath = `./uploads/${dataTransaction.attachment}`;
      fs.unlinkSync(filePath);

      await transaction.destroy({
        where: {
          id,
        },
      });
    }

    res.send({
      status: "success",
      message: `Delete transaction id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
