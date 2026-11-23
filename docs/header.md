# Comet JavaScript SDK

This page documents the Comet JavaScript SDK.

See also:

* [Writing JavaScript panels](panels.md): the panel contract, what a panel can
  read, and best practices.
* [JavaScript SDK overview](https://www.comet.com/docs/v2/api-and-sdk/javascript-sdk/overview/)
  and [JavaScript panels](https://www.comet.com/docs/v2/guides/comet-ui/experiment-management/visualizations/python-sdk-views-and-panels/#javascript-panels)
  in the Comet documentation.

Note: almost all of the following methods return a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Inside JavaScript panels the API is authenticated with a project token:
`workspaces()`, `projects()`, `get()`, `accountDetails()` and
`experimentStop()` need a user API key and are refused there.
