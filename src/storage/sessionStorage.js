export const loadState = async () => {
    try {
        const serializedState = await sessionStorage.getItem("state");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem("state", serializedState);
    } catch {
        // ignore write errors
    }
};

export const retriveAccessToken = () => {
    try {
        const serializedState = sessionStorage.getItem("accessToken");
        if (serializedState === null) {
            return undefined;
        }
        return serializedState;
    } catch (err) {
        return undefined;
    }
};

export const retriveRefreshToken = () => {
    try {
        const serializedState = sessionStorage["refreshToken"];
        if (serializedState === null) {
            return undefined;
        }
        return serializedState;
    } catch (err) {
        return undefined;
    }
};
