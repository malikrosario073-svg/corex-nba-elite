module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.BALLDONTLIE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "NBA API key is not configured"
    });
  }

  try {
    const response = await fetch(
      "https://api.balldontlie.io/v1/teams",
      {
        headers: {
          Authorization: apiKey
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "NBA data provider request failed"
      });
    }

    const result = await response.json();

    return res.status(200).json({
      source: "BALLDONTLIE",
      data: result.data
    });
  } catch (error) {
    return res.status(502).json({
      error: "Unable to retrieve NBA teams"
    });
  }
};
