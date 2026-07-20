import { Router } from "express";
import validateArticle from "../middleware/validateArticle.js";
import requireAuth from "../middleware/requireAuth.js";
import { createArticle } from "../services/articleService.js";

const router = Router();
router.use(requireAuth);

router.post("/create", validateArticle, async (req, res) => {
    const { validatedContent, articleData } = req;

    const slug = await createArticle(validatedContent, articleData);

    res.status(200).json({ slug });
});

export default router;
