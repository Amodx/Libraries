type KeyFrames = PropertyIndexedKeyframes | Keyframe[];
type Options = number | KeyframeAnimationOptions | undefined;

const animateObject = {
  fadeIn: (element: HTMLElement, options: Options) =>
    animate(
      element,
      [
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
      ],
      options
    ),
  fadeOut: (element: HTMLElement, options: Options) =>
    animate(
      element,
      [
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
      ],
      options
    ),
};

export const animate = Object.assign(
  (element: HTMLElement, keyframes: KeyFrames, options?: Options) => {
    return new Promise((resolve) => {
      element.animate(keyframes, options).onfinish = () => resolve(true);
    });
  },
  animateObject
);
  