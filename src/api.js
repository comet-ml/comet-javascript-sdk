// -*- mode: js; js-indent-level: 2; -*-

import get from 'lodash/get';
import {
  getRequest,
  getRequestRaw,
  getRequestBinary,
  postRequest
} from './utils/requestUtils';
import { config } from './config';

const parseJSON = data => {
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

// Default-exported at the end of the file, so jsdoc documents its methods
// as members of API (see scripts/build-docs.js).
class API {
  /**
   * summary Comet Javascript SDK
   * @name API
   * @class
   * @public
   *
   * See also:
   *     * [Getting Started with Comet Panels](../../javascript-sdk/getting-started/)
   *     * [Comet Panels User Interface](../../user-interface/panels/)
   *
   *
   * Creates the class to communicate to the Comet REST API.
   *
   * The credential can be a user's API key, or a project token. Comet
   * JavaScript panels are given a project token, which can only read the
   * panel's own project and its experiments. Methods that list across
   * workspaces or act as the user (workspaces(), projects(), get() with
   * fewer than two names, accountDetails(), experimentStop()) need a
   * user API key and are rejected with a project token.
   *
   * @param {string} apiKey a Comet API key, or a project token
   * @param {string} [projectId] the project id (set by panels)
   * @param {string} [instanceId] the panel instance id (set by panels)
   * @param {string} [version='v2'] the REST API version
   * @returns {API} API instance
   *
   */
  constructor(
    apiKey,
    projectId = 'inject-later-on',
    instanceId = 'inject-later-on',
    version = config.defaultVersion
  ) {
    this.projectId = projectId;
    this.instanceId = instanceId;
    this.apiKey = apiKey;
    this.version = version;
    this.localStore = null;
    this.localStorePromise = null;
  }

  /**
   * @summary Returns the REST version string for this API instance.
   * @method
   * @public
   *
   * @returns {string} the version string
   *
   * @example
   *
   * > api.getVersion()
   * "v2"
   */
  getVersion() {
    return this.version;
  }

  getRequest(endPoint, params = {}) {
    const { version, apiKey } = this;

    return getRequest({ endPoint, params, version, apiKey });
  }

  getRequestRaw(endPoint, params = {}) {
    const { version, apiKey } = this;

    return getRequestRaw({ endPoint, params, version, apiKey });
  }

  getRequestBinary(endPoint, params = {}) {
    const { version, apiKey } = this;

    return getRequestBinary({ endPoint, params, version, apiKey });
  }

  postRequest(endPoint, params = {}) {
    const { version, apiKey } = this;

    return postRequest({ endPoint, params, version, apiKey });
  }

  /**
   * Returns the URL for the experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {string} the url
   *
   */

  experimentURL(experimentKey) {
    return `${config.url}api/experiment/redirect?experimentKey=${experimentKey}`;
  }

  /**
   * Returns a Promise for the metadata for the given experimentKey.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of an object of metadata
   *
   * @example
   *
   * > api.experimentMetadata('7387462874624747').then(result => {
   *     console.log(result);
   *   });
   *
   * {'archived': false,
   *  'durationMillis': 72,
   *  'endTimeMillis': 1572435457349,
   *  'experimentKey': "5a67221477dc5d76b37d10adbe41486d",
   *  'experimentName': null,
   *  'fileName': "train.py",
   *  'filePath': "/home/user/train.py",
   *  'hasCrashed': false,
   *  'optimizationId': null,
   *  'projectId': "0306c896110140a2aaa24e54dbb40e6b",
   *  'projectName': "my-project-name",
   *  'running': false,
   *  'startTimeMillis': 1572435384908,
   *  'throttle': false,
   *  'userName': "username",
   *  'workspaceName': "myworkspace"
   * }
   */
  experimentMetadata(experimentKey) {
    const endPoint = 'experiment/metadata';
    const params = { experimentKey };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for the list of tags for the given experimentKey.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of an object of a list of tags
   *
   * @example
   *
   * > api.experimentTags('7387462874624747').then(result => {
   *     console.log(result);
   *   });
   *
   * ['tag1', 'tag2', ...]
   *
   */
  experimentTags(experimentKey) {
    const endPoint = 'experiment/tags';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.tags;
    });
  }

  /**
   * Returns a Promise for the display color of the given experimentKey.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of a color string
   *
   * @example
   *
   * > api.experimentColor('7387462874624747').then(result => {
   *     console.log(result);
   *   });
   *
   * '#5899da'
   *
   */
  experimentColor(experimentKey) {
    const endPoint = 'experiment/color';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.color;
    });
  }

  /**
   * Returns a Promise for the git metadata of the given experimentKey.
   * Requires write access to the experiment.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of an object of git metadata
   *
   * @example
   *
   * > api.experimentGitMetadata('7387462874624747').then(result => {
   *     console.log(result);
   *   });
   *
   * {'user': "username",
   *  'root': "/home/user/project",
   *  'branch': "refs/heads/main",
   *  'parent': "3fca1d1c63e8b4d6c3f5b2b7c2a1e0f9d8c7b6a5",
   *  'origin': "git@github.com:user/project.git"
   * }
   */
  experimentGitMetadata(experimentKey) {
    const endPoint = 'experiment/git/metadata';
    const params = { experimentKey };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for the git patch (a zip file, as an ArrayBuffer)
   * of the given experimentKey. Requires write access to the experiment.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of an ArrayBuffer
   *
   * @example
   *
   * > api.experimentGitPatch('7387462874624747').then(result => {
   *     console.log(result.byteLength);
   *   });
   *
   * 1024
   */
  experimentGitPatch(experimentKey) {
    const endPoint = 'experiment/git/patch';
    const params = { experimentKey };

    return this.getRequestBinary(endPoint, params);
  }

  /**
   * Returns a Promise for the cloud provider details (e.g. AWS, GCP)
   * of the given experimentKey.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of an object of cloud details
   *
   * @example
   *
   * > api.experimentCloudDetails('7387462874624747').then(result => {
   *     console.log(result);
   *   });
   *
   * {'experimentKey': "7387462874624747",
   *  'provider': "AWS",
   *  'metadata': {...}
   * }
   */
  experimentCloudDetails(experimentKey) {
    const endPoint = 'experiment/cloud-details';
    const params = { experimentKey };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for an Array of models logged with the given
   * experimentKey.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @returns {Promise} Promise of an Array of model objects
   *
   * @example
   *
   * > api.experimentModels('7387462874624747').then(result => {
   *     console.log(result);
   *   });
   *
   * [{'experimentModelId': "4fd3a2...",
   *   'experimentKey': "7387462874624747",
   *   'modelName': "my-model",
   *   'registryRecords': [...]
   * }]
   */
  experimentModels(experimentKey) {
    const endPoint = 'experiment/model';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.models;
    });
  }

  /**
   * Returns a Promise for an Array of the asset JSON objects that make
   * up the given logged model.
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @param {string} modelName the name of the logged model
   * @param {Array} [tags=undefined] only return assets having all of
   * these tags
   * @returns {Promise} Promise of an Array of asset objects (same
   * format as experimentAssets())
   *
   * @example
   *
   * > api.experimentModelAssets('7387462874624747', 'my-model').then(result => {
   *     console.log(result);
   *   });
   *
   * [{"assetId": "ASSET-ID", "fileName": "model.pkl", "type": "model-element", ...}]
   */
  experimentModelAssets(experimentKey, modelName, tags) {
    const endPoint = 'experiment/model/asset/list';
    const params = { experimentKey, modelName, tags };

    return this.getRequest(endPoint, params).then(response => {
      return response.assets;
    });
  }

  /**
   * Returns a Promise for an Array of artifact versions that the
   * given experimentKey logged (output) and/or used (input).
   * @method
   * @public
   *
   * @param {string} experimentKey
   * @param {string} [filter='all'] one of 'all', 'input', or 'output'
   * @returns {Promise} Promise of an Array of artifact version objects
   *
   * @example
   *
   * > api.experimentArtifacts('7387462874624747', 'output').then(result => {
   *     console.log(result);
   *   });
   *
   * [{'artifactId': "...", 'artifactName': "dataset", 'version': "1.0.0", ...}]
   */
  experimentArtifacts(experimentKey, filter = 'all') {
    const endPoint = 'get/artifacts';
    const params = { experimentKey, filter };

    return this.getRequest(endPoint, params).then(response => {
      return response.artifactVersions;
    });
  }

  /**
   * Returns a Promise for the account details of the current Comet
   * user (the owner of the API key).
   *
   * Requires a user API key; not available with a project token
   * (JavaScript panels).
   *
   * @method
   * @public
   *
   * @returns {Promise} Promise of an object of account details
   *
   * @example
   *
   * > api.accountDetails().then(result => {
   *     console.log(result);
   *   });
   *
   * {'userName': "username", 'defaultWorkspaceName': "workspace1"}
   *
   */
  accountDetails() {
    return this.getRequest('account-details');
  }

  /**
   * Returns a Promise for an array of workspace names for the current Comet user.
   *
   * Requires a user API key; not available with a project token
   * (JavaScript panels).
   *
   * @method
   * @public
   *
   * @returns {Promise} the Promise of an array of string names
   *
   * @example
   *
   * > api.workspaces().then(result => {
   *     console.log(result);
   *   });
   *
   * ['workspace1', 'workspace2', 'workspace3']
   *
   */
  workspaces() {
    return this.getRequest('workspaces').then(response => {
      return response.workspaceNames;
    });
  }

  /**
   * Returns a Promise for an array of project JSON objects for the
   * given workspace.
   *
   * Requires a user API key; not available with a project token
   * (JavaScript panels).
   *
   * @method
   * @public
   *
   * @param {string} workspace the name of the workspace
   * @returns {Promise} an array of JSON project objects
   *
   * @example
   *
   * > api.projects('workspace').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "projectId": "NA",
   *   "projectName": "general",
   *   "projectDescription": "View all experiments that aren't assigned to a project.",
   *   "ownerUserName": "username",
   *   "workspaceId": "workspace ID",
   *   "workspaceName": "workspace name",
   *   "isPublic": false,
   *   "numberOfExperiments": 1,
   *   "lastUpdated": 1527183924215
   *  }
   * ]
   *
   */
  projects(workspaceName) {
    const endPoint = 'projects';
    const params = { workspaceName };

    return this.getRequest(endPoint, params).then(response => {
      return response.projects;
    });
  }

  /**
   * Returns a Promise for the string of project notes.
   *
   * @method
   * @public
   *
   * @param {string} projectId the name of the project
   * @returns {Promise} Promise of a string of notes in markdown
   *
   * @example
   *
   * > api.projectNotes(projectId).then(result => {
   *     console.log(result);
   *   });
   *
   * '# Heading\nMy notes.'
   */
  projectNotes(projectId) {
    const endPoint = 'project/notes';
    const params = { projectId };

    return this.getRequest(endPoint, params).then(response => {
      return response.notes;
    });
  }

  /**
   * Returns a Promise for the project metadata.
   *
   * @method
   * @public
   *
   * @param {string} projectId the name of the project
   * @returns {Promise} Promise of the project metadata
   *
   * @example
   *
   * > api.projectMetadata(projectId).then(result => {
   *     console.log(result);
   *   });
   *
   * {
   *  "public": true,
   *  "lastUpdated": 1587065944275,
   *  "numberOfExperiments": 5,
   *  "ownerUserName": "username",
   *  "projectDescription": "Project Description",
   *  "projectId": "aProjectId",
   *  "projectName": "Project Name",
   *  "workspaceName": "Name of the workspace"
   * }
   */
  projectMetadata(projectId) {
    const endPoint = 'project';
    const params = { projectId };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for the project metadata, looked up by
   * workspace and project name.
   *
   * @method
   * @public
   *
   * @param {string} workspaceName the name of the workspace
   * @param {string} projectName the name of the project
   * @returns {Promise} Promise of the project metadata
   *
   * @example
   *
   * > api.projectMetadataByName('workspace1', 'project1').then(result => {
   *     console.log(result);
   *   });
   *
   * {
   *  "public": false,
   *  "lastUpdated": 1587065944275,
   *  "numberOfExperiments": 5,
   *  "ownerUserName": "username",
   *  "projectDescription": "Project Description",
   *  "projectId": "aProjectId",
   *  "projectName": "project1",
   *  "workspaceName": "workspace1"
   * }
   */
  projectMetadataByName(workspaceName, projectName) {
    const endPoint = 'project';
    const params = { workspaceName, projectName };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for an array of the columns (metrics, parameters,
   * other, metadata, etc.) available in a project.
   *
   * @method
   * @public
   *
   * @param {string} projectId the project id
   * @returns {Promise} Promise of an array of column objects
   *
   * @example
   *
   * > api.projectColumns(projectId).then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {"name": "loss", "id": "loss_metrics", "type": "double",
   *   "source": "metrics", "kinds": ["last"]},
   *  ...
   * ]
   */
  projectColumns(projectId) {
    const endPoint = 'project/column-names';
    const params = { projectId };

    return this.getRequest(endPoint, params).then(response => {
      return response.columns;
    });
  }

  /**
   * Returns a Promise for an array of names or objects.
   *
   * get() and get(workspace) require a user API key; with a project
   * token (JavaScript panels) only get(workspace, project) and
   * get(workspace, project, experimentKey) work, for the panel's project.
   *
   * @method
   * @public
   *
   * @param {string} [workspace=undefined] the name of the "workspace",
   * "workspace/project", or "workspace/project/experiment".
   * @param {string} [project=undefined] the name of the project
   * @param {string} [experimentKey=undefined] the experiment key
   * @returns {Promise} an array of workspace names, project objects, or
   * (active) experiment keys; or, given an experiment key, that
   * experiment's metadata (archived or not), or undefined if it is not
   * in the given project.
   *
   * @example
   *
   * > api.get().then(result => {
   *     console.log(result);
   *   });
   *
   * ['general', 'workspace1']
   *
   * > api.get('workspace1').then(result => {
   *     console.log(result);
   *   });
   *
   * [{"lastUpdated": 1572435457347,
   *   numberOfExperiments: 1,
   *   ownerUserName: "user",
   *   projectDescription: "Project Description",
   *   projectId: "0306c897310140a1aaa24ea4343430e6b",
   *   projectName: "project1",
   *   public: false,
   *   workspaceName: "user",
   *  }]
   *
   * > api.get('workspace1/project1').then(result => {
   *     console.log(result);
   *   });
   *
   * ["4d51ea0c5ebb48eea3465f3ad0ba12b3", "dfae44c27ebe41ef9231fc35eae137e8", ...]
   *
   * > api.get('workspace1/project1/4d51ea0c5ebb48eea3465f3ad0ba12b3').then(result => {
   *     console.log(result);
   *   });
   *
   *  {
   *   "durationMillis": 0,
   *   "startTimeMillis": 1527184671290,
   *   "endTimeMillis": 1527184671290,
   *   "experimentKey": "4d51ea0c5ebb48eea3465f3ad0ba12b3",
   *   "experimentName": "someExperimentName",
   *   "optimizationId": "someOptimizationId",
   *   "archived": false,
   *   "projectName": "project1",
   *   "projectId": "someProjectId",
   *   "workspaceName": "workspace1",
   *  }
   *
   */
  get(workspace, project, experimentKey) {
    if (typeof workspace === 'undefined') {
      // get() -> workspace names
      return this.workspaces();
    }

    if (workspace.includes('/')) {
      const parts = workspace.split('/');

      if (parts.length > 3) {
        return Promise.reject(new Error('too many slashes in API.get()'));
      }

      [workspace, project, experimentKey] = parts;
    }

    // at least a workspace
    if (typeof project === 'undefined') {
      // get(workspace)
      return this.projects(workspace);
    }

    if (typeof experimentKey === 'undefined') {
      // get experiments from project
      // get(workspace, project)
      return this.experimentsByProjectName(workspace, project).then(
        experiments => {
          return experiments.map(d => d.experimentKey);
        }
      );
    }

    // get(workspace, project, experimentKey): fetch just this experiment
    // (archived or not), and only return it if it is in that project.
    // Names are compared ignoring case, as the server looks them up.
    const same = (a = '', b = '') => a.toLowerCase() === b.toLowerCase();

    return this.experimentMetadata(experimentKey).then(experiment => {
      if (
        same(experiment.workspaceName, workspace) &&
        same(experiment.projectName, project)
      ) {
        return experiment;
      }

      return undefined;
    });
  }

  /**
   * Returns a Promise for an array of experiment JSON objects.
   *
   * @method
   * @public
   *
   * @param {string} workspace the name of the workspace
   * @param {string} project the name of the project
   * @param {boolean} [archived=false] if true, return archived
   * experiments instead of active ones
   * @returns {Promise} an array of experiment JSON objects
   *
   * @example
   *
   * > api.experimentsByProjectName('workspace1', 'project1').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "durationMillis": 0,
   *   "startTimeMillis": 1527184671290,
   *   "endTimeMillis": 1527184671290,
   *   "experimentKey": "someExperimentKey",
   *   "experimentName": "someExperimentName",
   *   "optimizationId": "someOptimizationId",
   *   "archived": false,
   *   "projectName": "someProjectName",
   *   "projectId": "someProjectId",
   *   "workspaceName": "someWorkspaceName",
   *  }
   * ]
   *
   */
  experimentsByProjectName(workspace, projectName, archived = false) {
    if (!workspace) {
      return Promise.reject(new Error('A workspace name is required'));
    }

    if (!projectName) {
      return Promise.reject(new Error('A project name is required'));
    }

    const params = { workspaceName: workspace, projectName, archived };

    // The server answers 404 for an unknown workspace or project.
    return this.experimentsRequest(params).catch(error => {
      if (error.status === 404) {
        const notFound = new Error(
          `No such project named ${projectName} in workspace ${workspace}`
        );
        notFound.status = error.status;
        throw notFound;
      }

      throw error;
    });
  }

  /**
   * Returns a Promise for an array of experiment JSON objects given a project id.
   *
   * @method
   * @public
   *
   * @param {string} projectId the name of the project
   * @param {boolean} [archived=false] if true, return archived
   * experiments instead of active ones
   * @returns {Promise} an array of experiment JSON objects
   *
   * @example
   *
   * > api.experimentsByProjectId('project-uuid').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "durationMillis": 0,
   *   "startTimeMillis": 1527184671290,
   *   "endTimeMillis": 1527184671290,
   *   "experimentKey": "someExperimentKey",
   *   "experimentName": "someExperimentName",
   *   "optimizationId": "someOptimizationId",
   *   "archived": false,
   *   "projectName": "someProjectName",
   *   "projectId": "someProjectId",
   *   "workspaceName": "someWorkspaceName",
   *  }
   * ]
   *
   */
  experimentsByProjectId(projectId, archived = false) {
    return this.experimentsRequest({ projectId, archived });
  }

  experimentsRequest(params) {
    return this.getRequest('experiments', params).then(response => {
      return response.experiments;
    });
  }

  /**
   * Returns a Promise for the HTML associated with the experiment or null.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} the HTML string of the experiment or
   * null if there is no HTML.
   *
   * @example
   *
   * > api.experimentHtml('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * '<b>The HTML</b>'
   *
   */
  experimentHtml(experimentKey) {
    const endPoint = 'experiment/html';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.html;
    });
  }

  /**
   * Returns a Promise for the source code associated with the experiment or null.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} the source code as a string of the
   * experiment or null if there is no source code.
   *
   * @example
   *
   * > api.experimentCode('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * 'print("The Source Code")'
   *
   */
  experimentCode(experimentKey) {
    const endPoint = 'experiment/code';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.code;
    });
  }

  /**
   * Returns a Promise for the standard output associated with the experiment or null.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} the output as a string of the
   * experiment or null if there is no output.
   *
   * @example
   *
   * > api.experimentOutput('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * 'The Output of the Program'
   *
   */
  experimentOutput(experimentKey) {
    const endPoint = 'experiment/output';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.output;
    });
  }

  /**
   * Returns a Promise for an Array of installed packages associated with the experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} an Array of Python packages in "package=version" format.
   *
   * @example
   *
   * > api.experimentInstalledPackages('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * ['pip=19.01', 'comet=1.0.28']
   *
   */
  experimentInstalledPackages(experimentKey) {
    const endPoint = 'experiment/system-details';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.installedPackages;
    });
  }

  /**
   * Returns a Promise for an Object of JSON system details associated with the experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} an Object of JSON system details.
   *
   * @example
   *
   * > api.experimentSystemDetails('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * {command: ["/usr/local/bin/pytest", ...],
   *  executable: "/usr/local/bin/python",
   *  experimentKey: "4d51ea0c5ebb48eea3465f3ad0ba12b3",
   *  gpuStaticInfoList: [],
   *  hostname: "b94cd9a8ee38",
   *  installedPackages: ["atomicwrites==1.3.0", ...],
   *  ip: "172.19.0.5",
   *  logAdditionalSystemInfoList: [],
   *  maxTotalMemory: null,
   *  networkInterfaceIps: (2) ["127.0.0.1", "172.19.0.5"],
   *  os: "Linux-4.15.0-1057-oem-x86_64-with-debian-10.1",
   *  osPackages: [],
   *  osType: "Linux",
   *  pid: 6,
   *  pythonVersion: "3.6.9",
   *  pythonVersionVerbose: "3.6.9 (default, Sep 12 2019, 16:23:48) \n[GCC 8.3.0]",
   *  systemMetricNames: ["sys.cpu.percent.01", ...],
   *  totalRam: null,
   *  user: "root",
   * }
   */
  experimentSystemDetails(experimentKey) {
    const endPoint = 'experiment/system-details';
    const params = { experimentKey };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for the graph associated with the experiment's model, or null.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} the graph as a string of the
   * experiment's model or null if there is no graph.
   *
   * @example
   *
   * > api.experimentGraph('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * 'Network()'
   *
   */
  experimentGraph(experimentKey) {
    const endPoint = 'experiment/graph';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.graph;
    });
  }

  /**
   * Returns a Promise for an Array of image JSON objects associated with the
   * experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} array of JSON image objects
   *
   * @example
   *
   * > api.experimentImages('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "apiKey": "someApiKey",
   *   "runId": "someRunId0123456789012345",
   *   "experimentKey": "someExperimentKey",
   *   "projectId": null,
   *   "figCounter": 123,
   *   "figName": "imageName",
   *   "step": 12312,
   *   "runContext": "contextA",
   *   "fileName": "file.py",
   *   "imagePath": "https://comet-ml.nyc3.digitaloceanspaces.com/file.py"
   *  }
   * ]
   *
   */
  experimentImages(experimentKey) {
    const endPoint = 'experiment/asset/list';
    const params = { experimentKey, type: 'image' };

    return this.getRequest(endPoint, params).then(response => {
      return response.assets;
    });
  }

  /**
   * If no parameter name is given, then it returns a Promise of an
   * Array of parameter JSON objects associated with the
   * experiment. If a parameter name is given, then it returns a
   * Promise of the valueCurrent of the parameter.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} [name=undefined] the name of the parameter
   * @returns {Promise} array of JSON parameter objects or
   * value of given parameter name
   *
   * @example
   *
   * > api.experimentParameters('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "name": "nameA",
   *   "valueMax": "valueA",
   *   "valueMin": "valueA",
   *   "valueCurrent": "valueA",
   *   "timestampMax": 1527266735622,
   *   "timestampMin": 1527266735622,
   *   "timestampCurrent": 1527266735622,
   *   "runContextMax": "",
   *   "runContextMin": "",
   *   "runContextCurrent": "",
   *   "stepMax": null,
   *   "stepMin": null,
   *   "stepCurrent": null
   *  },
   *  {
   *   "name": "nameB",
   *   "valueMax": "valueB",
   *   "valueMin": "valueB",
   *   "valueCurrent": "valueB",
   *   "timestampMax": 1538888303,
   *   "timestampMin": 1538888303,
   *   "timestampCurrent": 1538888303,
   *   "runContextMax": "",
   *   "runContextMin": "",
   *   "runContextCurrent": "",
   *   "stepMax": null,
   *   "stepMin": null,
   *   "stepCurrent": null
   *  }
   * ]
   *
   * > api.experimentParameters('experimentKey1', 'nameA').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "name": "nameA",
   *   "valueMax": "valueA",
   *   "valueMin": "valueA",
   *   "valueCurrent": "valueA",
   *   "timestampMax": 1527266735622,
   *   "timestampMin": 1527266735622,
   *   "timestampCurrent": 1527266735622,
   *   "runContextMax": "",
   *   "runContextMin": "",
   *   "runContextCurrent": "",
   *   "stepMax": null,
   *   "stepMin": null,
   *   "stepCurrent": null
   *  }
   * ]
   *
   */
  experimentParameters(experimentKey, name) {
    const endPoint = 'experiment/parameters';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      if (typeof name === 'undefined') {
        return response.values;
      }

      return response.values.find(p => p.name === name);
    });
  }

  /**
   * Returns a Promise for a JSON object that has the summary data of the
   * given metric, or a list of the JSON objects for each metric
   * if no metricName is given.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} [metricName=undefined] the name of the metric
   * @returns {Promise} JSON metric object, or Array of
   *
   * @example
   *
   * > api.experimentMetricsSummary('experimentKey1', 'someNameA').then(result => {
   *     console.log(result);
   *   });
   *
   * {
   *   "name": "someNameA",
   *   "valueMax": "1.123",
   *   "valueMin": "1.123",
   *   "valueCurrent": "1.123",
   *   "timestampMax": 1527266664729,
   *   "timestampMin": 1527266664729,
   *   "timestampCurrent": 1527266664729,
   *   "runContextMax": null,
   *   "runContextMin": null,
   *   "runContextCurrent": null,
   *   "stepMax": null,
   *   "stepMin": null,
   *   "stepCurrent": null
   * }
   *
   * > api.experimentMetricsSummary('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "name": "someNameA",
   *   "valueMax": "1.123",
   *   "valueMin": "1.123",
   *   "valueCurrent": "1.123",
   *   "timestampMax": 1527266664729,
   *   "timestampMin": 1527266664729,
   *   "timestampCurrent": 1527266664729,
   *   "runContextMax": null,
   *   "runContextMin": null,
   *   "runContextCurrent": null,
   *   "stepMax": null,
   *   "stepMin": null,
   *   "stepCurrent": null
   *  },
   *  {
   *   "name": "someNameB",
   *   "valueMax": "42",
   *   "valueMin": "40",
   *   "valueCurrent": "41",
   *   "timestampMax": 1727266664729,
   *   "timestampMin": 1727266664729,
   *   "timestampCurrent": 1727266664729,
   *   "runContextMax": null,
   *   "runContextMin": null,
   *   "runContextCurrent": null,
   *   "stepMax": null,
   *   "stepMin": null,
   *   "stepCurrent": null
   *  }
   * ]
   */
  experimentMetricsSummary(experimentKey, metricName) {
    const endPoint = 'experiment/metrics/summary';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      const summaries = response.values;

      if (typeof metricName === 'undefined') {
        return summaries;
      }

      return summaries.find(summary => summary.name === metricName);
    });
  }

  /**
   * If no other name is given, then it returns a Promise of an Array
   * of all other JSON objects associated with the experiment. If a
   * name is given, then it returns a Promise of the JSON object of
   * given item. If a value is also given, then it will return a
   * Promise of the JSON field of that name.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} [other=undefined] the name of the logged item
   * @param {string} [value=undefined] the field of the JSON object
   * @returns {Promise} array of JSON logged other
   * items, or a single matching JSON object, or the field of that
   * JSON object.
   *
   * @example
   *
   * > api.experimentOther('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *    "name": "key",
   *    "valueMax": "value",
   *    "valueMin": "value",
   *    "valueCurrent": "value",
   *    "timestampMax": 1527266796121,
   *    "timestampMin": 1527266796121,
   *    "timestampCurrent": 1527266796121,
   *    "runContextMax": null,
   *    "runContextMin": null,
   *    "runContextCurrent": null,
   *    "stepMax": null,
   *    "stepMin": null,
   *    "stepCurrent": null
   *  }
   * ]
   *
   * > api.experimentOther('experimentKey1', 'key').then(result => {
   *     console.log(result);
   *   });
   *
   * {
   *    "name": "key",
   *    "valueMax": "value",
   *    "valueMin": "value",
   *    "valueCurrent": "value",
   *    "timestampMax": 1527266796121,
   *    "timestampMin": 1527266796121,
   *    "timestampCurrent": 1527266796121,
   *    "runContextMax": null,
   *    "runContextMin": null,
   *    "runContextCurrent": null,
   *    "stepMax": null,
   *    "stepMin": null,
   *    "stepCurrent": null
   * }
   *
   * > api.experimentOther('experimentKey1', 'key', 'valueMax').then(result => {
   *     console.log(result);
   *   });
   *
   * "value"
   *
   */
  experimentOther(experimentKey, other, value) {
    const endPoint = 'experiment/log-other';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      const results = response.values;

      if (typeof other === 'undefined') {
        return results;
      }

      const result = results.find(d => d.name === other);

      if (!result) {
        return null;
      }

      if (typeof value !== 'undefined') {
        return result[value];
      }

      return result.valueCurrent;
    });
  }

  /**
   * Returns a Promise for the name of this experiment (if one) or
   * key.  The return value is limited in length if maxLength
   * is given;
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {number} [maxLength] the maximum length of name or key
   * @returns {Promise} the name of the experiment key.
   *
   * @example
   *
   * > api.experimentName('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   * 'name given via experiment.set_name("name")'
   *
   * > api.experimentName('experimentKey1', 9)
   * 'name give'
   *
   * > api.experimentName('experimentKey1')
   * '09ce56129'
   *
   */
  experimentName(experimentKey, maxLength) {
    if (
      typeof window !== 'undefined' &&
      window.EXPERIMENT_NAMES &&
      typeof window.EXPERIMENT_NAMES[experimentKey] === 'string'
    ) {
      const name = window.EXPERIMENT_NAMES[experimentKey].substring(
        0,
        maxLength
      );
      return Promise.resolve(name);
    } else {
      return this.experimentMetadata(experimentKey).then(metadata => {
        if (metadata.experimentName) {
          return metadata.experimentName.substring(0, maxLength);
        }
        return experimentKey.substring(0, maxLength);
      });
    }
  }

  /**
   * Returns a Promise of an Array of all raw values logged for the
   * given metric name. Use experimentMetrics() to get all metrics.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} metricName the name of the metric
   * @returns {Promise} array of raw metric JSON objects
   *
   * @example
   *
   * > api.experimentMetric('experimentKey1', 'loss').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {
   *   "metricName": "loss",
   *   "metricValue": "0.41",
   *   "timestamp": 1527266664729,
   *   "step": 1,
   *   "epoch": 0,
   *   "runContext": null,
   *   "offset": 1
   *  },
   *  ...
   * ]
   *
   */
  experimentMetric(experimentKey, metricName) {
    const endPoint = 'experiment/metrics/get-metric';
    const params = { experimentKey, metricName };

    return this.getRequest(endPoint, params).then(response => {
      return response.metrics;
    });
  }

  /**
   * Returns a Promise of an Array of all raw metric values logged
   * with the experiment, for all metric names.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @returns {Promise} array of raw metric JSON objects
   *
   * @example
   *
   * > api.experimentMetrics('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * [
   *  {"metricName": "loss", "metricValue": "0.41", "step": 1, ...},
   *  {"metricName": "acc", "metricValue": "0.87", "step": 1, ...},
   *  ...
   * ]
   *
   */
  experimentMetrics(experimentKey) {
    const endPoint = 'experiment/metrics/get-all';
    const params = { experimentKey };

    return this.getRequest(endPoint, params).then(response => {
      return response.metrics;
    });
  }

  /**
   * Return a Promise of a set of metrics and/or parameters aligned on step values.
   *
   * @method
   * @public
   *
   * @param {Array} targetedExperiments - an array of experimentKeys
   * @param {Array} metrics - [metrics=[]] the names of the metrics
   * @param {Array} parameters - [parameters=[]] the names of the parameters
   * @param {boolean} independentMetrics - independent, whether to align all of the selection and ignore all but those that match, or get all
   * @param {boolean} fetchFull - full, whether to fetch all metrics (up to 15,000) or a sampled subset (about 500)
   *
   * @return {Promise}
   * @example
   *
   * > api.experimentMetricsForChart(['5a67221477dc4dc6b38d10adbe41486d']).then(result => {
   *     console.log(result);
   *   });
   *
   * {'5a67221477dc4dc6b38d10adbe41486d':
   *  {'empty': false,
   *   'epochs': null,
   *   'params': null,
   *   'steps': null,
   *   'experimentKey': "5a67221477dc4dc6b38d10adbe41486d",
   *   'metrics': [{'metricName': "acc", 'values': [], 'steps': [], 'epochs': [], 'timestamps': [], 'values': []}],
   *  }
   * }
   */
  experimentMetricsForChart(
    targetedExperiments,
    metrics = [],
    parameters = [],
    independentMetrics = true,
    fetchFull = false
  ) {
    const endPoint = 'experiments/multi-metric-chart';
    const params = {
      targetedExperiments,
      metrics,
      params: parameters,
      independentMetrics,
      fetchFull
    };

    return this.postRequest(endPoint, params).then(response => {
      return response.experiments;
    });
  }

  /**
   * Returns a Promise for an Array of asset JSON objects associated with the
   * experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} [type='all'] only return assets of this type
   * (e.g. 'image', 'audio', 'curve', 'model-element', 'asset')
   * @param {Array} [tags=undefined] only return assets having all of
   * these tags
   * @returns {Promise} array of JSON asset objects
   *
   * @example
   *
   * > api.experimentAssets('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * [{
   *  "assetId":"ASSET-ID",
   *  "audio":true,
   *  "canView":false,
   *  "compressedAssetLink":"https://www.comet.ml/api/asset/download?experimentKey=KEY&assetId=ASSET-ID&isCompressed=true",
   *  "createdAt":1590031167888,
   *  "curlDownload":"curl \"https://www.comet.ml/api/rest/v2/experiment/asset/get-asset?experimentKey=KEY&assetId=ASSET-ID\" -H\"Authorization: API-KEY\" > cat_22.wav"
   *  "dir":"audio",
   *  "fileName":"cat_22.wav",
   *  "fileSize":329644,
   *  "histogram":false,
   *  "image":false,
   *  "link":"https://www.comet.ml/api/asset/download?experimentKey=KEY&assetId=ASSET-ID&isCompressed=false",
   *  "metadata":null,
   *  "runContext":null,
   *  "step":null,
   *  "tags":[],
   *  "type":"audio",
   *  "video":false,
   * }, ...]
   *
   */
  experimentAssets(experimentKey, type = 'all', tags) {
    const endPoint = 'experiment/asset/list';
    const params = { experimentKey, type, tags };

    return this.getRequest(endPoint, params).then(response => {
      return response.assets;
    });
  }

  /**
   * Returns a Promise for the JSON details of a single asset
   * associated with the experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} assetId the asset id
   * @returns {Promise} JSON asset object (same format as an item of
   * experimentAssets())
   *
   * @example
   *
   * > api.experimentAssetDetails('experimentKey1', 'ASSET-ID').then(result => {
   *     console.log(result);
   *   });
   *
   * {"assetId": "ASSET-ID", "fileName": "cat_22.wav", "type": "audio", ...}
   *
   */
  experimentAssetDetails(experimentKey, assetId) {
    const endPoint = 'experiment/asset/details';
    const params = { experimentKey, assetId };

    return this.getRequest(endPoint, params);
  }

  /**
   * Returns a Promise for an asset associated with the experiment by its name. If
   * the asset is a JSON file, you can get the contents parsed as
   * JSON data.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} fileName the name of the asset
   * @param {string} [returnType='raw']  the type of data to return
   * @returns {Promise} the contents (binary (if Python 3 and returnType
   * === 'raw'), string (if Python 2 and returnType === 'raw'), or
   * JSON if returnType === 'json')
   *
   * @example
   *
   * > api.experimentAssetByName('experimentKey1', 'file.py').then(result => {
   *     console.log(result);
   *   });
   *
   * 'the contents of the asset as string (Python 2)'
   *
   * > api.experimentAssetByName('experimentKey1', 'file.py').then(result => {
   *     console.log(result);
   *   });
   *
   * b'the contents of the asset as binary (Python 3)'
   *
   * > api.experimentAssetByName('experimentKey1', 'file.json', 'json').then(result => {
   *     console.log(result);
   *   });
   *
   * {someName: "value of key", someOther: [1, 2, 3]}
   *
   * > api.experimentAssetByName('experimentKey1', 'file.data', 'json').then(result => {
   *     console.log(result);
   *   });
   *
   * [[1], [2], [3]]
   *
   */
  experimentAssetByName(experimentKey, fileName, returnType) {
    return this.experimentAssets(experimentKey).then(response => {
      const asset = response.find(a => a.fileName === fileName);

      if (!asset) {
        throw new Error(`No such asset found: ${fileName}`);
      }

      return this.experimentAsset(experimentKey, asset.assetId, returnType);
    });
  }

  /**
   * Returns a Promise for a list of curves logged with experiment.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   *
   * @example
   *
   * > api.experimentCurves('experimentKey1').then(curves => {
   *     console.log(curves);
   *   });
   *
   * [{x: [1, 2, 3], y: [4, 5, 6], name: "mycurve", step: 1}, ...]
   *
   */
  experimentCurves(experimentKey) {
    return this.experimentAssets(experimentKey, 'curve').then(assetList => {
      return Promise.all(
        assetList.map(asset => {
          return this.experimentAsset(
            experimentKey,
            asset.assetId,
            'json'
          ).then(curvesData => {
            return { ...asset, ...curvesData };
          });
        })
      );
    });
  }

  /**
   * Returns a Promise for an asset associated with the experiment by its id. If
   * the asset is a JSON file, you can get the contents parsed as
   * JSON data.
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   * @param {string} assetId the name of the asset
   * @param {string} [returnType='raw']  the type of data to return
   * @returns {Promise} the contents (binary (if Python 3 and returnType
   * === 'raw'), string (if Python 2 and returnType === 'raw'), or
   * JSON if returnType === 'json')
   *
   * @example
   *
   * > api.experimentAsset('experimentKey1', '6YZYszn9cO9mhDoYrfuQlDLcE').then(result => {
   *     console.log(result);
   *   });
   *
   * 'the contents of the asset as string (Python 2)'
   *
   * > api.experimentAsset('experimentKey1', '6YZYszn9cO9mhDoYrfuQlDLcE').then(result => {
   *     console.log(result);
   *   });
   *
   * b'the contents of the asset as binary (Python 3)'
   *
   * > api.experimentAsset('experimentKey1', '3873473463782746284762734', 'json').then(result => {
   *     console.log(result);
   *   });
   *
   * {someName: "value of key", someOther: [1, 2, 3]}
   *
   * > api.experimentAsset('experimentKey1', '9093487348374873487348731', 'json').then(result => {
   *     console.log(result);
   *   });
   *
   * [[1], [2], [3]]
   *
   */
  experimentAsset(experimentKey, assetId, returnType = 'raw') {
    const endPoint = 'experiment/asset/get-asset';
    const params = { experimentKey, assetId };

    if (returnType === 'raw') {
      return this.getRequestRaw(endPoint, params);
    }

    if (returnType === 'json') {
      return this.getRequestRaw(endPoint, params).then(response => {
        return JSON.parse(response);
      });
    }

    if (returnType === 'binary') {
      return this.getRequestBinary(endPoint, params);
    }

    return Promise.reject(
      new Error(
        "Invalid returnType in experimentAsset(); should be 'json', 'binary', or 'raw'/undefined"
      )
    );
  }

  /**
   * Given a key, value pair, save it locally, and send the whole
   * store to the backend. Returns a Promise for the result.
   *
   * @method
   * @public
   *
   * @param {string} key
   * @param {string} value
   *
   * @example
   *
   * > api.store("text", "This is the text").then(result => {
   *     console.log(result);
   *   });
   *
   * {"msg": "Stored"}
   *
   */
  store(key, value) {
    return this.getStore().then(() => {
      const { instanceId, localStore, projectId } = this;

      localStore[key] = value;

      const endPoint = 'write/viz-instance/store/save';
      const params = {
        instanceId,
        projectId,
        store: JSON.stringify(localStore)
      };

      return this.postRequest(endPoint, params);
    });
  }

  /**
   * Given a key, return a Promise for the value from the backend.
   *
   * @method
   * @public
   *
   * @param {string} key
   *
   * @example
   *
   * > api.getFromStore("text").then(result => {
   *     console.log(result);
   *   });
   *
   * "This is the text"
   *
   */
  getFromStore(key) {
    return this.getStore().then(store => {
      return get(store, key, null);
    });
  }

  /**
   * Return a Proimse for the store from the backend.
   *
   * @method
   * @public
   *
   * @example
   *
   * > api.getStore().then(result => {
   *     console.log(result);
   *   });
   *
   * {"store": "{...}"}
   *
   */
  getStore() {
    if (this.localStore !== null) {
      return Promise.resolve(this.localStore);
    }

    if (this.localStorePromise !== null) {
      return this.localStorePromise;
    }

    const endPoint = 'viz-instance/store/get';
    const { instanceId, projectId } = this;
    const params = { instanceId, projectId };

    this.localStorePromise = this.getRequest(endPoint, params).then(
      response => {
        this.localStore = parseJSON(response.store);

        return this.localStore;
      }
    );

    return this.localStorePromise;
  }

  /**
   * Given an experimentKey, return a Promise of the results to stop
   * the running experiment.
   *
   * Requires a user API key; not available with a project token
   * (JavaScript panels).
   *
   * @method
   * @public
   *
   * @param {string} experimentKey the experiment key
   *
   * @example
   *
   * > api.experimentStop('experimentKey1').then(result => {
   *     console.log(result);
   *   });
   *
   * {"msg": "Stop Requested"}
   *
   */
  experimentStop(experimentKey) {
    const endPoint = 'write/experiment/stop';
    const params = { experimentKey };

    return this.getRequest(endPoint, params);
  }
}

export default API;
