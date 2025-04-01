const express = require("express");
const JobTitleController = require("../controllers/jobTitleController");
const jobTitleRouter = express.Router();

jobTitleRouter.post("/", JobTitleController.createJobTitle);
jobTitleRouter.get("/", JobTitleController.getAllJobTitles);
//jobTitleRouter.put("/:id", JobTitleController.updateJobTitle);
jobTitleRouter.delete("/:id", JobTitleController.deleteJobTitle);

module.exports = {jobTitleRouter};
