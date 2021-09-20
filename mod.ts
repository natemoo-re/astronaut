import { handlePage, handlePublic } from './lib/router.ts';

export default async function astronaut(req: Request, base: string|URL = Deno.cwd()) {
    console.log(base);
    base = typeof base === 'string' ? new URL(base) : base;
    console.log(base);
    const resPublic = await handlePublic(req, base);
    if (resPublic) {
        console.log('Found in public/');
        return resPublic;
    }
    const resPage = await handlePage(req, base);
    if (resPage) {
        console.log('Found in src/pages/');
        return resPage;
    }
    return new Response('404', {
        status: 404,
    })
}
