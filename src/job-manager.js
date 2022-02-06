const CronJob = require('cron').CronJob;
const moment = require('moment');
const axios = require('axios');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

// object containing all cronjobs keyed by uiid
const CRONJOBS = {};


exports.initJobs = async () => {
  const now = moment();
  const jobs = await db.select('*').from('jobs').where('start_date', '>', now.format('YYYY-MM-DD HH:mm:ss'));
  if (!jobs.length) {
    console.info('💬 No jobs found to start');
    return;
  }
  console.info(`💬 start initializing ${jobs.length} job(s)`);
  for (const job of jobs) {
    await startJob(job);
  };
}

const startJob = async (job, save = false) => {
  const { auction_id, start_date } = job;
  const startDate = moment(start_date);

  if (save) {
    job.uiid = uuidv4();
    await db('jobs').insert({
    uiid: job.uiid,
      state_id: 2, // on:waiting
      type_id: 1, // auction-start
      auction_id,
      start_date,
    });
  }

  const cronjob = new CronJob(startDate, async () => {
    try {
      await axios.post(`${process.env.API_HOST}/auctions/start`, { auction_id });
    } catch (error) {
      console.error('Error in sending request');
      console.error(error);
    }
  });

  CRONJOBS[auction_id] = cronjob;
  CRONJOBS[auction_id].start();

  console.log(`🤖 Job [${job.uiid}] for auction ${auction_id} started and will be fired the ${startDate.format(`YYYY-MM-DD HH:mm:ss`)}`);
  return job.uiid;
}

exports.startJob = startJob;


const stopJob = async (auction_id) => {
  CRONJOBS[auction_id].stop();
  console.info(`🤖 Job for auction ${auction_id} is stopped!`);
}
exports.stopJob = stopJob;

const updateJob = async (auction_id, start_date) => {
  // stop the process and start another one!
  await stopJob(auction_id);
  await startJob({ auction_id, start_date });
  console.info(`🤖 Job for auction ${auction_id} is updated!`);
}
exports.updateJob = updateJob;
