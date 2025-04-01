const DataModel = require('../models/enumModle');

const getJobTitles = async (req, res) => {
  try {
    const result = await DataModel.getJobTitles();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch job titles' });
  }
};

const getPayGrades = async (req, res) => {
  try {
    const result = await DataModel.getPayGrades();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pay grades' });
  }
};

const getSupervisors = async (req, res) => {
  try {
    const result = await DataModel.getSupervisors();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch supervisors' });
  }
};

const getDepartments = async (req, res) => {
  try {
    const result = await DataModel.getDepartments();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

const getBranches = async (req, res) => {
  try {
    const result = await DataModel.getBranches();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch branches' });
  }
};

module.exports = {
  getJobTitles,
  getPayGrades,
  getSupervisors,
  getDepartments,
  getBranches,
};
