#!/usr/bin/env bash
set -euo pipefail

test_root=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd "$test_root/.." && pwd)
run_id=${NPDEMO_QA_RUN_ID:-"local-$$"}
backend_log=$(mktemp)
backend_pid=
api_port=

cleanup() {
  if [[ -n "$backend_pid" ]]; then
    kill "$backend_pid" 2>/dev/null || true
    wait "$backend_pid" 2>/dev/null || true
  fi
  rm -f "$backend_log"
}
trap cleanup EXIT INT TERM

(
  cd "$repo_root/backend"
  exec mvn spring-boot:test-run \
    -Dspring-boot.run.arguments="--server.port=0 --spring.datasource.url=jdbc:h2:mem:npdemo_$$;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE --spring.datasource.username=sa --spring.datasource.password="
) >"$backend_log" 2>&1 &
backend_pid=$!

for _ in $(seq 1 60); do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    cat "$backend_log" >&2
    exit 1
  fi
  api_port=$(sed -n 's/.*Tomcat started on port \([0-9][0-9]*\).*/\1/p' "$backend_log" | tail -n 1)
  if [[ -n "$api_port" ]]; then
    break
  fi
  sleep 1
done

if [[ -z "$api_port" ]] || ! kill -0 "$backend_pid" 2>/dev/null; then
  cat "$backend_log" >&2
  exit 1
fi

api_base_url="http://127.0.0.1:${api_port}"
if ! curl --fail --silent "$api_base_url/api/health" >/dev/null; then
  cat "$backend_log" >&2
  exit 1
fi

NPDEMO_SKIP_WEBSERVER=1 \
NPDEMO_QA_DISPOSABLE_DB=1 \
NPDEMO_QA_RUN_ID="$run_id" \
NPDEMO_API_BASE_URL="$api_base_url" \
npm run test:course-draft
