import { Router } from "express";
import prisma from "../lib/prisma.js";
import slugify from "../lib/slugify.js";
import validateArticle from "../middleware/validateArticle.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth)

router.post("/create", validateArticle, (req, res) => {
    const { validatedContent, articleData } = req;

    console.log(articleData.coverImage);

    slugify("كيف تُطور مهاراتك في البرمجة بلغة بايثون؟", "مجتمع");

    res.status(200).json({ slug: "article.slug" });
});

export default router;
