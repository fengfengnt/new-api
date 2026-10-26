#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "$0")/.." && pwd)
runtime_dir=/home/fengfeng/new-api-release/current
mode=${1:-all}

if [[ ! "$mode" =~ ^(check|build|deploy|all)$ ]]; then
  echo "Usage: $0 [check|build|deploy|all]" >&2
  exit 2
fi

version=$(tr -d '\r' < "$repo_root/VERSION")
if [[ ! "$version" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
  echo "VERSION must contain one MAJOR.MINOR.PATCH value" >&2
  exit 2
fi

major=${BASH_REMATCH[1]}
minor=${BASH_REMATCH[2]}
patch=${BASH_REMATCH[3]}
if ((${#major} == 1 && ${#minor} == 1 && ${#patch} == 1)); then
  code=$major$minor$patch
else
  code=$major-$minor-$patch
fi
build_date=$(TZ=Asia/Shanghai date +%Y%m%d)
image=new-api:local-$code-$build_date
container=new-api-v$code

if [[ "$mode" == check ]]; then
  printf 'version=%s\nimage=%s\ncontainer=%s\n' "$version" "$image" "$container"
  exit 0
fi

if [[ "$mode" == build || "$mode" == all ]]; then
  if docker image inspect "$image" >/dev/null 2>&1; then
    echo "Image already exists: $image; update VERSION before rebuilding" >&2
    exit 1
  fi
  mkdir -p "$runtime_dir/source"
  rsync -a --delete --delete-excluded \
    --exclude='.git/' --exclude='.codegraph/' \
    --exclude='apipro-homepage/' --exclude='.local-tests/' \
    --exclude='web/node_modules/' --exclude='web/dist/' \
    --exclude='.env' --exclude='.env.*' \
    "$repo_root/" "$runtime_dir/source/"
  printf '%s\n' "$version" > "$runtime_dir/source/VERSION"
  docker buildx build --platform linux/amd64 --network host --load \
    --build-arg "HTTP_PROXY=${HTTP_PROXY:-}" \
    --build-arg "HTTPS_PROXY=${HTTPS_PROXY:-}" \
    --build-arg "BUN_REGISTRY=${BUN_REGISTRY:-https://registry.npmmirror.com}" \
    --build-arg "GOPROXY=${GOPROXY:-https://goproxy.cn,direct}" \
    -t "$image" "$runtime_dir/source"
  actual_version=$(docker run --rm "$image" --version)
  if [[ "$actual_version" != "$version" ]]; then
    echo "Built image version mismatch: expected $version, got $actual_version" >&2
    exit 1
  fi
  cp "$repo_root/deploy/local/compose.yaml" "$runtime_dir/compose.yaml"
  printf 'APP_IMAGE=%s\nAPP_CONTAINER_NAME=%s\nAPP_VERSION=%s\n' \
    "$image" "$container" "$version" > "$runtime_dir/release.env"
  printf 'Built %s with version %s\n' "$image" "$actual_version"
fi

if [[ "$mode" == deploy || "$mode" == all ]]; then
  if [[ ! -f "$runtime_dir/release.env" || ! -f "$runtime_dir/compose.yaml" ]]; then
    echo "Build the release before deploying" >&2
    exit 1
  fi
  source "$runtime_dir/release.env"
  if [[ "$APP_VERSION" != "$version" ]]; then
    echo "VERSION differs from the built release" >&2
    exit 1
  fi
  docker image inspect "$APP_IMAGE" >/dev/null
  if [[ ! -f "$runtime_dir/.env" ]]; then
    umask 077
    printf 'POSTGRES_PASSWORD=%s\nREDIS_PASSWORD=%s\nSESSION_SECRET=%s\n' \
      "$(openssl rand -hex 24)" "$(openssl rand -hex 24)" "$(openssl rand -hex 32)" \
      > "$runtime_dir/.env"
  fi
  chmod 600 "$runtime_dir/.env"
  cd "$runtime_dir"
  docker compose --env-file .env --env-file release.env config --quiet
  docker compose --env-file .env --env-file release.env up -d --wait app
  if [[ -f "$runtime_dir/active-release.env" ]] && ! cmp -s release.env active-release.env; then
    cp active-release.env previous-release.env
  fi
  cp release.env active-release.env
  printf 'Deployed %s as %s in new-api-release\n' "$APP_IMAGE" "$APP_CONTAINER_NAME"
fi
