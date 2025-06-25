"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = exports.nonEmptyEmailArray = void 0;
const joi_1 = __importDefault(require("joi"));
/* ---------- reusable pieces ---------- */
const emailField = joi_1.default.string()
    .email({ minDomainSegments: 2 })
    .messages({
    "string.empty": "Email is required.",
    "string.email": "Must be a valid email address.",
});
exports.nonEmptyEmailArray = joi_1.default.array()
    .items(emailField)
    .min(1) // ← ensure not empty
    .messages({
    "array.base": "Must be an array of e-mail addresses.",
    "array.min": "At least one e-mail address is required.",
});
const baseFields = {
    tokenAddress: joi_1.default.string().required().messages({
        "string.empty": "Token address is required.",
    }),
    amount: joi_1.default.number().required().messages({
        "number.base": "Amount must be a number.",
        "any.required": "Amount is required.",
    }),
    description: joi_1.default.string().required().max(50).messages({
        "string.empty": "Description is required.",
        "string.max": "Description must be at most 50 characters long.",
    }),
    recurrence: joi_1.default.string()
        .valid('weekly', 'monthly')
        .optional()
        .messages({
        "string.base": "Recurrence must be a string.",
        "any.only": "Recurrence must be either 'weekly' or 'monthly'.",
    }),
};
/* ---------- unified schema ---------- */
exports.orderSchema = joi_1.default.object(Object.assign(Object.assign({}, baseFields), { 
    /* main addresses */
    recipientEmail: emailField, payeeEmail: emailField, 
    /* optional copies, only if payeeEmail present */
    ccEmails: joi_1.default.alternatives().conditional("payeeEmail", {
        is: joi_1.default.exist(),
        then: exports.nonEmptyEmailArray,
        otherwise: joi_1.default.forbidden(),
    }), bccEmails: joi_1.default.alternatives().conditional("payeeEmail", {
        is: joi_1.default.exist(),
        then: exports.nonEmptyEmailArray,
        otherwise: joi_1.default.forbidden(),
    }) }))
    // one, but not both
    .xor("recipientEmail", "payeeEmail");
