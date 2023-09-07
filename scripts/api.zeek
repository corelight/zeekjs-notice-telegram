# Defines the API required by the implementation in telegram.ts (transpiled to telegram.js).

@load base/frameworks/notice

module Notice;

export {
    redef enum Action += {
        ACTION_TELEGRAM,
    };

    type TelegramAPIResponse: record {
        statusCode: count;
        responseObject: table[string] of string;
    };

    option telegram_token = "REDEF-TOKEN";
    option telegram_chat_id = "REDEF-ID";

    global Notice::telegram_notice_succeeded: hook(n: Notice::Info, body: Notice::TelegramAPIResponse);
    global Notice::telegram_notice_network_error: hook(n: Notice::Info, error: string);
    global Notice::telegram_notice_api_error: hook(n: Notice::Info, body: Notice::TelegramAPIResponse);
}
