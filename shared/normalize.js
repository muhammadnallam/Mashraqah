function normalizeArabic(text) {
    return (
        text
            // delete diacritics (tashkeel, tanwin, sukun, shadda, Quranic marks)
            .replace(
                /[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED\u08D3-\u08FF\u0670]/g,
                "",
            )
            // delete tatweel/kashida
            .replace(/\u0640/g, "")
            // آ أ إ ٱ -> ا
            .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
            // ى -> ي
            .replace(/\u0649/g, "\u064A")
            // ة -> ه
            .replace(/\u0629/g, "\u0647")
            // ؤ -> ء, ئ -> ء
            .replace(/[\u0624\u0626]/g, "\u0621")
            // collapse whitespace
            .replace(/\s+/g, " ")
            .trim()
    );
}

module.exports = normalizeArabic;
