import normalizeArabic from "../lib/normalize";
import slugify from "../lib/slugify";
import extractText from "../lib/extractText";
import prisma from "../lib/prisma";

export async function createArticle(validatedContent, articleData, userId) {
    const { seoTitle, seoDescription, tag, sendEmail, coverImage, characterCount, readTime } =
        articleData;
    const title =
        validatedContent.content?.[0]?.content?.[0]?.text?.trim() || "";
    const subtitle =
        validatedContent.content?.[1]?.content?.[0]?.text?.trim() || "";
    const slug = await slugify(title);
    const searchVector = normalizeArabic(extractText(validatedContent));

    const contentClone = JSON.parse(JSON.stringify(validatedContent));
    contentClone.content.splice(0, 2);

    const result = await prisma.article.create({
        data: {
            slug: slug,
            title: title,
            subtitle: subtitle,
            seoTitle: seoTitle,
            seoSubtitle: seoDescription,
            topic: tag,
            coverImage: coverImage,
            content: contentClone,
            searchVector: searchVector,
            readTime: readTime,
            authorId: userId,
        },
    });

    return slug;
}

export async function getArticleBySlug(slug) {
    return prisma.article.findUnique({
        where: { slug },
        include: {
            author: {
                select: { name: true, image: true },
            },
        },
    });
}
