import dummyImg from '../assets/dummy.jpg'

/**
 * getImage(image)
 * Returns the image src for a product.
 * - If image is a full URL (http/https) → use it directly
 * - If image is null/undefined → fall back to dummy.jpg
 */
export function getImage(image) {
  if (!image) return dummyImg
  if (image.startsWith('http')) return image
  return dummyImg
}
