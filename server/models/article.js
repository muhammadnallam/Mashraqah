const prisma = require("../lib/prisma");

class Article {
    async slugExists(slug) {
        const result = await prisma.article.findUnique({
            where: { slug: slug },
        });

        return result;
    }
}

module.exports = Article;