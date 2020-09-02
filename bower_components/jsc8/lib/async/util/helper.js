"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFullStreamPath(topic, extraUrl) {
    const baseUrl = `/streams/${topic}`;
    const path = extraUrl ? `${baseUrl}${extraUrl}` : baseUrl;
    return path;
}
exports.getFullStreamPath = getFullStreamPath;
function getDCListString(response) {
    const dcList = response.reduce((acc, elem, index) => {
        if (index > 0)
            return `${acc},${elem.name}`;
        return elem.name;
    }, "");
    return dcList;
}
exports.getDCListString = getDCListString;
//# sourceMappingURL=helper.js.map