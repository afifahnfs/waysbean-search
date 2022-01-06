// import model
const { user } = require("../../models");

// import joi
const joi = require("joi");

// import bcrypt
const bcrypt = require("bcrypt");

// import jsonwebtoken
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    fullName: joi.string().min(3).required().messages({
      "string.base": `Nama harus berupa teks`,
      "string.empty": `Nama tidak boleh kosong`,
      "string.min": `Minimal karakter untuk nama harus 3 digit`,
      "any.required": `Nama tidak boleh kosong`,
    }),
    role: joi.string(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      message: error.details[0].message,
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
      role: req.body.role,
    });

    const data = {
      id: newUser.id,
    };

    const SECRET_KEY = "IzinMasukWaysBean";

    const token = jwt.sign(data, SECRET_KEY);

    res.send({
      status: "success",
      message: "Register finished",
      data: {
        user: {
          email: newUser.email,
          fullName: newUser.fullName,

          token,
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

exports.login = async (req, res) => {
  // our validation schema here
  const schema = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(6).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.send({
        status: "failed",
        message: "Password not match",
      });
    }

    const data = {
      id: userExist.id,
      email: userExist.email,
      role: userExist.role,
    };

    const token = jwt.sign(data, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success",
      data: {
        fullName: userExist.fullName,
        email: userExist.email,
        token,
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

exports.getUser = async (req, res) => {
  try {
    // const { id } = req.params;

    const dataUser = await user.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["role", "password", "createdAt", "updatedAt"],
      },
    });

    // make url image for open public
    data = JSON.parse(JSON.stringify(dataUser));

    data = {
      ...data,
      image: process.env.PATH_FILE + data.image,
    };

    res.send({
      status: "success",
      data: {
        user: {
          fullName: data.fullName,
          email: data.email,
          image: data.image,
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

exports.updateUser = async (req, res) => {
  try {
    // const { id } = req.params;

    const id = req.user.id;

    // let updateData = req.body;
    let updateData = Object.assign({}, req.body); // Copy req.body in order not to change it
    updateData.image = req.file.filename;

    await user.update(updateData, {
      where: {
        id: id,
      },
    });

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: `Update user id: ${id} finished`,
      data: {
        user: dataUser,
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

exports.deleteUser = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id: id,
      },
    });

    console.log(dataUser.image);

    if (dataUser.image === null) {
      await user.destroy({
        where: {
          id: id,
        },
      });
    } else {
      var fs = require("fs");
      var filePath = `./uploads/${dataUser.image}`;
      fs.unlinkSync(filePath);

      await user.destroy({
        where: {
          id: id,
        },
      });
    }

    res.send({
      status: "success",
      message: `Delete user id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
