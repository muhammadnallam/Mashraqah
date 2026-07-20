import normalizeArabic from "../lib/normalize";
import slugify from "../lib/slugify";
import extractText from "../lib/extractText";
import prisma from "../lib/prisma";

export async function createArticle(validatedContent, articleData) {
    const { seoTitle, seoDescription, tag, sendEmail, coverImage } = articleData;
    const title = validatedContent.content?.[0]?.content?.[0]?.text?.trim() || "";
    const subtitle = validatedContent.content?.[1]?.content?.[0]?.text?.trim() || "";
    const slug = await slugify(title);
    const searchVector = normalizeArabic(extractText(validatedContent));

    const result = await prisma.article.create({
        data: {
            slug: slug,
            title: title,
            subtitle: subtitle,
            seoTitle: seoTitle,
            seoSubtitle: seoDescription,
            topic: tag,
            coverImage: coverImage,
            content: validatedContent,
            searchVector: searchVector,
        },
    });

    return slug;
}
