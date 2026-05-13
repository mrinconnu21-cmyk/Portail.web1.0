export const waitForImagesInElement = async (
  element: HTMLElement,
  timeout: number = 5000
): Promise<void> => {
  const images = element.querySelectorAll("img");
  const promises: Promise<void>[] = [];

  images.forEach((img) => {
    const promise = new Promise<void>((resolve) => {
      if (img.complete) {
        // Image already loaded
        resolve();
      } else {
        // Wait for image load
        const onLoad = () => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
          resolve();
        };

        const onError = () => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
          console.warn("Image failed to load:", img.src);
          resolve();
        };

        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);

        // Timeout fallback
        setTimeout(() => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
          resolve();
        }, timeout);
      }
    });

    promises.push(promise);
  });

  // Wait for all images
  if (promises.length > 0) {
    await Promise.all(promises);
  }
};
