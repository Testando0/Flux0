export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

    const { prompt } = req.body;
    const apiKey = process.env.SILICONFLOW_API_KEY;

    try {
        const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "black-forest-labs/FLUX.1-schnell",
                prompt: prompt,
                size: "1024x1024" // Alterado de image_size para size
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Isso vai imprimir o erro real do SiliconFlow nos logs da Vercel
            console.error("Erro do SiliconFlow:", data);
            return res.status(response.status).json({ 
                error: data.error?.message || data.message || "Erro na API de Imagem" 
            });
        }

        return res.status(200).json({ url: data.data[0].url });

    } catch (error) {
        return res.status(500).json({ error: "Erro interno: " + error.message });
    }
}
