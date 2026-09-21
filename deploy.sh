#!/bin/sh
# Publish the site to the gh-pages branch by hand.
#
# The repository normally deploys through .github/workflows/gh-pages.yml on
# every push to main. That workflow cannot start while the GitHub account is
# locked for billing - the run fails in about three seconds with "The job was
# not started because your account is locked due to a billing issue" - and the
# live site then keeps serving whatever was last published. This script does
# the same job locally: it copies the working tree onto gh-pages and pushes,
# which GitHub's own Pages builder picks up without using Actions minutes.
#
# Once billing is sorted out this script is no longer needed.
#
# Usage:  ./deploy.sh
set -e

[ -f index.html ] || { echo "run this from the repository root"; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "commit your changes on main first"; exit 1; }

WORKTREE=$(mktemp -d)/gh-pages
REV=$(git rev-parse --short HEAD)

git worktree add -q "$WORKTREE" gh-pages
git -C "$WORKTREE" pull -q --ff-only origin gh-pages
# .github is deliberately left out: the workflow belongs on main, not on the
# published branch
rsync -a --delete --exclude='.git' --exclude='.github' --exclude='.DS_Store' ./ "$WORKTREE/"

if [ -z "$(git -C "$WORKTREE" status --porcelain)" ]; then
  echo "gh-pages is already up to date with $REV"
else
  git -C "$WORKTREE" add -A
  git -C "$WORKTREE" commit -q -m "Deploy $REV to GitHub Pages"
  git -C "$WORKTREE" push -q origin gh-pages
  echo "deployed $REV to gh-pages"
fi

git worktree remove "$WORKTREE" --force
git worktree prune
echo "the site updates at https://minhaz-42.github.io/Tanvir-Ahmed/ within a minute or two"
