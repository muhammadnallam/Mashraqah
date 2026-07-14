const router = require("express").Router();
// const crypto = require("crypto");
const prisma = require("../lib/prisma");
const slugify = require("../lib/slugify");
const validateArticle = require("../middleware/validateArticle");

router.post("/create", validateArticle, (req, res) => {
    const { validatedContent, articleData } = req;

    slugify("كيف تُطور مهاراتك في البرمجة بلغة بايثون؟", "مجتمع");

    // Generate Slug
    // const slug = crypto.randomUUID().slice(0, 8);

    // Add to DB
    // const article = await prisma.article.create({
    //     data: {
    //         slug,
    //         title: articleData.seoTitle,
    //         subtitle: articleData.seoDescription,
    //         content: validatedContent,
    //         authorId: req.user?.id,
    //         tags: {
    //             create: {
    //                 tag: {
    //                     connectOrCreate: {
    //                         where: { name: articleData.tag },
    //                         create: { name: articleData.tag },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // });

    res.status(200).json({ slug: "article.slug" });
});

module.exports = router;
