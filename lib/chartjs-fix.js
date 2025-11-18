// STOP TURBOPACK FROM TRANSFORMING CHART.JS COLORS (LAB ISSUE FIX)
if (typeof window !== "undefined") {
    const original = window.getComputedStyle;
    window.getComputedStyle = function(el) {
        const styles = original(el);
        return new Proxy(styles, {
            get(target, prop) {
                const value = target[prop];
                if (typeof value === "string" && value.startsWith("lab(")) {
                    return null; // <-- BLOCK LAB COLORS
                }
                return value;
            }
        });
    };
}