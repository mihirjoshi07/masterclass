const { signUp, login ,loginWithGoogle, logout} = require("../controllers/authController");
const { validateUser, validateLogin } = require("../validators/authValidator");
const authMiddleware=require("../middleware/auth");
const router=require("express").Router();

router.post("/signUp",validateUser, signUp);
router.post("/login",validateLogin,login);
router.get("/google",loginWithGoogle);
router.post('/logout',authMiddleware, logout);
  
module.exports=router;