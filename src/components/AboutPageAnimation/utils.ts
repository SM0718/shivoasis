// Preload images
const preloadFonts = (id: string): Promise<void> => {
    return new Promise((resolve) => {
        ((window as any).WebFont || (window as any).webfont).load({
            typekit: {
                id: id
            },
            active: resolve
        });
    });
};

export {
    preloadFonts
};

