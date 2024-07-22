export async function GET() {
    const randWords = ['Hello', 'World', 'TypeScript'];

    return new Response(randWords[Math.floor(Math.random() * randWords.length)]);
}
