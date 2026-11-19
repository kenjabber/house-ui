#!/usr/bin/env bash
# Releases house-ui (PLAN D-4): checks, builds, packs, commits the version,
# tags vX.Y.Z, pushes, and uploads house-ui-X.Y.Z.tgz to the GitHub Release
# that apps pin. dist/ is never committed.
#
#   ./release.sh 1.0.0            release
#   ./release.sh --dry-run 1.0.0  everything up to the pack, then undo the version bump
set -euo pipefail
cd "$(dirname "$0")"

dry=0
if [[ "${1:-}" == "--dry-run" ]]; then dry=1; shift; fi
version="${1:-}"
if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "usage: ./release.sh [--dry-run] X.Y.Z" >&2
  exit 2
fi
tag="v$version"
tgz="house-ui-$version.tgz"
repo="kenjabber/house-ui"
fail() { echo "release: $*" >&2; exit 1; }

[[ "$(git branch --show-current)" == main ]] || fail "not on main"
[[ -z "$(git status --porcelain)" ]] || fail "the working tree has changes; commit them first"
git fetch --quiet origin
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/main)" ]] || fail "main is not the same as origin/main"
git rev-parse -q --verify "refs/tags/$tag" >/dev/null && fail "tag $tag exists"
git ls-remote --exit-code --tags origin "refs/tags/$tag" >/dev/null && fail "tag $tag exists on origin"

# Apps download the tarball with no credentials (D-21), so the repo must be public.
visibility="$(gh repo view "$repo" --json visibility -q .visibility)"
if [[ "$visibility" != PUBLIC ]]; then
  if (( dry )); then echo "release: note: $repo is $visibility; a real release needs it public (D-21)"
  else fail "$repo is $visibility; apps cannot download a private release (D-21). Make it public first."; fi
fi

echo "== checks"
npm ci --no-audit --no-fund
npm run lint
npm test
npm run typecheck

echo "== build $tag"
npm version "$version" --no-git-tag-version >/dev/null
npm run build
rm -f "$tgz"
npm pack --silent >/dev/null
[[ -f "$tgz" ]] || fail "npm pack did not write $tgz"
tar -tzf "$tgz" | grep -q '^package/dist/house-ui.css$' || fail "$tgz has no dist/house-ui.css"
echo "packed $tgz ($(du -h "$tgz" | cut -f1 | tr -d ' '))"

if (( dry )); then
  git checkout -- package.json package-lock.json
  rm -f "$tgz"
  echo "dry run: stopped before commit, tag, push and upload"
  exit 0
fi

echo "== publish $tag"
git commit --quiet -am "Release $tag"
git tag -a "$tag" -m "house-ui $tag"
git push --atomic origin main "refs/tags/$tag"
gh release create "$tag" "$tgz" --repo "$repo" --title "house-ui $tag" --generate-notes
rm -f "$tgz"

url="https://github.com/$repo/releases/download/$tag/$tgz"
curl -sSfLo /dev/null "$url" || fail "uploaded, but $url does not download without credentials"
echo
echo "Released $tag. Apps install it with:"
echo "  npm install $url"
