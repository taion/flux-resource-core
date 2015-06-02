export function stripTrailingSlash(url) {
  return url.replace(/\/$/, '');
}

export function mergeTrailingSlash(url) {
  return url.replace(/\/\/$/, '/');
}
