"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const joinPath_1 = require("./joinPath");
const xhr_1 = require("./xhr");
const connection_1 = require("../connection");
exports.isBrowser = true;
function omit(obj, keys) {
    const result = {};
    for (const key of Object.keys(obj)) {
        if (keys.includes(key))
            continue;
        result[key] = obj[key];
    }
    return result;
}
function createRequest(baseUrl, agentOptions, fetch) {
    const baseUrlParts = url_1.parse(baseUrl);
    const options = omit(agentOptions, [
        "keepAlive",
        "keepAliveMsecs",
        "maxSockets",
    ]);
    return function request({ method, url, headers, body, expectBinary }, cb) {
        const urlParts = Object.assign({}, baseUrlParts, { pathname: url.pathname
                ? baseUrlParts.pathname
                    ? joinPath_1.joinPath(baseUrlParts.pathname, url.pathname)
                    : url.pathname
                : baseUrlParts.pathname, search: url.search
                ? baseUrlParts.search
                    ? `${baseUrlParts.search}&${url.search.slice(1)}`
                    : url.search
                : baseUrlParts.search });
        let callback = (err, res) => {
            callback = () => undefined;
            cb(err, res);
        };
        if (fetch) {
            const req = fetch(url_1.format(urlParts), Object.assign({}, options, { body,
                method,
                headers }))
                .then((res) => {
                const contentType = res.headers.get("content-type");
                // TODO: make it work for other content-types too
                // to make "fetch" a truly native agent in jsc8
                if (contentType.match(connection_1.MIME_JSON)) {
                    return res;
                }
                else {
                    throw res;
                }
            })
                .then((data) => {
                callback(null, data);
            })
                .catch((err) => {
                const error = {};
                error.request = req;
                if (err.status) {
                    error.status = err.status;
                }
                if (err.statusText) {
                    error.statusText = err.statusText;
                }
                callback(error);
            });
        }
        else {
            const req = xhr_1.default(Object.assign({ responseType: expectBinary ? "blob" : "text" }, options, { url: url_1.format(urlParts), useXDR: true, body,
                method,
                headers }), (err, res) => {
                if (!err) {
                    if (!res.body)
                        res.body = "";
                    callback(null, res);
                }
                else {
                    const error = err;
                    error.request = req;
                    callback(error);
                }
            });
        }
    };
}
exports.createRequest = createRequest;
//# sourceMappingURL=request.web.js.map