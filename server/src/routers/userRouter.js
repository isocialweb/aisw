const { Router, express } = require("express");
const {asureAuth} = require('../middleware/autenticated')



const {
  createUser,
  getUserList,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  

} = require("../controllers/userController");

const {login, register} =require ("../controllers/authController")



// const {register, login, refreshAccesToken} = require("../controllers/auth")

const routerUser = Router();

routerUser.post("/register", register);
// routerUser.post("/login", [middle.passNeeded, middle.emailNeeded, middle.unknowUser],  login);
// routerUser.post("/refreshtoken", middle.time, middle.validateHasBody, refreshAccesToken);
// routerUser.post("/", middle.time, middle.validateHasBody, createUser);




routerUser.post("/login", login)


routerUser.get("/me",  getMe);
routerUser.get("/:id",  getUserById);
routerUser.get("/", asureAuth, getUserList);
routerUser.post("/new", createUser)

routerUser.patch("/:id", updateUser);
routerUser.delete("/:id",  deleteUser);









module.exports = routerUser;
