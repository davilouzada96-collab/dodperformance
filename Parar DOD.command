#!/bin/zsh

set -u

PORT="${DOD_PORT:-4173}"
STATE_DIR="${TMPDIR:-/tmp}/dodperformance-local-${PORT}"
PID_FILE="${STATE_DIR}/server.pid"

if [[ ! -f "${PID_FILE}" ]]; then
  echo "Nenhum servidor iniciado pelo atalho foi encontrado."
  exit 0
fi

SERVER_PID="$(tr -cd '0-9' < "${PID_FILE}")"
if [[ -z "${SERVER_PID}" ]]; then
  rm -f "${PID_FILE}"
  echo "O registro do servidor estava vazio e foi removido."
  exit 0
fi

COMMAND="$(ps -p "${SERVER_PID}" -o command= 2>/dev/null || true)"
LISTENING="$(lsof -nP -a -p "${SERVER_PID}" -iTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)"

if [[ "${COMMAND}" == *"-m http.server ${PORT}"* && -n "${LISTENING}" ]]; then
  kill "${SERVER_PID}"
  for _ in {1..20}; do
    if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
      break
    fi
    sleep 0.1
  done
  echo "Servidor DOD encerrado."
else
  echo "O processo registrado não é o servidor DOD. Nada foi encerrado."
fi

rm -f "${PID_FILE}"
