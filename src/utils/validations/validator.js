import { validateSize } from "../formatHandlers";

const ValidateForm = (e, request, optionalFields = [], reqParamsObj = {}) => {
  let errors = {};
  let formisValid = true;
  request &&
    Object.keys(request).forEach((field) => {
      let target = e?.target?.[field];
      let label = target?.parentNode?.querySelector("label")?.innerHTML;
      if (!label) {
        document.querySelectorAll("label")?.forEach((item) => {
          if (item?.getAttribute("for") === field) {
            label = item?.innerHTML;
          }
        });
      }
      let optional = optionalFields?.find((item) => item === field);
      if (target && target.type === "file") {
        const fileSize = target?.getAttribute?.("data-size");
        const fileLabel = target?.getAttribute?.("data-label");
        const fileValue = target?.getAttribute?.("data-value");
        const file = target?.files?.[0];
        if (!validateSize(file, fileSize)) {
          errors[field] = `${fileLabel} must not be larger than ${fileSize}mb`;
          formisValid = false;
        } else if (!optional && !fileValue && !file) {
          errors[field] = `${fileLabel} is required`;
          formisValid = false;
        }
      } else if (target && target.value !== undefined) {
        const fieldType = target.getAttribute?.("data-field");
        let value = target.value;
        if (fieldType === "multiple") {
          if (!request?.[field]?.length && !optional) {
            errors[field] = `${label} is required`;
            formisValid = false;
          }
        } else if (!value && !optional) {
          errors[field] = `${label} is required`;
          formisValid = false;
        } else if (field === "email" || target.type === "email") {
          /* eslint-disable-next-line no-useless-escape */
          const regTest = /\S+@\S+\.\S+/.test(value);
          errors[field] = regTest ? false : `${label} is invalid`;
          if (regTest === false) {
            formisValid = false;
          }
          // formisValid should equal regTest anyway
        } else if (field === "confirmPassword") {
          const { password: { value: passwordVal = {} } = {} } = e.target || {};
          if (value !== passwordVal) {
            errors["confirmPassword"] = `Passwords do not match`;
            formisValid = false;
          }
        } else if (fieldType === "password") {
          const regTest =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
          errors[field] = regTest
            ? false
            : `${label} must be at least 8 characters, contain at least 1 number and at least 1 special character`;
          if (regTest === false) {
            formisValid = false;
          }
          // formisValid should equal regTest anyway
        }
      } else if (reqParamsObj?.[field]) {
        if (field === "richText" && request?.[field]?.length <= 1) {
          errors[field] = reqParamsObj?.[field];
          formisValid = false;
        }
        if (!request?.[field]?.length) {
          errors[field] = reqParamsObj?.[field];
          formisValid = false;
        }
      }
    });

  return {
    errors,
    formisValid,
  };
};

export default ValidateForm;
