"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.JWT_EXPIRES_IN = '24h';
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["DOCTOR"] = "DOCTOR";
    Role["PATIENT"] = "PATIENT";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=constants.js.map