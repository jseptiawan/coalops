#!/usr/bin/env bash
# Push all files to the GitHub repository via the connector__github__create_or_update_file tool
set -u
OWNER="jseptiawan"
REPO="coalops"
BRANCH="main"
SRC="/workspace/coal-mine-monitor"

cd "$SRC"

# Build a temp file with a JSON args object per file
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# Find all files to push
mapfile -t FILES < <(find . -type f \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./out/*" \
  -not -path "./screenshots/*" \
  -not -name "*.tsbuildinfo" \
  | sort)

TOTAL=${#FILES[@]}
echo "Pushing $TOTAL files to $OWNER/$REPO ($BRANCH)..."

# Function to push a single file
push_file() {
  local relpath="$1"
  local fullpath="$SRC/$relpath"
  local path="${relpath#./}"

  python3 -c "
import json
with open('$fullpath', 'rb') as f:
    content = f.read().decode('utf-8', errors='replace')
args = {
    'owner': '$OWNER',
    'repo': '$REPO',
    'path': '$path',
    'content': content,
    'message': 'feat: add $path',
    'branch': '$BRANCH',
}
with open('$TMPDIR/args.json', 'w') as f:
    json.dump(args, f)
"

  result=$(mcode-tools connector call connector__github__create_or_update_file --args-file "$TMPDIR/args.json" 2>&1)
  if echo "$result" | grep -q '"content"'; then
    echo "  ✓ $path"
  elif echo "$result" | grep -qi "already exists"; then
    echo "  · $path (exists, needs sha)"
  else
    echo "  ! $path"
    echo "$result" | head -c 200
    echo
  fi
}

COUNT=0
for rel in "${FILES[@]}"; do
  push_file "$rel"
  COUNT=$((COUNT + 1))
done

echo "Done. Attempted $COUNT files."
