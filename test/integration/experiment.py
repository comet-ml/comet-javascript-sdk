# Creates the experiment the integration tests read. Run it from this
# directory (it logs ./asset.json), with the workspace and project to test in:
#
#   COMET_API_KEY=... COMET_WORKSPACE=<workspace> \
#       COMET_PROJECT_NAME=javascript-sdk-tests python experiment.py
#
# It prints the COMET_TEST_* settings for the tests. For a server other than
# comet.com, also set COMET_URL_OVERRIDE (e.g. https://host/clientlib/).
from comet_ml import API, start

experiment = start()

experiment.set_name("JS SDK")
experiment.log_other("finished", False)
experiment.log_metric("some_metric", 100)
experiment.log_parameter("some_param", 50)
experiment.log_asset("./asset.json")
experiment.log_asset_data(bytes(range(256)), name="binary.bin")
experiment.log_curve("some_curve", x=[1, 2, 3], y=[4, 5, 6], step=1)
experiment.log_html("<h1>Hello World!</h1>")
experiment.log_other("finished", True)
experiment.add_tag("Some Tag")
experiment.end()

api = API(cache=False)
api_experiment = api.get_experiment_by_key(experiment.id)
api.set_project_notes(
    api_experiment.workspace, api_experiment.project_name, "Some Notes"
)

print("COMET_TEST_WORKSPACE=%s" % api_experiment.workspace)
print("COMET_TEST_PROJECT=%s" % api_experiment.project_name)
print("COMET_TEST_PROJECT_ID=%s" % api_experiment.get_metadata()["projectId"])
print("COMET_TEST_EXPERIMENT_KEY=%s" % experiment.id)
