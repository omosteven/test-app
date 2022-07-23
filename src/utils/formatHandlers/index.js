export const dataQueryStatus = Object.freeze({
  IDLE: "IDLE",
  SUCCESS: "SUCCESS",
  LOADING: "LOADING",
  ERROR: "ERROR",
  DATAMODE: "DATAMODE",
  NULLMODE: "NULLMODE",
  BREADCRUMBS: "BREADCRUMBS",
});

export const session = {
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, String(value));
    } catch (err) {}
  },
  get: (key) => {
    try {
      return sessionStorage.getItem(key) || undefined;
    } catch (err) {
      return undefined;
    }
  },
  setObject: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {}
  },
  getObject: (key) => {
    try {
      const state = sessionStorage.getItem(key);
      if (state === null) {
        return undefined;
      }
      return JSON.parse(state);
    } catch (err) {
      return undefined;
    }
  },
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (err) {}
  },
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {}
  },
};

export const IsAnEmptyObject = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const maskEmail = (email) => {
  if (!email) return;
  email = String(email)?.split("@");
  let maskedEmail = [];
  let finalMaskedEmail = "";
  //loop through and mask all leaving only the first 2 characters of the email address
  for (let index = 0; index < email[0].length; index++) {
    if (index < 3) maskedEmail.push(email[0][index]);
    else maskedEmail.push("*");
  }
  //convert the array into a string
  maskedEmail.forEach((element) => {
    finalMaskedEmail += element;
  });
  return `${finalMaskedEmail}@${email[1]}`;
};

export const generateActions = (action) => {
  action = action.toUpperCase();
  return {
    REQUEST: `${action}_REQUEST`,
    SUCCESS: `${action}_SUCCESS`,
    FAILURE: `${action}_FAILURE`,
  };
};

export const validateSize = (doc, maxSize = 2) => {
  const size = doc?.size / 1018576;
  return size > maxSize ? false : true;
};

export const dataUrlToFile = async (dataUrl, fileName) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], `${fileName}.png`, { type: "image/png" });
};

export const createImgFromText = async (text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  ctx.font = "bold 60px Gelion";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(text, 50, 70);

  ctx.globalCompositeOperation = "destination-over";
  ctx.beginPath();
  ctx.rect(0, 0, 100, 100);
  ctx.fillStyle = "#696d8c";
  ctx.fill();
  return canvas.toDataURL();
};
