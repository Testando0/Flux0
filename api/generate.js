export default async function handler(req, res) {
    // Permite que seu HTML converse com esse backend (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Responde rápido para pre-flight requests do navegador
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Apenas POST é permitido' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Chave de API não configurada no Vercel.' });
    }

    try {
        const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "black-forest-labs/FLUX.1-schnell", // O melhor modelo grátis
                prompt: prompt,
                image_size: "1024x1024",
                batch_size: 1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao gerar imagem');
        }

        // Retorna a URL da imagem
        return res.status(200).json({ url: data.data[0].url });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
