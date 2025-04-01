const JobTitleModel = require("../models/jobTitleModel");
const { v4: uuidv4 } = require('uuid');

const JobTitleController = {
    createJobTitle: (req, res) => {
        const new_id = uuidv4();
        const data = { ...req.body, job_title_id: new_id };
        JobTitleModel.create(data, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Job title created successfully!" });
        });
    },

    getAllJobTitles: (req, res) => {
        JobTitleModel.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        });
    },

    updateJobTitle: (req, res) => {
        const { id } = req.params;
        JobTitleModel.update(id, req.body, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: "Job title updated successfully!" });
        });
    },

    deleteJobTitle: (req, res) => {
        const { id } = req.params;
        JobTitleModel.delete(id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: "Job title deleted successfully!" });
        });
    },
};

module.exports = JobTitleController;
