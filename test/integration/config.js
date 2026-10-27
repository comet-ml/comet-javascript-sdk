// Integration tests run against a live Comet server (comet.com by default),
// reading an experiment created by ./experiment.py. They are skipped until
// all the required settings below are set; see the README.
const env = typeof process !== 'undefined' ? process.env : {};

// The SDK appends paths directly, so the URL must end with a slash.
const url = (env.COMET_URL || 'https://www.comet.com/').replace(/\/?$/, '/');
const apiKey = env.COMET_API_KEY;
const workspaceName = env.COMET_TEST_WORKSPACE;
const projectName = env.COMET_TEST_PROJECT;
const projectId = env.COMET_TEST_PROJECT_ID;
const experimentKey = env.COMET_TEST_EXPERIMENT_KEY;

const required = {
  COMET_API_KEY: apiKey,
  COMET_TEST_WORKSPACE: workspaceName,
  COMET_TEST_PROJECT: projectName,
  COMET_TEST_PROJECT_ID: projectId,
  COMET_TEST_EXPERIMENT_KEY: experimentKey
};
const missing = Object.keys(required).filter(name => !required[name]);

// Optional: a project token for projectId, as JavaScript panels are given.
// Copy one from the browser (POST /api/token/projects) to test panel access.
const projectToken = env.COMET_PROJECT_TOKEN;

// Logged by ./experiment.py
const paramName = 'some_param';
const metricName = 'some_metric';
const tagName = 'Some Tag';
const projectNotes = 'Some Notes';
const jsonAssetName = 'asset.json';
const binaryAssetName = 'binary.bin';

export {
  apiKey,
  binaryAssetName,
  experimentKey,
  jsonAssetName,
  metricName,
  missing,
  paramName,
  projectId,
  projectName,
  projectNotes,
  projectToken,
  tagName,
  url,
  workspaceName
};
