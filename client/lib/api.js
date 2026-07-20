const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function upload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload`, {
        credentials: "include",
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
}

export async function publish(data, coverImageUrl) {
    data.coverImage = coverImageUrl;
    try {
        const res = await fetch(`${API_URL}/api/article/create`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ content: data.content, data: data }),
        });
        const json = await res.json();
        if (res.status !== 200) {
            return {
                success: false,
                errors: { apiError: json.error || "حدث خطأ أثناء نشر المقال" },
            };
        }
        return { success: true, slug: json.slug };
    } catch {
        return { success: false, errors: { apiError: "تعذر الاتصال بالخادم" } };
    }
}
