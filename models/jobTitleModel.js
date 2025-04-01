const { pool } = require("../config/dbConfig");


const JobTitleModel = {
    create: (data, callback) => {
        const sql = "INSERT INTO jobtitle (job_title_id, job_title_name) VALUES (?, ?)";
        pool.query(sql, [data.job_title_id, data.job_title_name], callback);
    },

    getAll: (callback) => {
        const sql = "SELECT * FROM jobtitle";
        pool.query(sql, callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE jobtitle SET job_title_name = ? WHERE job_title_id = ?";
        pool.query(sql, [data.job_title_name, id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM jobtitle WHERE job_title_id = ?";
        pool.query(sql, [id], callback);
    },
};

module.exports = JobTitleModel;
