# dpe-proxyexport default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { citycode } = req.query;

  const params = new URLSearchParams({
    size: '20',
    select: 'adresse_ban,etiquette_dpe,conso_5_usages_e_finale,annee_construction,surface_habitable_logement,type_batiment',
    sort: 'etiquette_dpe',
  });

  let qs = 'etiquette_dpe:(F OR G)';
  if (citycode) qs += ` AND code_insee_commune_actualise:${citycode}`;
  params.append('qs', qs);

  const url = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `ADEME error: ${response.status}`, detail: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
