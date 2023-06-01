// imports
const controller = require("../controllers/controller");
const { Router } = require("express");

// router init
const router = Router();

// routes
    // get
router.get("/", controller.welcome_get);

router.get("/signup", controller.signup_get);

router.get("/login", controller.login_get);

router.get("/logout", controller.logout_get);

router.get("/todo", controller.todoList_get);

router.get("/user", controller.home_get);

router.get("/veileder", controller.veileder_get);

router.get("/:user", controller.home_get);

    // post
router.post("/signup", controller.signup_post);

router.post("/login", controller.login_post);

router.post("/todo", controller.todo_post);

router.post("/delete", controller.delete_post);

    // 404
router.use(controller.error404);

// export
module.exports = router;