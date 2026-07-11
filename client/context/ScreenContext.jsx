"use client";

import { useState, useEffect, createContext } from "react";

export const WidthContext = createContext(1200);

export default function ScreenProvider({ children }) {
    const [width, setWidth] = useState(1200);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize, { passive: true });
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <WidthContext.Provider value={width}>{children}</WidthContext.Provider>
    );
}
