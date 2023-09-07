/* Send notices to a Telegram user or group */
'use strict';
import assert from 'node:assert';
import fs from "fs";
const https = require('https');
const querystring = require('querystring');
const telegram_endpoint = process.env.TELEGRAM_ENDPOINT || "https://api.telegram.org/bot";
// This is for testing only: zeekjs embeds node in a way that prevents
// NODE_EXTRA_CA_CERTS from being applied, so we do it manually.
if (process.env.NODE_EXTRA_CA_CERTS) {
    https.globalAgent.options.ca = fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS, 'ascii');
}
/** Class representing a Telegram API response. */
class TelegramAPIResponse {
    /**
     * Construct a TelegramAPIResponse
     * @param statusCode {number} the HTTP response status code.
     * @param responseJSON {string} the JSON body received from the API.
     */
    constructor(statusCode, responseJSON) {
        this.statusCode = statusCode;
        this.responseObject = {};
        // This allows any response to fit into a zeek "table[string] of string" type.
        let temp = zeek.flatten(JSON.parse(responseJSON));
        Object.keys(temp).forEach((k) => {
            this.responseObject[k] = JSON.stringify(temp[k]);
        });
    }
}
/**
 * Render the number of bytes in human-friendly units.
 * @param sz {number|BigInt}
 * @returns {string}
 */
function humanFileSize(sz) {
    // Adapted from: https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
    let size = Number(sz); // convert in case we're passed a BigInt
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
/**
 * Create the message destined for Telegram from a zeek Notice::Info.
 * @param notice {zeektypes.Notice_Info} The Notice::Info object.
 * @returns {string}
 */
function makeMessage(notice) {
    // Adapted from: https://github.com/pgaulon/zeekjs-notice-slack/blob/79b13c6ce76875d42f3366dd3de68d0f8ce13a68/notice-slack.js#L9
    let note = notice.note.replace(/^Notice::/, "");
    let text = `<b>${note}:</b> ${notice.msg}`;
    if (notice.sub) {
        text += `, (${notice.sub})`;
    }
    text += `\n`;
    if (notice.uid) {
        text += `<b>Connection uid:</b> ${notice.uid}\n`;
    }
    if (notice.conn) {
        if (notice.conn.start_time) {
            let ts = new Date(Number(notice.conn.start_time) * 1000).toISOString();
            text += `<b>Start time:</b> ${ts}\n`;
        }
        if (notice.conn.duration) {
            let dur = new Date(Number(notice.conn.duration) * 1000).toISOString().slice(11).slice(0, -1);
            text += `<b>Duration:</b> ${dur}\n`;
        }
        if (notice.conn.orig.size && notice.conn.resp.size) {
            let vo = humanFileSize(notice.conn.orig.size);
            let vr = humanFileSize(notice.conn.resp.size);
            text += `<b>Size:</b> ${vo} + ${vr}\n`;
        }
    }
    if (notice.id && notice.id.orig_h && notice.id.orig_p && notice.id.resp_h && notice.id.resp_p) {
        let orig_p = JSON.stringify(notice.id.orig_p);
        let resp_p = JSON.stringify(notice.id.resp_p);
        text += `<b>Connection:</b> `;
        if (notice.conn) {
            if (notice.conn.service) {
                text += JSON.stringify(notice.conn.service) + ` `;
            }
        }
        text += `${notice.id.orig_h}:${orig_p} -> ${notice.id.resp_h}:${resp_p}\n`;
    }
    else if (notice.src) {
        text += `<b>Source:</b> ${notice.src}\n`;
    }
    return text;
}
/**
 * Asynchronously send a message to Telegram (with HTML parse_mode).
 * Note on hooks (defined in api.zeek):
 *      - On success we call Notice::telegram_notice_succeeded (unhandled by default)
 *      - On API error we call Notice::telegram_notice_api_error (default hook provided)
 *      - On network error we call Notice::telegram_notice_api_error (default hook provided)
 * @param notice {Object} The Notice::Type object to send.
 */
function sendTelegramNotice(notice) {
    if (zeek.global_vars['Notice::telegram_token'] === 'REDEF-TOKEN' || zeek.global_vars['Notice::telegram_chat_id'] === 'REDEF-ID') {
        zeek.invoke('Reporter::warning', ["Notice::telegram_token and Notice::telegram_chat_id must be redef'd to use Notice::ACTION_TELEGRAM"]);
        return;
    }
    // Build the Telegram bot URL
    let url = telegram_endpoint + zeek.global_vars['Notice::telegram_token'] + '/sendMessage?' + querystring.stringify({
        chat_id: zeek.global_vars['Notice::telegram_chat_id'], text: makeMessage(notice), parse_mode: 'HTML'
    });
    // Do the HTTPS GET request
    https.get(url, (response) => {
        let body = '';
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            try {
                let resp = new TelegramAPIResponse(response.statusCode, body);
                if (response.statusCode !== 200) {
                    zeek.invoke('Notice::telegram_notice_api_error', [notice, resp]);
                }
                else {
                    zeek.invoke('Notice::telegram_notice_succeeded', [notice, resp]);
                }
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    zeek.invoke('Notice::telegram_notice_network_error', [notice, e.message]);
                }
                else {
                    throw e;
                }
            }
        });
    }).on('error', (e) => {
        zeek.invoke('Notice::telegram_notice_network_error', [notice, e.message]);
    });
}
// Generate a JS exception if api.zeek has not been parsed.
zeek.on('zeek_init', function () {
    assert.ok(zeek.global_vars['Notice::telegram_token'] != undefined, 'Notice::telegram_token undefined!');
    assert.ok(zeek.global_vars['Notice::telegram_chat_id'] != undefined, 'Notice::telegram_chat_id undefined!');
});
/* Default API error hook that generates a Reporter::error.
 * Override by defining a higher priority hook that returns false. */
zeek.hook('Notice::telegram_notice_api_error', { priority: -1 }, function (n, e) {
    zeek.invoke('Reporter::error', ["Notice::ACTION_TELEGRAM hook failed with an API error: " + e]);
});
/* Default network error hook that generates a Reporter::error.
 * Override by defining a higher priority hook that returns false. */
zeek.hook('Notice::telegram_notice_network_error', { priority: -1 }, function (n, e) {
    zeek.invoke('Reporter::error', ["Notice::ACTION_TELEGRAM hook failed with a network error: " + e]);
});
/* Hook the Notice framework and send a Telegram message for notices that have the Notice::ACTION_TELEGRAM action.
 * Note: we never return false so that failures don't impact other notice handing, instead we provide hooks for
 *       handling errors (see above) that are called by sendTelegramNotice().
 */
zeek.hook('Notice::notice', { priority: 0 }, function (n) {
    if (!n.actions.includes('Notice::ACTION_TELEGRAM')) {
        return true;
    }
    sendTelegramNotice(n);
    return true;
});
