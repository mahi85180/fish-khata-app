// fishkhata.pages.dev/dl/android  -> the latest app file, served from this site (customer never sees GitHub)
const TYPES = { apk: 'application/vnd.android.package-archive', exe: 'application/vnd.microsoft.portable-executable', dmg: 'application/x-apple-diskimage', AppImage: 'application/vnd.appimage', deb: 'application/vnd.debian.binary-package' };
export async function onRequest({ params }){
  const u = await (await fetch('https://raw.githubusercontent.com/mahi85180/fish-khata-app/main/update.json', { cf: { cacheTtl: 120 } })).json();
  const map = { android: u.android, windows: u.windows, portable: u.windowsPortable, macArm: u.macArm, macX64: u.macX64, linux: u.linux, linuxDeb: u.linuxDeb };
  const url = map[params.kind];
  if (!url) return new Response('Not found', { status: 404 });
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) return new Response('Download not available right now, please try again.', { status: 502 });
  const name = url.split('/').pop(), ext = name.split('.').pop();
  const h = new Headers({ 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Content-Disposition': 'attachment; filename="' + name + '"', 'Cache-Control': 'no-store' });
  const len = r.headers.get('content-length'); if (len) h.set('Content-Length', len);
  return new Response(r.body, { status: 200, headers: h });
}
