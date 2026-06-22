#!/bin/zsh

set -u

PROJECT_DIR="${0:A:h}"
PORT="${DOD_PORT:-4173}"
HOST="127.0.0.1"
URL="http://${HOST}:${PORT}/dodperoformance.main/ECG/"
STATE_DIR="${TMPDIR:-/tmp}/dodperformance-local-${PORT}"
PID_FILE="${STATE_DIR}/server.pid"
LOG_FILE="${STATE_DIR}/server.log"

mkdir -p "${STATE_DIR}"
STARTED_HERE=0

server_is_ready() {
  curl -fsS --max-time 2 "${URL}" 2>/dev/null | grep -q "Leitura estruturada de ECG"
}

listener_pid() {
  lsof -nP -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null | head -n 1
}

if server_is_ready; then
  EXISTING_PID="$(listener_pid)"
  if [[ -n "${EXISTING_PID}" ]]; then
    echo "${EXISTING_PID}" > "${PID_FILE}"
  fi
  echo "DOD Performance já está no ar."
else
  OCCUPIED_PID="$(listener_pid)"
  if [[ -n "${OCCUPIED_PID}" ]]; then
    echo "A porta ${PORT} está sendo usada por outro programa."
    echo "Feche esse programa ou altere a porta antes de abrir a DOD Performance."
    exit 1
  fi

  cd "${PROJECT_DIR}" || exit 1
  python3 -m http.server "${PORT}" --bind "${HOST}" > "${LOG_FILE}" 2>&1 &
  SERVER_PID=$!
  STARTED_HERE=1
  echo "${SERVER_PID}" > "${PID_FILE}"

  READY=0
  for _ in {1..30}; do
    if server_is_ready; then
      READY=1
      break
    fi
    sleep 0.2
  done

  if [[ "${READY}" -ne 1 ]]; then
    echo "O servidor não iniciou. Consulte o registro em: ${LOG_FILE}"
    exit 1
  fi

  echo "Servidor DOD iniciado com segurança."
fi

if [[ "${DOD_NO_OPEN:-0}" != "1" ]]; then
  open "${URL}"
  echo "ECG aberto no navegador padrão."
fi

echo "Endereço: ${URL}"

if [[ "${STARTED_HERE}" -eq 1 && "${DOD_DETACH:-0}" != "1" ]]; then
  echo "Mantenha esta janela aberta enquanto usar o projeto."
  echo "Para encerrar, execute 'Parar DOD.command' ou feche esta janela."
  wait "${SERVER_PID}"
  rm -f "${PID_FILE}"
fi
