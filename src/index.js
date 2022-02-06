require('dotenv').config({ path: '../.env' });
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const { initJobs } = require('./job-manager');


app.use('/', routes);

app.get('/', (req, res) => {
  res.json({ success: req.body });
});

const startService = async () => {
  const PORT = process.env.JOB_PORT || 5001;

  await initJobs();
  app.listen(PORT, () => {
    console.log(`🚀 dourou-jobs is running on port ${PORT}`);
  });
}

startService();
