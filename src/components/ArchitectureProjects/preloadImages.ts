// @ts-expect-error imagesloaded does not provide TypeScript declarations.
import imagesLoaded from "imagesloaded";

export const preloadImages = (selector: string = "img"): Promise<void> => {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll(selector);

    if (!elements.length) {
      resolve();
      return;
    }

    imagesLoaded(
      elements,
      {
        background: true,
      },
      () => {
        resolve();
      },
    );
  });
};
