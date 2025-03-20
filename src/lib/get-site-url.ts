export function getSiteURL(): string {
  let url =
    process.env.NEXT_PUBLIC_API_BBASE_URL
  // Make sure to include `https://` when not localhost.
   url = `${url}`;
  // Make sure to include a trailing `/`.
  return url;
}
