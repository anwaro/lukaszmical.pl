export async function GET() {
    const randWords = ['Hello', 'World', 'TypeScript'];

    return Response.json(randWords[Math.floor(Math.random() * randWords.length)]);
}
