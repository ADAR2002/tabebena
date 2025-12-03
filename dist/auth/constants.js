"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.JWT_REFRESH_EXPIRES_IN = exports.JWT_REFRESH_SECRET = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.JWT_EXPIRES_IN = '24h';
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
exports.JWT_REFRESH_EXPIRES_IN = '7d';
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["DOCTOR"] = "DOCTOR";
    Role["PATIENT"] = "PATIENT";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=constants.js.map