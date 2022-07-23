import store from "../../../store/store";
import { pushAuthUser } from "../../../store/auth/actions";

const pushToDashboard = (LoginResponse, callBack) => {
    const {
        userToken, thirdUser
    } = LoginResponse;
    window.sessionStorage.setItem("accessToken", userToken);
    store.dispatch(pushAuthUser(thirdUser));
    callBack();
};

export default pushToDashboard;
