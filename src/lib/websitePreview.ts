export function getWebsitePreviewImageUrl(url: string, width = 1200) {
  // Use a screenshot image endpoint as a fallback.
  // NOTE: For best quality, prefer local screenshots in /public/previews and pass `previewSrc`.
  // thum.io returns an image directly (often higher quality than mShots).
  return `https://image.thum.io/get/width/${width}/noanimate/${url}`
}

export function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

