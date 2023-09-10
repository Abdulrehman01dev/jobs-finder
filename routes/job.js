
const express = require('express');
const { getAllJobs, createJob, getJob, updateJob, deleteJob } = require('../controllers/jobs');
const Router = express.Router();

Router.route('/').get(getAllJobs).post(createJob);
Router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)


module.exports = Router;

