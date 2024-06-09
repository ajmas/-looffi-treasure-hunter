#!/bin/bash

build_date=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
mode="unknown"

if [ -n "$CI_COMMIT_TAG" ]; then
    version="$CI_COMMIT_TAG"
    git_hash="$CI_COMMIT_SHA"
    git_branch="$CI_COMMIT_BRANCH"
    mode="tag"
elif [ -n "$CI_COMMIT_REF_NAME" ]; then
    version="$CI_COMMIT_SHA"
    git_hash="$CI_COMMIT_SHA"
    git_branch="$CI_COMMIT_BRANCH"
    mode="ref"
elif command -v git &> /dev/null; then
    #version=`git describe --tags --abbrev=0`
    git_hash=`git rev-parse HEAD`
    git_branch=`git branch --show-current`
    mode="cmd"
fi

echo "APPINFO buildDate ..... $build_date"
echo "APPINFO version ....... $version"
echo "APPINFO gitHash ....... $git_hash"
echo "APPINFO gitBranch ..... $git_branch"

json=$(cat <<EOF
{
    "buildDate": "$build_date",
    "version": "$version",
    "gitHash": "$git_hash",
    "gitBranch": "$git_branch",
    "mode": "$mode"
}
EOF
)

echo "$json" > "$1"

