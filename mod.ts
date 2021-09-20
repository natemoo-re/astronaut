import { handlePage, handlePublic } from './lib/router.ts';

export default async function astronaut(req: Request, base: string) {
    const baseURL = new URL(base);
    const resPublic = await handlePublic(req, baseURL);
    if (resPublic) return resPublic;
    const resPage = await handlePage(req, baseURL);
    if (resPage) return resPage;
    return new Response('404', {
        status: 404,
    })
}
