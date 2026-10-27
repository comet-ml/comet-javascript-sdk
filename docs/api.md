# Comet Javascript SDK

This page documents the Comet JavaScript SDK.

See also:

* [Comet Panels User Interface](/docs/user-interface/panels/)
* [Getting Started with Comet Panels](/docs/javascript-sdk/getting-started/).

Note: almost all of the following methods return a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

<a name="API"></a>

## API
**Kind**: global class  
**Access**: public  

* [API](#API)
    * [new API(apiKey, [projectId], [instanceId], [version])](#new_API_new)
    * [.getVersion()](#API+getVersion) ⇒ <code>string</code>
    * [.experimentURL(experimentKey)](#API+experimentURL) ⇒ <code>string</code>
    * [.experimentMetadata(experimentKey)](#API+experimentMetadata) ⇒ <code>Promise</code>
    * [.experimentTags(experimentKey)](#API+experimentTags) ⇒ <code>Promise</code>
    * [.experimentColor(experimentKey)](#API+experimentColor) ⇒ <code>Promise</code>
    * [.experimentGitMetadata(experimentKey)](#API+experimentGitMetadata) ⇒ <code>Promise</code>
    * [.experimentGitPatch(experimentKey)](#API+experimentGitPatch) ⇒ <code>Promise</code>
    * [.experimentCloudDetails(experimentKey)](#API+experimentCloudDetails) ⇒ <code>Promise</code>
    * [.experimentModels(experimentKey)](#API+experimentModels) ⇒ <code>Promise</code>
    * [.experimentModelAssets(experimentKey, modelName, [tags])](#API+experimentModelAssets) ⇒ <code>Promise</code>
    * [.experimentArtifacts(experimentKey, [filter])](#API+experimentArtifacts) ⇒ <code>Promise</code>
    * [.accountDetails()](#API+accountDetails) ⇒ <code>Promise</code>
    * [.workspaces()](#API+workspaces) ⇒ <code>Promise</code>
    * [.projects(workspace)](#API+projects) ⇒ <code>Promise</code>
    * [.projectNotes(projectId)](#API+projectNotes) ⇒ <code>Promise</code>
    * [.projectMetadata(projectId)](#API+projectMetadata) ⇒ <code>Promise</code>
    * [.projectMetadataByName(workspaceName, projectName)](#API+projectMetadataByName) ⇒ <code>Promise</code>
    * [.projectColumns(projectId)](#API+projectColumns) ⇒ <code>Promise</code>
    * [.get([workspace], [project], [experimentKey])](#API+get) ⇒ <code>Promise</code>
    * [.experimentsByProjectName(workspace, project, [archived])](#API+experimentsByProjectName) ⇒ <code>Promise</code>
    * [.experimentsByProjectId(projectId, [archived])](#API+experimentsByProjectId) ⇒ <code>Promise</code>
    * [.experimentHtml(experimentKey)](#API+experimentHtml) ⇒ <code>Promise</code>
    * [.experimentCode(experimentKey)](#API+experimentCode) ⇒ <code>Promise</code>
    * [.experimentOutput(experimentKey)](#API+experimentOutput) ⇒ <code>Promise</code>
    * [.experimentInstalledPackages(experimentKey)](#API+experimentInstalledPackages) ⇒ <code>Promise</code>
    * [.experimentSystemDetails(experimentKey)](#API+experimentSystemDetails) ⇒ <code>Promise</code>
    * [.experimentGraph(experimentKey)](#API+experimentGraph) ⇒ <code>Promise</code>
    * [.experimentImages(experimentKey)](#API+experimentImages) ⇒ <code>Promise</code>
    * [.experimentParameters(experimentKey, [name])](#API+experimentParameters) ⇒ <code>Promise</code>
    * [.experimentMetricsSummary(experimentKey, [metricName])](#API+experimentMetricsSummary) ⇒ <code>Promise</code>
    * [.experimentOther(experimentKey, [other], [value])](#API+experimentOther) ⇒ <code>Promise</code>
    * [.experimentName(experimentKey, [maxLength])](#API+experimentName) ⇒ <code>Promise</code>
    * [.experimentMetric(experimentKey, metricName)](#API+experimentMetric) ⇒ <code>Promise</code>
    * [.experimentMetrics(experimentKey)](#API+experimentMetrics) ⇒ <code>Promise</code>
    * [.experimentMetricsForChart(targetedExperiments, metrics, parameters, independentMetrics, fetchFull)](#API+experimentMetricsForChart) ⇒ <code>Promise</code>
    * [.experimentAssets(experimentKey, [type], [tags])](#API+experimentAssets) ⇒ <code>Promise</code>
    * [.experimentAssetDetails(experimentKey, assetId)](#API+experimentAssetDetails) ⇒ <code>Promise</code>
    * [.experimentAssetByName(experimentKey, fileName, [returnType])](#API+experimentAssetByName) ⇒ <code>Promise</code>
    * [.experimentCurves(experimentKey)](#API+experimentCurves)
    * [.experimentAsset(experimentKey, assetId, [returnType])](#API+experimentAsset) ⇒ <code>Promise</code>
    * [.store(key, value)](#API+store)
    * [.getFromStore(key)](#API+getFromStore)
    * [.getStore()](#API+getStore)
    * [.experimentStop(experimentKey)](#API+experimentStop)

<a name="new_API_new"></a>

### new API(apiKey, [projectId], [instanceId], [version])
summary Comet Javascript SDK

**Returns**: [<code>API</code>](#API) - API instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | a Comet API key, or a project token |
| [projectId] | <code>string</code> |  | the project id (set by panels) |
| [instanceId] | <code>string</code> |  | the panel instance id (set by panels) |
| [version] | <code>string</code> | <code>&quot;&#x27;v2&#x27;&quot;</code> | the REST API version |

<a name="API+getVersion"></a>

### api.getVersion() ⇒ <code>string</code>
**Kind**: instance method of [<code>API</code>](#API)  
**Summary**: Returns the REST version string for this API instance.  
**Returns**: <code>string</code> - the version string  
**Access**: public  
**Example**  
```js
> api.getVersion()
"v2"
```
<a name="API+experimentURL"></a>

### api.experimentURL(experimentKey) ⇒ <code>string</code>
Returns the URL for the experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>string</code> - the url  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

<a name="API+experimentMetadata"></a>

### api.experimentMetadata(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the metadata for the given experimentKey.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an object of metadata  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentMetadata('7387462874624747').then(result => {
    console.log(result);
  });

{'archived': false,
 'durationMillis': 72,
 'endTimeMillis': 1572435457349,
 'experimentKey': "5a67221477dc5d76b37d10adbe41486d",
 'experimentName': null,
 'fileName': "train.py",
 'filePath': "/home/user/train.py",
 'hasCrashed': false,
 'optimizationId': null,
 'projectId': "0306c896110140a2aaa24e54dbb40e6b",
 'projectName': "my-project-name",
 'running': false,
 'startTimeMillis': 1572435384908,
 'throttle': false,
 'userName': "username",
 'workspaceName': "myworkspace"
}
```
<a name="API+experimentTags"></a>

### api.experimentTags(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the list of tags for the given experimentKey.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an object of a list of tags  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentTags('7387462874624747').then(result => {
    console.log(result);
  });

['tag1', 'tag2', ...]
```
<a name="API+experimentColor"></a>

### api.experimentColor(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the display color of the given experimentKey.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of a color string  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentColor('7387462874624747').then(result => {
    console.log(result);
  });

'#5899da'
```
<a name="API+experimentGitMetadata"></a>

### api.experimentGitMetadata(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the git metadata of the given experimentKey.
Requires write access to the experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an object of git metadata  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentGitMetadata('7387462874624747').then(result => {
    console.log(result);
  });

{'user': "username",
 'root': "/home/user/project",
 'branch': "refs/heads/main",
 'parent': "3fca1d1c63e8b4d6c3f5b2b7c2a1e0f9d8c7b6a5",
 'origin': "git@github.com:user/project.git"
}
```
<a name="API+experimentGitPatch"></a>

### api.experimentGitPatch(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the git patch (a zip file, as an ArrayBuffer)
of the given experimentKey. Requires write access to the experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an ArrayBuffer  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentGitPatch('7387462874624747').then(result => {
    console.log(result.byteLength);
  });

1024
```
<a name="API+experimentCloudDetails"></a>

### api.experimentCloudDetails(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the cloud provider details (e.g. AWS, GCP)
of the given experimentKey.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an object of cloud details  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentCloudDetails('7387462874624747').then(result => {
    console.log(result);
  });

{'experimentKey': "7387462874624747",
 'provider': "AWS",
 'metadata': {...}
}
```
<a name="API+experimentModels"></a>

### api.experimentModels(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for an Array of models logged with the given
experimentKey.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an Array of model objects  
**Access**: public  

| Param | Type |
| --- | --- |
| experimentKey | <code>string</code> | 

**Example**  
```js
> api.experimentModels('7387462874624747').then(result => {
    console.log(result);
  });

[{'experimentModelId': "4fd3a2...",
  'experimentKey': "7387462874624747",
  'modelName': "my-model",
  'registryRecords': [...]
}]
```
<a name="API+experimentModelAssets"></a>

### api.experimentModelAssets(experimentKey, modelName, [tags]) ⇒ <code>Promise</code>
Returns a Promise for an Array of the asset JSON objects that make
up the given logged model.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an Array of asset objects (same
format as experimentAssets())  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> |  |
| modelName | <code>string</code> | the name of the logged model |
| [tags] | <code>Array</code> | only return assets having all of these tags |

**Example**  
```js
> api.experimentModelAssets('7387462874624747', 'my-model').then(result => {
    console.log(result);
  });

[{"assetId": "ASSET-ID", "fileName": "model.pkl", "type": "model-element", ...}]
```
<a name="API+experimentArtifacts"></a>

### api.experimentArtifacts(experimentKey, [filter]) ⇒ <code>Promise</code>
Returns a Promise for an Array of artifact versions that the
given experimentKey logged (output) and/or used (input).

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an Array of artifact version objects  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| experimentKey | <code>string</code> |  |  |
| [filter] | <code>string</code> | <code>&quot;&#x27;all&#x27;&quot;</code> | one of 'all', 'input', or 'output' |

**Example**  
```js
> api.experimentArtifacts('7387462874624747', 'output').then(result => {
    console.log(result);
  });

[{'artifactId': "...", 'artifactName': "dataset", 'version': "1.0.0", ...}]
```
<a name="API+accountDetails"></a>

### api.accountDetails() ⇒ <code>Promise</code>
Returns a Promise for the account details of the current Comet
user (the owner of the API key).

Requires a user API key; not available with a project token
(JavaScript panels).

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an object of account details  
**Access**: public  
**Example**  
```js
> api.accountDetails().then(result => {
    console.log(result);
  });

{'userName': "username", 'defaultWorkspaceName': "workspace1"}
```
<a name="API+workspaces"></a>

### api.workspaces() ⇒ <code>Promise</code>
Returns a Promise for an array of workspace names for the current Comet user.

Requires a user API key; not available with a project token
(JavaScript panels).

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the Promise of an array of string names  
**Access**: public  
**Example**  
```js
> api.workspaces().then(result => {
    console.log(result);
  });

['workspace1', 'workspace2', 'workspace3']
```
<a name="API+projects"></a>

### api.projects(workspace) ⇒ <code>Promise</code>
Returns a Promise for an array of project JSON objects for the
given workspace.

Requires a user API key; not available with a project token
(JavaScript panels).

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - an array of JSON project objects  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| workspace | <code>string</code> | the name of the workspace |

**Example**  
```js
> api.projects('workspace').then(result => {
    console.log(result);
  });

[
 {
  "projectId": "NA",
  "projectName": "general",
  "projectDescription": "View all experiments that aren't assigned to a project.",
  "ownerUserName": "username",
  "workspaceId": "workspace ID",
  "workspaceName": "workspace name",
  "isPublic": false,
  "numberOfExperiments": 1,
  "lastUpdated": 1527183924215
 }
]
```
<a name="API+projectNotes"></a>

### api.projectNotes(projectId) ⇒ <code>Promise</code>
Returns a Promise for the string of project notes.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of a string of notes in markdown  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>string</code> | the name of the project |

**Example**  
```js
> api.projectNotes(projectId).then(result => {
    console.log(result);
  });

'# Heading\nMy notes.'
```
<a name="API+projectMetadata"></a>

### api.projectMetadata(projectId) ⇒ <code>Promise</code>
Returns a Promise for the project metadata.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of the project metadata  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>string</code> | the name of the project |

**Example**  
```js
> api.projectMetadata(projectId).then(result => {
    console.log(result);
  });

{
 "public": true,
 "lastUpdated": 1587065944275,
 "numberOfExperiments": 5,
 "ownerUserName": "username",
 "projectDescription": "Project Description",
 "projectId": "aProjectId",
 "projectName": "Project Name",
 "workspaceName": "Name of the workspace"
}
```
<a name="API+projectMetadataByName"></a>

### api.projectMetadataByName(workspaceName, projectName) ⇒ <code>Promise</code>
Returns a Promise for the project metadata, looked up by
workspace and project name.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of the project metadata  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| workspaceName | <code>string</code> | the name of the workspace |
| projectName | <code>string</code> | the name of the project |

**Example**  
```js
> api.projectMetadataByName('workspace1', 'project1').then(result => {
    console.log(result);
  });

{
 "public": false,
 "lastUpdated": 1587065944275,
 "numberOfExperiments": 5,
 "ownerUserName": "username",
 "projectDescription": "Project Description",
 "projectId": "aProjectId",
 "projectName": "project1",
 "workspaceName": "workspace1"
}
```
<a name="API+projectColumns"></a>

### api.projectColumns(projectId) ⇒ <code>Promise</code>
Returns a Promise for an array of the columns (metrics, parameters,
other, metadata, etc.) available in a project.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - Promise of an array of column objects  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>string</code> | the project id |

**Example**  
```js
> api.projectColumns(projectId).then(result => {
    console.log(result);
  });

[
 {"name": "loss", "id": "loss_metrics", "type": "double",
  "source": "metrics", "kinds": ["last"]},
 ...
]
```
<a name="API+get"></a>

### api.get([workspace], [project], [experimentKey]) ⇒ <code>Promise</code>
Returns a Promise for an array of names or objects.

get() and get(workspace) require a user API key; with a project
token (JavaScript panels) only get(workspace, project) and
get(workspace, project, experimentKey) work, for the panel's project.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - an array of workspace names, project objects, or
(active) experiment keys; or, given an experiment key, that
experiment's metadata (archived or not), or undefined if it is not
in the given project.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [workspace] | <code>string</code> | the name of the "workspace", "workspace/project", or "workspace/project/experiment". |
| [project] | <code>string</code> | the name of the project |
| [experimentKey] | <code>string</code> | the experiment key |

**Example**  
```js
> api.get().then(result => {
    console.log(result);
  });

['general', 'workspace1']

> api.get('workspace1').then(result => {
    console.log(result);
  });

[{"lastUpdated": 1572435457347,
  numberOfExperiments: 1,
  ownerUserName: "user",
  projectDescription: "Project Description",
  projectId: "0306c897310140a1aaa24ea4343430e6b",
  projectName: "project1",
  public: false,
  workspaceName: "user",
 }]

> api.get('workspace1/project1').then(result => {
    console.log(result);
  });

["4d51ea0c5ebb48eea3465f3ad0ba12b3", "dfae44c27ebe41ef9231fc35eae137e8", ...]

> api.get('workspace1/project1/4d51ea0c5ebb48eea3465f3ad0ba12b3').then(result => {
    console.log(result);
  });

 {
  "durationMillis": 0,
  "startTimeMillis": 1527184671290,
  "endTimeMillis": 1527184671290,
  "experimentKey": "4d51ea0c5ebb48eea3465f3ad0ba12b3",
  "experimentName": "someExperimentName",
  "optimizationId": "someOptimizationId",
  "archived": false,
  "projectName": "project1",
  "projectId": "someProjectId",
  "workspaceName": "workspace1",
 }
```
<a name="API+experimentsByProjectName"></a>

### api.experimentsByProjectName(workspace, project, [archived]) ⇒ <code>Promise</code>
Returns a Promise for an array of experiment JSON objects.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - an array of experiment JSON objects  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| workspace | <code>string</code> |  | the name of the workspace |
| project | <code>string</code> |  | the name of the project |
| [archived] | <code>boolean</code> | <code>false</code> | if true, return archived experiments instead of active ones |

**Example**  
```js
> api.experimentsByProjectName('workspace1', 'project1').then(result => {
    console.log(result);
  });

[
 {
  "durationMillis": 0,
  "startTimeMillis": 1527184671290,
  "endTimeMillis": 1527184671290,
  "experimentKey": "someExperimentKey",
  "experimentName": "someExperimentName",
  "optimizationId": "someOptimizationId",
  "archived": false,
  "projectName": "someProjectName",
  "projectId": "someProjectId",
  "workspaceName": "someWorkspaceName",
 }
]
```
<a name="API+experimentsByProjectId"></a>

### api.experimentsByProjectId(projectId, [archived]) ⇒ <code>Promise</code>
Returns a Promise for an array of experiment JSON objects given a project id.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - an array of experiment JSON objects  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| projectId | <code>string</code> |  | the name of the project |
| [archived] | <code>boolean</code> | <code>false</code> | if true, return archived experiments instead of active ones |

**Example**  
```js
> api.experimentsByProjectId('project-uuid').then(result => {
    console.log(result);
  });

[
 {
  "durationMillis": 0,
  "startTimeMillis": 1527184671290,
  "endTimeMillis": 1527184671290,
  "experimentKey": "someExperimentKey",
  "experimentName": "someExperimentName",
  "optimizationId": "someOptimizationId",
  "archived": false,
  "projectName": "someProjectName",
  "projectId": "someProjectId",
  "workspaceName": "someWorkspaceName",
 }
]
```
<a name="API+experimentHtml"></a>

### api.experimentHtml(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the HTML associated with the experiment or null.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the HTML string of the experiment or
null if there is no HTML.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentHtml('experimentKey1').then(result => {
    console.log(result);
  });

'<b>The HTML</b>'
```
<a name="API+experimentCode"></a>

### api.experimentCode(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the source code associated with the experiment or null.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the source code as a string of the
experiment or null if there is no source code.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentCode('experimentKey1').then(result => {
    console.log(result);
  });

'print("The Source Code")'
```
<a name="API+experimentOutput"></a>

### api.experimentOutput(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the standard output associated with the experiment or null.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the output as a string of the
experiment or null if there is no output.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentOutput('experimentKey1').then(result => {
    console.log(result);
  });

'The Output of the Program'
```
<a name="API+experimentInstalledPackages"></a>

### api.experimentInstalledPackages(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for an Array of installed packages associated with the experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - an Array of Python packages in "package=version" format.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentInstalledPackages('experimentKey1').then(result => {
    console.log(result);
  });

['pip=19.01', 'comet=1.0.28']
```
<a name="API+experimentSystemDetails"></a>

### api.experimentSystemDetails(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for an Object of JSON system details associated with the experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - an Object of JSON system details.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentSystemDetails('experimentKey1').then(result => {
    console.log(result);
  });

{command: ["/usr/local/bin/pytest", ...],
 executable: "/usr/local/bin/python",
 experimentKey: "4d51ea0c5ebb48eea3465f3ad0ba12b3",
 gpuStaticInfoList: [],
 hostname: "b94cd9a8ee38",
 installedPackages: ["atomicwrites==1.3.0", ...],
 ip: "172.19.0.5",
 logAdditionalSystemInfoList: [],
 maxTotalMemory: null,
 networkInterfaceIps: (2) ["127.0.0.1", "172.19.0.5"],
 os: "Linux-4.15.0-1057-oem-x86_64-with-debian-10.1",
 osPackages: [],
 osType: "Linux",
 pid: 6,
 pythonVersion: "3.6.9",
 pythonVersionVerbose: "3.6.9 (default, Sep 12 2019, 16:23:48) \n[GCC 8.3.0]",
 systemMetricNames: ["sys.cpu.percent.01", ...],
 totalRam: null,
 user: "root",
}
```
<a name="API+experimentGraph"></a>

### api.experimentGraph(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for the graph associated with the experiment's model, or null.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the graph as a string of the
experiment's model or null if there is no graph.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentGraph('experimentKey1').then(result => {
    console.log(result);
  });

'Network()'
```
<a name="API+experimentImages"></a>

### api.experimentImages(experimentKey) ⇒ <code>Promise</code>
Returns a Promise for an Array of image JSON objects associated with the
experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - array of JSON image objects  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentImages('experimentKey1').then(result => {
    console.log(result);
  });

[
 {
  "apiKey": "someApiKey",
  "runId": "someRunId0123456789012345",
  "experimentKey": "someExperimentKey",
  "projectId": null,
  "figCounter": 123,
  "figName": "imageName",
  "step": 12312,
  "runContext": "contextA",
  "fileName": "file.py",
  "imagePath": "https://comet-ml.nyc3.digitaloceanspaces.com/file.py"
 }
]
```
<a name="API+experimentParameters"></a>

### api.experimentParameters(experimentKey, [name]) ⇒ <code>Promise</code>
If no parameter name is given, then it returns a Promise of an
Array of parameter JSON objects associated with the
experiment. If a parameter name is given, then it returns a
Promise of the valueCurrent of the parameter.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - array of JSON parameter objects or
value of given parameter name  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |
| [name] | <code>string</code> | the name of the parameter |

**Example**  
```js
> api.experimentParameters('experimentKey1').then(result => {
    console.log(result);
  });

[
 {
  "name": "nameA",
  "valueMax": "valueA",
  "valueMin": "valueA",
  "valueCurrent": "valueA",
  "timestampMax": 1527266735622,
  "timestampMin": 1527266735622,
  "timestampCurrent": 1527266735622,
  "runContextMax": "",
  "runContextMin": "",
  "runContextCurrent": "",
  "stepMax": null,
  "stepMin": null,
  "stepCurrent": null
 },
 {
  "name": "nameB",
  "valueMax": "valueB",
  "valueMin": "valueB",
  "valueCurrent": "valueB",
  "timestampMax": 1538888303,
  "timestampMin": 1538888303,
  "timestampCurrent": 1538888303,
  "runContextMax": "",
  "runContextMin": "",
  "runContextCurrent": "",
  "stepMax": null,
  "stepMin": null,
  "stepCurrent": null
 }
]

> api.experimentParameters('experimentKey1', 'nameA').then(result => {
    console.log(result);
  });

[
 {
  "name": "nameA",
  "valueMax": "valueA",
  "valueMin": "valueA",
  "valueCurrent": "valueA",
  "timestampMax": 1527266735622,
  "timestampMin": 1527266735622,
  "timestampCurrent": 1527266735622,
  "runContextMax": "",
  "runContextMin": "",
  "runContextCurrent": "",
  "stepMax": null,
  "stepMin": null,
  "stepCurrent": null
 }
]
```
<a name="API+experimentMetricsSummary"></a>

### api.experimentMetricsSummary(experimentKey, [metricName]) ⇒ <code>Promise</code>
Returns a Promise for a JSON object that has the summary data of the
given metric, or a list of the JSON objects for each metric
if no metricName is given.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - JSON metric object, or Array of  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |
| [metricName] | <code>string</code> | the name of the metric |

**Example**  
```js
> api.experimentMetricsSummary('experimentKey1', 'someNameA').then(result => {
    console.log(result);
  });

{
  "name": "someNameA",
  "valueMax": "1.123",
  "valueMin": "1.123",
  "valueCurrent": "1.123",
  "timestampMax": 1527266664729,
  "timestampMin": 1527266664729,
  "timestampCurrent": 1527266664729,
  "runContextMax": null,
  "runContextMin": null,
  "runContextCurrent": null,
  "stepMax": null,
  "stepMin": null,
  "stepCurrent": null
}

> api.experimentMetricsSummary('experimentKey1').then(result => {
    console.log(result);
  });

[
 {
  "name": "someNameA",
  "valueMax": "1.123",
  "valueMin": "1.123",
  "valueCurrent": "1.123",
  "timestampMax": 1527266664729,
  "timestampMin": 1527266664729,
  "timestampCurrent": 1527266664729,
  "runContextMax": null,
  "runContextMin": null,
  "runContextCurrent": null,
  "stepMax": null,
  "stepMin": null,
  "stepCurrent": null
 },
 {
  "name": "someNameB",
  "valueMax": "42",
  "valueMin": "40",
  "valueCurrent": "41",
  "timestampMax": 1727266664729,
  "timestampMin": 1727266664729,
  "timestampCurrent": 1727266664729,
  "runContextMax": null,
  "runContextMin": null,
  "runContextCurrent": null,
  "stepMax": null,
  "stepMin": null,
  "stepCurrent": null
 }
]
```
<a name="API+experimentOther"></a>

### api.experimentOther(experimentKey, [other], [value]) ⇒ <code>Promise</code>
If no other name is given, then it returns a Promise of an Array
of all other JSON objects associated with the experiment. If a
name is given, then it returns a Promise of the JSON object of
given item. If a value is also given, then it will return a
Promise of the JSON field of that name.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - array of JSON logged other
items, or a single matching JSON object, or the field of that
JSON object.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |
| [other] | <code>string</code> | the name of the logged item |
| [value] | <code>string</code> | the field of the JSON object |

**Example**  
```js
> api.experimentOther('experimentKey1').then(result => {
    console.log(result);
  });

[
 {
   "name": "key",
   "valueMax": "value",
   "valueMin": "value",
   "valueCurrent": "value",
   "timestampMax": 1527266796121,
   "timestampMin": 1527266796121,
   "timestampCurrent": 1527266796121,
   "runContextMax": null,
   "runContextMin": null,
   "runContextCurrent": null,
   "stepMax": null,
   "stepMin": null,
   "stepCurrent": null
 }
]

> api.experimentOther('experimentKey1', 'key').then(result => {
    console.log(result);
  });

{
   "name": "key",
   "valueMax": "value",
   "valueMin": "value",
   "valueCurrent": "value",
   "timestampMax": 1527266796121,
   "timestampMin": 1527266796121,
   "timestampCurrent": 1527266796121,
   "runContextMax": null,
   "runContextMin": null,
   "runContextCurrent": null,
   "stepMax": null,
   "stepMin": null,
   "stepCurrent": null
}

> api.experimentOther('experimentKey1', 'key', 'valueMax').then(result => {
    console.log(result);
  });

"value"
```
<a name="API+experimentName"></a>

### api.experimentName(experimentKey, [maxLength]) ⇒ <code>Promise</code>
Returns a Promise for the name of this experiment (if one) or
key.  The return value is limited in length if maxLength
is given;

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the name of the experiment key.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |
| [maxLength] | <code>number</code> | the maximum length of name or key |

**Example**  
```js
> api.experimentName('experimentKey1').then(result => {
    console.log(result);
  });
'name given via experiment.set_name("name")'

> api.experimentName('experimentKey1', 9)
'name give'

> api.experimentName('experimentKey1')
'09ce56129'
```
<a name="API+experimentMetric"></a>

### api.experimentMetric(experimentKey, metricName) ⇒ <code>Promise</code>
Returns a Promise of an Array of all raw values logged for the
given metric name. Use experimentMetrics() to get all metrics.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - array of raw metric JSON objects  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |
| metricName | <code>string</code> | the name of the metric |

**Example**  
```js
> api.experimentMetric('experimentKey1', 'loss').then(result => {
    console.log(result);
  });

[
 {
  "metricName": "loss",
  "metricValue": "0.41",
  "timestamp": 1527266664729,
  "step": 1,
  "epoch": 0,
  "runContext": null,
  "offset": 1
 },
 ...
]
```
<a name="API+experimentMetrics"></a>

### api.experimentMetrics(experimentKey) ⇒ <code>Promise</code>
Returns a Promise of an Array of all raw metric values logged
with the experiment, for all metric names.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - array of raw metric JSON objects  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentMetrics('experimentKey1').then(result => {
    console.log(result);
  });

[
 {"metricName": "loss", "metricValue": "0.41", "step": 1, ...},
 {"metricName": "acc", "metricValue": "0.87", "step": 1, ...},
 ...
]
```
<a name="API+experimentMetricsForChart"></a>

### api.experimentMetricsForChart(targetedExperiments, metrics, parameters, independentMetrics, fetchFull) ⇒ <code>Promise</code>
Return a Promise of a set of metrics and/or parameters aligned on step values.

**Kind**: instance method of [<code>API</code>](#API)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| targetedExperiments | <code>Array</code> |  | an array of experimentKeys |
| metrics | <code>Array</code> |  | [metrics=[]] the names of the metrics |
| parameters | <code>Array</code> |  | [parameters=[]] the names of the parameters |
| independentMetrics | <code>boolean</code> | <code>true</code> | independent, whether to align all of the selection and ignore all but those that match, or get all |
| fetchFull | <code>boolean</code> | <code>false</code> | full, whether to fetch all metrics (up to 15,000) or a sampled subset (about 500) |

**Example**  
```js
> api.experimentMetricsForChart(['5a67221477dc4dc6b38d10adbe41486d']).then(result => {
    console.log(result);
  });

{'5a67221477dc4dc6b38d10adbe41486d':
 {'empty': false,
  'epochs': null,
  'params': null,
  'steps': null,
  'experimentKey': "5a67221477dc4dc6b38d10adbe41486d",
  'metrics': [{'metricName': "acc", 'values': [], 'steps': [], 'epochs': [], 'timestamps': [], 'values': []}],
 }
}
```
<a name="API+experimentAssets"></a>

### api.experimentAssets(experimentKey, [type], [tags]) ⇒ <code>Promise</code>
Returns a Promise for an Array of asset JSON objects associated with the
experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - array of JSON asset objects  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| experimentKey | <code>string</code> |  | the experiment key |
| [type] | <code>string</code> | <code>&quot;&#x27;all&#x27;&quot;</code> | only return assets of this type (e.g. 'image', 'audio', 'curve', 'model-element', 'asset') |
| [tags] | <code>Array</code> |  | only return assets having all of these tags |

**Example**  
```js
> api.experimentAssets('experimentKey1').then(result => {
    console.log(result);
  });

[{
 "assetId":"ASSET-ID",
 "audio":true,
 "canView":false,
 "compressedAssetLink":"https://www.comet.ml/api/asset/download?experimentKey=KEY&assetId=ASSET-ID&isCompressed=true",
 "createdAt":1590031167888,
 "curlDownload":"curl \"https://www.comet.ml/api/rest/v2/experiment/asset/get-asset?experimentKey=KEY&assetId=ASSET-ID\" -H\"Authorization: API-KEY\" > cat_22.wav"
 "dir":"audio",
 "fileName":"cat_22.wav",
 "fileSize":329644,
 "histogram":false,
 "image":false,
 "link":"https://www.comet.ml/api/asset/download?experimentKey=KEY&assetId=ASSET-ID&isCompressed=false",
 "metadata":null,
 "runContext":null,
 "step":null,
 "tags":[],
 "type":"audio",
 "video":false,
}, ...]
```
<a name="API+experimentAssetDetails"></a>

### api.experimentAssetDetails(experimentKey, assetId) ⇒ <code>Promise</code>
Returns a Promise for the JSON details of a single asset
associated with the experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - JSON asset object (same format as an item of
experimentAssets())  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |
| assetId | <code>string</code> | the asset id |

**Example**  
```js
> api.experimentAssetDetails('experimentKey1', 'ASSET-ID').then(result => {
    console.log(result);
  });

{"assetId": "ASSET-ID", "fileName": "cat_22.wav", "type": "audio", ...}
```
<a name="API+experimentAssetByName"></a>

### api.experimentAssetByName(experimentKey, fileName, [returnType]) ⇒ <code>Promise</code>
Returns a Promise for an asset associated with the experiment by its name. If
the asset is a JSON file, you can get the contents parsed as
JSON data.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the contents (binary (if Python 3 and returnType
=== 'raw'), string (if Python 2 and returnType === 'raw'), or
JSON if returnType === 'json')  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| experimentKey | <code>string</code> |  | the experiment key |
| fileName | <code>string</code> |  | the name of the asset |
| [returnType] | <code>string</code> | <code>&quot;&#x27;raw&#x27;&quot;</code> | the type of data to return |

**Example**  
```js
> api.experimentAssetByName('experimentKey1', 'file.py').then(result => {
    console.log(result);
  });

'the contents of the asset as string (Python 2)'

> api.experimentAssetByName('experimentKey1', 'file.py').then(result => {
    console.log(result);
  });

b'the contents of the asset as binary (Python 3)'

> api.experimentAssetByName('experimentKey1', 'file.json', 'json').then(result => {
    console.log(result);
  });

{someName: "value of key", someOther: [1, 2, 3]}

> api.experimentAssetByName('experimentKey1', 'file.data', 'json').then(result => {
    console.log(result);
  });

[[1], [2], [3]]
```
<a name="API+experimentCurves"></a>

### api.experimentCurves(experimentKey)
Returns a Promise for a list of curves logged with experiment.

**Kind**: instance method of [<code>API</code>](#API)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentCurves('experimentKey1').then(curves => {
    console.log(curves);
  });

[{x: [1, 2, 3], y: [4, 5, 6], name: "mycurve", step: 1}, ...]
```
<a name="API+experimentAsset"></a>

### api.experimentAsset(experimentKey, assetId, [returnType]) ⇒ <code>Promise</code>
Returns a Promise for an asset associated with the experiment by its id. If
the asset is a JSON file, you can get the contents parsed as
JSON data.

**Kind**: instance method of [<code>API</code>](#API)  
**Returns**: <code>Promise</code> - the contents (binary (if Python 3 and returnType
=== 'raw'), string (if Python 2 and returnType === 'raw'), or
JSON if returnType === 'json')  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| experimentKey | <code>string</code> |  | the experiment key |
| assetId | <code>string</code> |  | the name of the asset |
| [returnType] | <code>string</code> | <code>&quot;&#x27;raw&#x27;&quot;</code> | the type of data to return |

**Example**  
```js
> api.experimentAsset('experimentKey1', '6YZYszn9cO9mhDoYrfuQlDLcE').then(result => {
    console.log(result);
  });

'the contents of the asset as string (Python 2)'

> api.experimentAsset('experimentKey1', '6YZYszn9cO9mhDoYrfuQlDLcE').then(result => {
    console.log(result);
  });

b'the contents of the asset as binary (Python 3)'

> api.experimentAsset('experimentKey1', '3873473463782746284762734', 'json').then(result => {
    console.log(result);
  });

{someName: "value of key", someOther: [1, 2, 3]}

> api.experimentAsset('experimentKey1', '9093487348374873487348731', 'json').then(result => {
    console.log(result);
  });

[[1], [2], [3]]
```
<a name="API+store"></a>

### api.store(key, value)
Given a key, value pair, save it locally, and send the whole
store to the backend. Returns a Promise for the result.

**Kind**: instance method of [<code>API</code>](#API)  
**Access**: public  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| value | <code>string</code> | 

**Example**  
```js
> api.store("text", "This is the text").then(result => {
    console.log(result);
  });

{"msg": "Stored"}
```
<a name="API+getFromStore"></a>

### api.getFromStore(key)
Given a key, return a Promise for the value from the backend.

**Kind**: instance method of [<code>API</code>](#API)  
**Access**: public  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

**Example**  
```js
> api.getFromStore("text").then(result => {
    console.log(result);
  });

"This is the text"
```
<a name="API+getStore"></a>

### api.getStore()
Return a Proimse for the store from the backend.

**Kind**: instance method of [<code>API</code>](#API)  
**Access**: public  
**Example**  
```js
> api.getStore().then(result => {
    console.log(result);
  });

{"store": "{...}"}
```
<a name="API+experimentStop"></a>

### api.experimentStop(experimentKey)
Given an experimentKey, return a Promise of the results to stop
the running experiment.

Requires a user API key; not available with a project token
(JavaScript panels).

**Kind**: instance method of [<code>API</code>](#API)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| experimentKey | <code>string</code> | the experiment key |

**Example**  
```js
> api.experimentStop('experimentKey1').then(result => {
    console.log(result);
  });

{"msg": "Stop Requested"}
```
