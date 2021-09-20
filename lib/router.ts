import { transform, compile } from 'https://deno.land/x/astro_compiler@v0.1.0-canary.44/mod.ts'
import { extname } from "https://deno.land/std@0.105.0/path/mod.ts";
import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts"

const exists = async (path: string|URL) => {
  try {
    await Deno.readFile(path);
    return true;
  } catch (_) {
    // Do nothing
  }
  return false;
}

export async function handlePublic(req: Request): Promise<Response|undefined> {
  const { pathname } = new URL(req.url);
  if (extname(pathname) !== '' && await exists(`./public/${pathname}`)) {
    const content = await Deno.readFile(`./public/${pathname}`);
    const contentType = mime.getType(extname(pathname).slice(1)) || 'text/plain';
    return new Response(content, {
      headers: {
        "content-type": contentType
      }
    })
  }
}

async function getPageHTML(req: Request): Promise<string|undefined> {
  let { pathname } = new URL(req.url);
  if (pathname.endsWith('/')) {
    pathname = pathname + 'index.astro'
  }
  if (extname(pathname) == '') {
    pathname = pathname + '.astro'
  }
  const fileURL = `./pages/${pathname}`;
  if (await exists(fileURL)) {
    try {
      const content = await Deno.readTextFile(fileURL);
      const template = await transform(content);
      console.log(template);
      return `<h1>Placeholder</h1>`;
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
