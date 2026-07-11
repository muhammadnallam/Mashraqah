const router = require("express").Router();

router.post("/create", (req, res) => {
    console.log("HELLO");
    console.log(req.body);
    res.status(200).json({ slug: "test-slug" });
});

module.exports = router;
