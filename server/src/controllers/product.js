// import model here
const { product, user } = require("../../models");

exports.getProducts = async (req, res) => {
  try {
    let products = await product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "admin_id"],
      },
    });

    // make url image for open public
    data = JSON.parse(JSON.stringify(products));

    dataProduct = data.map((item) => {
      return {
        ...item,
        photo: process.env.PATH_FILE + item.photo,
      };
    });

    res.send({
      status: "success...",
      data: {
        product: dataProduct,
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

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const dataProduct = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "admin_id"],
      },
    });

    data = JSON.parse(JSON.stringify(dataProduct));

    data = {
      ...data,
      photo: process.env.PATH_FILE + data.photo,
    };

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const { name } = req.params;

    let products = await product.findAll({
      where: {
        name,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "admin_id"],
      },
    });

    // make url image for open public
    data = JSON.parse(JSON.stringify(products));

    dataProduct = data.map((item) => {
      return {
        ...item,
        photo: process.env.PATH_FILE + item.photo,
      };
    });

    res.send({
      status: "success...",
      data: {
        product: dataProduct,
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

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    console.log(data);

    const newProduct = await product.create({
      ...data,
      // input image for save in db and id from token
      photo: req.file.filename,
      admin_id: req.user.id,
    });

    console.log(newProduct);

    const productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "admin_id"],
      },
    });

    res.send({
      status: "success...",
      data: {
        product: productData,
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = Object.assign({}, req.body); // Copy req.body in order not to change it
    updateData.photo = req.file.filename;

    await product.update(updateData, {
      where: {
        id,
      },
    });

    const dataProduct = await product.findOne({
      where: {
        id,
      },

      attributes: {
        exclude: ["createdAt", "updatedAt", "admin_id"],
      },
    });

    res.send({
      status: "success",
      message: `Update product id: ${id} finished`,
      data: {
        product: dataProduct,
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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const dataProduct = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "admin_id"],
      },
    });

    var fs = require("fs");
    var filePath = `./uploads/${dataProduct.photo}`;
    fs.unlinkSync(filePath);

    await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete Product id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
