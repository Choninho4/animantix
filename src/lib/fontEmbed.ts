// html-to-image ne peut pas lire les @font-face du document via `cssRules`
// pour la feuille Google Fonts (SecurityError, stylesheet cross-origin sans
// CORS explicite sur le <link>) — c'est pour ça qu'on lui passait
// `fontEmbedCSS: ''` (voir VictorySection.tsx), ce qui désactive TOUT
// embarquement de police et fait retomber le PNG exporté sur une police
// système par défaut, y compris pour Clash Display qui n'a pourtant aucun
// souci de CORS. `fetch()` n'est pas soumis à cette restriction CSSOM : on
// récupère nous-mêmes les fichiers de police et on construit le CSS à
// embarquer, qu'on passe ensuite tel quel à `fontEmbedCSS`.
//
// Piège observé : au tout premier clic sur "Partager" après un chargement de
// page à froid, l'image générée pouvait sortir vide (juste les fonds
// colorés, aucun texte) — le temps que ces fichiers soient fetchés/décodés
// une première fois par le moteur de rendu. `preloadShareCardFonts()` lance
// ce travail dès le montage de l'app (voir App.tsx) et enregistre les
// polices dans `document.fonts`, pour qu'au moment où l'utilisateur clique
// réellement, tout soit déjà chaud.

interface FontFaceSpec {
  family: string;
  weight: string;
  dataUri: string;
  format: string;
}

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

async function collectUrbanistFaces(): Promise<FontFaceSpec[]> {
  const css = await fetch(URBANIST_CSS_URL).then((r) => r.text());
  // Un seul sous-ensemble unicode nous suffit : "latin" (U+0000-00FF) couvre
  // les accents français, pas besoin d'embarquer cyrillique/grec/etc.
  const latinBlockRegex = /\/\* latin \*\/\s*@font-face\s*{([^}]*)}/g;
  const specs: FontFaceSpec[] = [];
  let block: RegExpExecArray | null;
  while ((block = latinBlockRegex.exec(css))) {
    const body = block[1];
    const weight = body.match(/font-weight:\s*(\d+)/)?.[1];
    const fontUrl = body.match(/url\(([^)]+)\)/)?.[1];
    if (!weight || !fontUrl) continue;
    const dataUri = await toBase64DataUri(fontUrl, 'font/woff2');
    specs.push({ family: 'Urbanist', weight, dataUri, format: 'woff2' });
  }
  return specs;
}

async function collectFontFaces(): Promise<FontFaceSpec[]> {
  const [clashDataUri, urbanistFaces] = await Promise.all([
    toBase64DataUri(CLASH_DISPLAY_BOLD_URL, 'font/otf'),
    collectUrbanistFaces(),
  ]);
  return [{ family: 'Clash Display', weight: '700', dataUri: clashDataUri, format: 'opentype' }, ...urbanistFaces];
}

function toCSS(specs: FontFaceSpec[]): string {
  return specs
    .map(
      (s) =>
        `@font-face { font-family: '${s.family}'; font-style: normal; font-weight: ${s.weight}; src: url("${s.dataUri}") format('${s.format}'); }`,
    )
    .join('\n');
}

// Enregistre les mêmes polices auprès du moteur de rendu (document.fonts) en
// plus de préparer le CSS à embarquer : décoder ces octets une première fois
// ici, avant que l'utilisateur ne clique sur "Partager", évite de refaire ce
// travail (potentiellement visible) pendant la capture elle-même.
async function registerWithDocumentFonts(specs: FontFaceSpec[]): Promise<void> {
  await Promise.all(
    specs.map(async (s) => {
      const face = new FontFace(s.family, `url(${s.dataUri}) format('${s.format}')`, { weight: s.weight });
      await face.load();
      document.fonts.add(face);
    }),
  );
}

let cached: Promise<string> | null = null;

function ensureLoaded(): Promise<string> {
  if (!cached) {
    cached = collectFontFaces().then(async (specs) => {
      await registerWithDocumentFonts(specs);
      return toCSS(specs);
    });
  }
  return cached;
}

// À appeler une fois, tôt (montage de l'app) : lance le fetch/décodage en
// tâche de fond sans bloquer le rendu initial.
export function preloadShareCardFonts(): void {
  void ensureLoaded();
}

// Mémoïsé : les fichiers de police ne changent pas d'un partage à l'autre,
// pas besoin de refetch/reconvertir en base64 à chaque clic.
export function getShareCardFontEmbedCSS(): Promise<string> {
  return ensureLoaded();
}
