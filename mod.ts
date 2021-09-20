import { handlePage, handlePublic } from './lib/router.ts';

export default async function astronaut(req: Request) {
    const resPublic = await handlePublic(req);
    if (resPublic) {
        console.log('Found in public/');
        return resPublic;
    }
    const resPage = await handlePage(req);
    if (resPage) {
        console.log('Found in src/pages/');
        return resPage;
    }
    return new Response('404', {
        status: 404,
    })
}
