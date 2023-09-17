
const express = require('express');
const { getAllJobs, createJob, getJob, updateJob, deleteJob, getMyJobs, upload, updateProfile } = require('../controllers/jobs');
const Router = express.Router();

Router.route('/').get(getAllJobs).post(createJob);
Router.route('/my-jobs').get(getMyJobs);
Router.route('/update-profile').post(upload, updateProfile);

Router.route('/single-job/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = Router;

