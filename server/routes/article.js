import { Router } from "express";
import validateArticle from "../middleware/validateArticle.js";
import requireAuth from "../middleware/requireAuth.js";
import { createArticle, getArticleBySlug } from "../services/articleService.js";

const router = Router();

router.post("/create", requireAuth, validateArticle, async (req, res) => {
    const { validatedContent, articleData } = req;
    const userId = req.user.id;
    const slug = await createArticle(validatedContent, articleData, userId);
    res.status(200).json({ slug });
});

router.get("/:slug", async (req, res) => {
    const article = await getArticleBySlug(req.params.slug);
    if (!article) return res.status(404).json({ error: "المقال غير موجود" });
    res.json(article);
});

export default router;
