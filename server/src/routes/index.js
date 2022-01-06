const express = require("express");

const router = express.Router();

// import controller
const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const {
  addProduct,
  getProducts,
  getProduct,
  getProductByName,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const {
  addTransaction,
  getTransactions,
  myTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction");

const { checkAuth } = require("../controllers/auth");

// import middleware auth
const { auth } = require("../middlewares/auth");

// import middleware uploadFile
const { uploadFile } = require("../middlewares/uploadFile");

// add route
router.post("/register", register);
router.post("/login", login);

router.get("/check-auth", auth, checkAuth);

router.get("/user", auth, getUser);
router.patch("/user", auth, uploadFile("image"), updateUser);
router.delete("/user", auth, deleteUser);

router.post("/product", auth, uploadFile("photo"), addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.get("/product-name/:name", getProductByName);
router.patch("/product/:id", uploadFile("photo"), updateProduct);
router.delete("/product/:id", deleteProduct);

router.post("/transaction", auth, uploadFile("attachment"), addTransaction);
router.get("/transactions", getTransactions);
router.get("/my-transactions", auth, myTransactions);
router.patch("/transaction/:id", auth, updateTransaction);
router.delete("/transaction/:id", deleteTransaction);

module.exports = router;
