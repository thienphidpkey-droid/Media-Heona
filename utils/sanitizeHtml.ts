/**
 * Utility: sanitizeHtml
 * Zero-dependency, isomorphic HTML sanitizer for user/CMS generated article content.
 * Prevents Stored XSS, script injection, javascript: URIs, inline event handlers (onload, onerror, onclick),
 * and unauthorized tags (<script>, <iframe>, <object>, <embed>, <form>, <base>, <svg> event handlers).
 */

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'blockquote', 'pre', 'code',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup',
  'a', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'figure', 'figcaption'
]);

const ALLOWED_ATTRS = new Set([
  'href', 'title', 'target', 'rel',
  'src', 'alt', 'width', 'height', 'loading',
  'class', 'id'
]);

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  // 1. Remove dangerous executable tags completely along with their inner content
  let clean = dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Strip inline event handlers (e.g. onerror=, onload=, onclick=, onmouseover=)
  clean = clean.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Strip javascript: or data: in href/src attributes (except data:image)
  clean = clean.replace(/\b(href|src)\s*=\s*["']?\s*(?:javascript|vbscript):[^"'>\s]*/gi, '$1="#"');
  clean = clean.replace(/\b(href)\s*=\s*["']?\s*data:[^"'>\s]*/gi, '$1="#"');

  // 4. If in browser environment with DOMParser available, perform structural element filtering
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(clean, 'text/html');
      
      const allElements = doc.body.querySelectorAll('*');
      allElements.forEach((el) => {
        const tagName = el.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tagName)) {
          el.remove();
          return;
        }

        // Filter attributes
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();
          if (!ALLOWED_ATTRS.has(attrName)) {
            el.removeAttribute(attr.name);
          } else if (attrName === 'href' || attrName === 'src') {
            const val = attr.value.trim().toLowerCase();
            if (val.startsWith('javascript:') || val.startsWith('vbscript:') || (attrName === 'href' && val.startsWith('data:'))) {
              el.removeAttribute(attr.name);
            }
          }
        }

        // Enforce rel="noopener noreferrer" on external target="_blank" links
        if (tagName === 'a' && el.getAttribute('target') === '_blank') {
          el.setAttribute('rel', 'noopener noreferrer');
        }
      });

      return doc.body.innerHTML;
    } catch {
      return clean;
    }
  }

  return clean;
}
