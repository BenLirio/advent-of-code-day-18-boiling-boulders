import p5 from 'p5'

const WINDOW_PADDING = 20

const aspect_16_9 = (width: number) => ({ width, height: width * 9 / 16 })

export const getLargestSize = (p: p5) => [
    aspect_16_9(320),
    aspect_16_9(480),
    aspect_16_9(640),
    aspect_16_9(800),
    aspect_16_9(960),
    aspect_16_9(1024),
    aspect_16_9(1280),
    aspect_16_9(1366),
    aspect_16_9(1440),
    aspect_16_9(1600),
  ].reduce((acc, {width, height}) =>
    p.windowWidth > width + WINDOW_PADDING
    && p.windowHeight > height + WINDOW_PADDING
    ? { width, height }
    : acc
  , { width: 0, height: 0 })