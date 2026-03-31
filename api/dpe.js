export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { citycode } = req.query;

  const params = new URLSearchParams({
    size: '5',
    select: 'adresse_ban,etiquette_dpe,annee_construction,surface_habitable_logement',
  });

  let qs = 'etiquette_dpe:(F OR G)';
  if (citycode) qs += ` AND code_insee_ban:${citycode}`;
  params.append('qs', qs);

  const url = `https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const text = await response.text();

    return res.status(200).json({
      status: response.status,
      ok: response.ok,
      url: url,
      body: text.substring(0, 500)
    });

  } catch (error) {
    return res.status(200).json({
      caught: true,
      message: error.message,
      url: url
    });
  }
}
