#!/bin/sh
# Prints the release tag on HEAD: a MAJOR.MINOR.PATCH tag of digits only,
# the highest if there are several, or nothing. Other tags on the commit
# (v1.2.0, 1.2.0-rc1, markers) are ignored, so they can't hide a release.
# Exits non-zero, with an error, if git can't list the tags (not a
# repository, no commit), so Jenkins fails rather than skipping a release.
# Used by scripts/Jenkinsfile; tested in test/unit/release-tag.test.js.
set -eu

if ! tags=$(git tag --list --points-at HEAD); then
  echo "release-tag.sh: could not list the tags on HEAD" >&2
  exit 1
fi

# grep finding no release tag is not an error: print nothing.
printf '%s\n' "$tags" |
  { grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' || true; } |
  sort -t . -k 1,1n -k 2,2n -k 3,3n |
  tail -n 1
