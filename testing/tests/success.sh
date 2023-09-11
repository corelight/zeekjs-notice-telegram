# @TEST-DOC: mock up a successful request to the telegram API
# @TEST-PORT: ZEEK_MOCK_PORT
# @TEST-EXEC: btest-bg-run api "MOCK_PORT=$(echo ${ZEEK_MOCK_PORT} | sed 's|/tcp||') zeek ${SCRIPTS}/mock_server.js > server.out"
# @TEST-EXEC: MOCK_PORT=$(echo ${ZEEK_MOCK_PORT} | sed 's|/tcp||') NODE_EXTRA_CA_CERTS=${ETC}/ca.pem TELEGRAM_ENDPOINT="https://localhost:${MOCK_PORT}/bot" zeek $PACKAGE ${SCRIPTS}/mock_client.zeek > client.out
# @TEST-EXEC: btest-bg-wait 10
# @TEST-EXEC: btest-diff client.out
# @TEST-EXEC: btest-diff api/server.out
