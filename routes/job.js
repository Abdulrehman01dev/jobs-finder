
const express = require('express');
const { getAllJobs, createJob, getJob, updateJob, deleteJob, getMyJobs } = require('../controllers/jobs');
const Router = express.Router();

Router.route('/').get(getAllJobs).post(createJob);
Router.route('/my-jobs').get(getMyJobs)
Router.route('/single-job/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = Router;

