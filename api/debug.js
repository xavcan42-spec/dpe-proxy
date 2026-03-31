
const https = require('https');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { citycode } = req.query;

  const qs = citycode
    ? `etiquette_dpe:(F OR G) AND code_insee_ban:${citycode}`
    : 'etiquette_dpe:(F OR G)';

  const path = `/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines?size=5&qs=${encodeURIComponent(qs)}&select=adresse_ban,etiquette_dpe,annee_construction`;

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
        res.status(200).json({
          status: response.statusCode,
          body: data.substring(0, 800)
        });
        resolve();
      });
    });

    request.on('error', (error) => {
      res.status(200).json({ error: error.message });
      resolve();
    });

    request.end();
  });
}
