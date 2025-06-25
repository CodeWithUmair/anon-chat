import Joi from "joi";

/* ---------- reusable pieces ---------- */
const emailField = Joi.string()
  .email({ minDomainSegments: 2 })
  .messages({
    "string.empty": "Email is required.",
    "string.email": "Must be a valid email address.",
  });

export const nonEmptyEmailArray = Joi.array()
  .items(emailField)
  .min(1)                                    // ← ensure not empty
  .messages({
    "array.base": "Must be an array of e-mail addresses.",
    "array.min": "At least one e-mail address is required.",
  });

const baseFields = {
  tokenAddress: Joi.string().required().messages({
    "string.empty": "Token address is required.",
  }),
  amount: Joi.number().required().messages({
    "number.base": "Amount must be a number.",
    "any.required": "Amount is required.",
  }),
  description: Joi.string().required().max(50).messages({
    "string.empty": "Description is required.",
    "string.max": "Description must be at most 50 characters long.",
  }),
  recurrence: Joi.string()
    .valid('weekly', 'monthly')
    .optional()
    .messages({
      "string.base": "Recurrence must be a string.",
      "any.only": "Recurrence must be either 'weekly' or 'monthly'.",
    }),
};

/* ---------- unified schema ---------- */
export const orderSchema = Joi.object({
  ...baseFields,

  /* main addresses */
  recipientEmail: emailField,
  payeeEmail: emailField,

  /* optional copies, only if payeeEmail present */
  ccEmails: Joi.alternatives().conditional("payeeEmail", {
    is: Joi.exist(),
    then: nonEmptyEmailArray,
    otherwise: Joi.forbidden(),
  }),
  bccEmails: Joi.alternatives().conditional("payeeEmail", {
    is: Joi.exist(),
    then: nonEmptyEmailArray,
    otherwise: Joi.forbidden(),
  }),
})
  // one, but not both
  .xor("recipientEmail", "payeeEmail");
