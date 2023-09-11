@load base/frameworks/notice

redef exit_only_after_terminate = T;

export {
    redef enum Notice::Type += {
        Notice::Test,
    };

    redef Notice::telegram_token = "xxx";
    redef Notice::telegram_chat_id = "-123";
}

event zeek_init()
    {
    NOTICE([$note=Notice::Test, $msg="Test notice"]);
    }

hook Notice::policy(n: Notice::Info)
    {
    if ( n$note == Notice::Test )
        {
        add n$actions[Notice::ACTION_TELEGRAM];
        }
    }

hook Notice::telegram_notice_succeeded(n: Notice::Info, body: Notice::TelegramAPIResponse)
    {
    print "Test script success hook:", n$note, body;
    terminate();
    }

hook Notice::telegram_notice_network_error(n: Notice::Info, error: string)
    {
    print "Test script network error hook:", n$note, error;
    terminate();
    return F;
    }

hook Notice::telegram_notice_api_error(n: Notice::Info, body: Notice::TelegramAPIResponse)
    {
    print "Test script api error hook:", n$note, body;
    terminate();
    return F;
    }

