const https = require('https');
 
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
 
  const { citycode } = req.query;
 
  const qs = citycode
    ? `etiquette_dpe:(F OR G) AND code_insee_ban:${citycode}`
    : 'etiquette_dpe:(F OR G)';
 
  const path = `/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines?size=20&qs=${encodeURIComponent(qs)}&select=adresse_ban,etiquette_dpe,conso_5_usages_ef,annee_construction,surface_habitable_logement,type_batiment&sort=etiquette_dpe`;
 
  return new Promise((resolve) => {
    const options = {
      hostname: 'data.ademe.fr',
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    };
 
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          res.status(200).json(json);
        } catch(e) {
          res.status(500).json({ error: 'Erreur parsing JSON', raw: data.substring(0, 200) });
        }
        resolve();
      });
    });
 
    request.on('error', (error) => {
      res.status(500).json({ error: error.message });
      resolve();
    });
 
    request.end();
  });
}
