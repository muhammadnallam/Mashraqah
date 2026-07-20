import { generateHTML } from "@tiptap/html"
import { Node, mergeAttributes } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import { TaskList, TaskItem } from "@tiptap/extension-list"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"

const ArticleTitle = Node.create({
  name: "articleTitle",
  group: "block",
  content: "text*",
  marks: "",
  defining: true,
  renderHTML({ HTMLAttributes }) {
    return ["h1", mergeAttributes(HTMLAttributes, { class: "article-title" }), 0]
  },
})

const ArticleDescription = Node.create({
  name: "articleDescription",
  group: "block",
  content: "text*",
  marks: "",
  defining: true,
  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(HTMLAttributes, { class: "article-description" }), 0]
  },
})

const extensions = [
  StarterKit.configure({ link: { openOnClick: false } }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Highlight.configure({ multicolor: true }),
  Image,
  ArticleTitle,
  ArticleDescription,
]

export function renderTipTap(json) {
  return generateHTML(json, extensions)
}
