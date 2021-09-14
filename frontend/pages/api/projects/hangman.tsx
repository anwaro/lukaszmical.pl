import {NextApiHandler} from 'next';


const handler: NextApiHandler = async (_, res) => {
    const randWords = ['Hello', 'World', 'TypeScript'];
    res.status(200).json(randWords[Math.floor(Math.random() * randWords.length)]);
}

export default handler;
