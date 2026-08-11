// html-to-image ne peut pas lire les @font-face du document via `cssRules`
// pour la feuille Google Fonts (SecurityError, stylesheet cross-origin sans
// CORS explicite sur le <link>) — c'est pour ça qu'on lui passait
// `fontEmbedCSS: ''` (voir VictorySection.tsx), ce qui désactive TOUT
// embarquement de police et fait retomber le PNG exporté sur une police
// système par défaut, y compris pour Clash Display qui n'a pourtant aucun
// souci de CORS. `fetch()` n'est pas soumis à cette restriction CSSOM : on
// récupère nous-mêmes les fichiers de police et on construit le CSS à
// embarquer, qu'on passe ensuite tel quel à `fontEmbedCSS`.

const URBANIST_CSS_URL = 'https://fonts.googleapis.com/css2?family=Urbanist:wght@800;900&display=swap';
const CLASH_DISPLAY_BOLD_URL = '/fonts/ClashDisplay-Bold.otf';

async function toBase64DataUri(url: string, mime: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return `data:${mime};base64,${btoa(binary)}`;
}

async function buildUrbanistFaces(): Promise<string> {
  const css = await fetch(URBANIST_CSS_URL).then((r) => r.text());
  // Un seul sous-ensemble unicode nous suffit : "latin" (U+0000-00FF) couvre
  // les accents français, pas besoin d'embarquer cyrillique/grec/etc.
  const latinBlockRegex = /\/\* latin \*\/\s*@font-face\s*{([^}]*)}/g;
  const faces: string[] = [];
  let block: RegExpExecArray | null;
  while ((block = latinBlockRegex.exec(css))) {
    const body = block[1];
    const weight = body.match(/font-weight:\s*(\d+)/)?.[1];
    const fontUrl = body.match(/url\(([^)]+)\)/)?.[1];
    if (!weight || !fontUrl) continue;
    const dataUri = await toBase64DataUri(fontUrl, 'font/woff2');
    faces.push(
      `@font-face { font-family: 'Urbanist'; font-style: normal; font-weight: ${weight}; src: url("${dataUri}") format('woff2'); }`,
    );
  }
  return faces.join('\n');
}

let cached: Promise<string> | null = null;

// Mémoïsé : les fichiers de police ne changent pas d'un partage à l'autre,
// pas besoin de refetch/reconvertir en base64 à chaque clic.
export function getShareCardFontEmbedCSS(): Promise<string> {
  if (!cached) {
    cached = Promise.all([toBase64DataUri(CLASH_DISPLAY_BOLD_URL, 'font/otf'), buildUrbanistFaces()]).then(
      ([clashDataUri, urbanistFaces]) =>
        `@font-face { font-family: 'Clash Display'; font-weight: 700; src: url("${clashDataUri}") format('opentype'); }\n${urbanistFaces}`,
    );
  }
  return cached;
}
