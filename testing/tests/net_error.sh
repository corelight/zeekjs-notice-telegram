# @TEST-DOC: mock up a request to the telegram API that returns a socket error (unknown host)
# @TEST-EXEC: TELEGRAM_ENDPOINT="https://ahFiSoqu0oht" zeek $PACKAGE ${SCRIPTS}/mock_client.zeek > client.out
# @TEST-EXEC: btest-diff client.out
