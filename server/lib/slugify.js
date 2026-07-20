import normalizeArabic from "./normalize.js";
import prisma from "../lib/prisma.js";
import { nanoid } from "nanoid";

async function slugify(title) {
  let slug = normalizeArabic(title)
    .replace(/\s+/g, "-")
    .replace(/[،؛!.,"']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  let exists = await prisma.article.findUnique({ where: { slug } });
  while (exists) {
    slug = slug + "-" + nanoid(6);
    exists = await prisma.article.findUnique({ where: { slug } });
  }

  return slug;
}

export default slugify;
