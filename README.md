# Zeek Notice Telegram (ZeekJS edition)
This package re-implements [zeek-notice-telegram](https://github.com/corelight/zeek-notice-telegram) in TypeScript (ZeekJS) to work
around [unreliability in ActiveHTTP](https://docs.zeek.org/en/master/scripting/javascript.html#preamble).

It borrows both Yacin's package above and the ZeekJS reimplementation of _that_ package's original inspiration
([zeek-notice-slack](https://github.com/pgaulon/zeek-notice-slack)) which is now
[zeekjs-notice-slack](https://github.com/pgaulon/zeekjs-notice-slack/).

## Code generation

Re-generating `scripts/telegram.js` from the TypeScript source can be done by
running `npm install && npm run build`.

## Example usage
Basic usage is identical to [zeek-notice-telegram](https://github.com/corelight/zeek-notice-telegram). To recap, one might use it like this:

```zeek
@load base/frameworks/notice

export {
    redef enum Notice::Type += {
        Notice::SSHLoginSuccessful,
    };

    // NOTE: you must define these!
    redef Notice::telegram_token = "xxx";
    redef Notice::telegram_chat_id = "yyy";
}

event ssh_auth_successful(c: connection, auth_method_none: bool)
    {
    NOTICE([$note=Notice::SSHLoginSuccessful, $conn=c, $msg="Login detected"]);
    }

hook Notice::policy(n: Notice::Info)
    {
    if ( n$note == Notice::SSHLoginSuccessful )
        {
        add n$actions[Notice::ACTION_TELEGRAM];
        }
    }
```

## Error handling
Failure to send a notice via telegram does not stop notice hook processing. Instead, zeek hooks are provided
to handle both error cases and (if desired) when messages are successfully sent:
- `Notice::telegram_notice_succeeded` when everything is OK;
- `Notice::telegram_notice_api_error` when the Telegram API itself response with an error;
- `Notice::telegram_notice_network_error` when something goes wrong communicating with the telegram API.

See the [btest case](testing/tests/mock.sh) for an example using these hooks.

## Testing
A [btest](https://github.com/zeek/btest) case mocks the Telegram API and exercises success and different error conditions.

To run tests, enter the `testing` directory and run `make`.
