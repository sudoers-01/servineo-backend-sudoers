export function getHealthStatusController(_req, res) {
  return res.status(200).json({
    health: "I'm alive",
    status: 200,
    message: 'ok',
  });
}
