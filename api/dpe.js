export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, citycode } = req.query;

  if (!q && !citycode) {
    return res.status(400).json({ error: 'Paramètre manquant' });
  }

  const params = new URLSearchParams({
    size: 20,
    select: 'adresse_ban,etiquette_dpe,conso_5_usages_e_finale,annee_construction,surface_habitable_logement,type_batiment',
    sort: 'etiquette_dpe'
  });

  let qs = 'etiquette_dpe:(F OR G)';
  if (citycode) qs += ` AND code_insee_commune_actualise:${citycode}`;
  params.append('qs', qs);

  try {
    const response = await fetch(
      `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?${params.toString()}`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des données ADEME' });
  }
}
