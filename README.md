# dourou-jobs
> Manage in memory jobs and expose jobs api.

* dependencies: knex, mysql, express, dotenv, cors

When first start:
* always wake up
  * get all jobs from db and start them.
  * manage job in memory with { auction_id, uiid }

* expose an api to: 
  * [POST] /job/start: called when auction is created
  * [POST] /job/stop: called when auction is finished
  * [POST] /job/update: called when auction is updated (start_date);
