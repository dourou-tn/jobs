const router = require('express').Router()
const { startJob, stopJob, updateJob } = require('./job-manager');

router.post('/job/start', async (req, res) => {
  const { auction_id, start_date } = req.body;
  if (auction_id && start_date) {
    const jobUiid = await startJob({ auction_id, start_date }, true);
    res.status(200).json({ success: true, data: { job: jobUiid } });
  }
});

router.post('/job/stop', async (req, res) => {
  const { auction_id } = req.body;
  if (auction_id) {
    await stopJob(auction_id);
    return res.status(200).json({ success: true });
  }
});

router.post('/job/update', async (req, res) => {
  const { auction_id, start_date } = req.body;

  if (auction_id && start_date) {
    await updateJob(auction_id, start_date);
    return res.status(200).json({ success: true });
  }
});

module.exports = router;
