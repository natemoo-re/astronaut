import { transform, compile } from 'https://deno.land/x/astro_compiler@v0.1.0-canary.44/mod.ts'
import { exists } from "https://deno.land/std@0.105.0/fs/exists.ts";
import { extname } from "https://deno.land/std@0.105.0/path/mod.ts";
import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts"

export async function handlePublic(req: Request): Promise<Response|undefined> {
  const base = new URL(Deno.mainModule);
  const { pathname } = new URL(req.url);
  if (extname(pathname) !== '' && await exists(new URL(`./public/${pathname}`, base).toString())) {
    const content = await Deno.readFile(new URL(`./public/${pathname}`, base));
    const contentType = mime.getType(extname(pathname).slice(1)) || 'text/plain';
    return new Response(content, {
      headers: {
        "content-type": contentType
      }
    })
  }
}

async function getPageHTML(req: Request): Promise<string|undefined> {
  const base = new URL(Deno.mainModule);
  let { pathname } = new URL(req.url);
  if (pathname.endsWith('/')) {
    pathname = pathname + 'index.astro'
  }
  if (extname(pathname) == '') {
    pathname = pathname + '.astro'
  }
  const fileURL = new URL('./src/pages' + pathname, base);
  if (await exists(`./src/pages/${pathname}`)) {
    try {
      const content = await Deno.readTextFile(fileURL);
      const template = await transform(content);
      const html = await compile(template)
      return html;
    } catch (e) {
      return `<h1>Error!</h1><pre>${e}</pre>`
    }
  }
}

export async function handlePage(req: Request): Promise<Response|undefined> {
    const html = await getPageHTML(req);
    if (!html) return;
    return new Response(html, {
        headers: {
        "content-type": 'text/html; charset=UTF-8'
      }
    })
}
