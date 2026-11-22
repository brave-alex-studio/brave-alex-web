import { BLOG_PATH } from '@/content.config'
import { slugifyStr } from './slugify'

function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, '')
      .split('/')
      .filter((path) => path !== '')
      .filter((path) => !path.startsWith('_'))
      .slice(0, -1)
      .map((segment) => slugifyStr(segment)) ?? []
  )
}

function getIdSlug(id: string): string {
  const postId = id.split('/')
  return postId.length > 0 ? String(postId[postId.length - 1]) : id
}

function getPostSlugPath(id: string, filePath: string | undefined): string {
  const pathSegments = getPostPathSegments(filePath)
  const slug = getIdSlug(id)
  return pathSegments.length > 0 ? [...pathSegments, slug].join('/') : String(slug)
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * No base prefix, no locale — Astro handles those at a higher level.
 * e.g. `/examples/my-post`
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath)}`
}

/**
 * Returns the post's URL for use in `<a href>` and RSS links.
 * e.g. `/notes/2026/my-post`
 */
export function getPostUrl(id: string, filePath: string | undefined): string {
  return `/notes/${getPostSlugPath(id, filePath)}`
}
