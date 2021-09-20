import astronaut from './mod.ts';

addEventListener("fetch", (event: Deno.RequestEvent) => {
    event.respondWith(astronaut(event.request, import.meta.url));
});
