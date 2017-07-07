# Open Source Love

## Entries API

This is a very simple API to deliver the entries for the Open Source Love project as JSON. It consists of a series of YAML files stored in nested directories, with the first level representing the GitHub username/organisation and the second one the name of the repository. Each file represents an entry and contains information about its author, date and the actual message.

A build script walks the directory tree and generates a JSON file for each repository, aggregating all its entries.

The data is being served with GitHub Page and can be accessed with a GET request to https://opensourcelove.github.io/open-source-love-data/{USERNAME}/{REPOSITORY}.json. If the response comes back as 404, it means we don't have any entries for that particular repository yet.

### Auto deploy

On every change to `master`, a Travis script rebuilds the data and deploys the new state to the `gh-pages` branch, updating the JSON endpoints.
