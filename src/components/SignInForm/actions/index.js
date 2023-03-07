import store from "../../../store/store";
import { pushAuthUser } from "../../../store/auth/actions";
import { setAccessToken } from "storage/cookieStorage";
import { storeUserAuth } from "storage/localStorage";

const pushToDashboard = (LoginResponse) => {
    const { userToken, thirdUser } = LoginResponse;
    setAccessToken(userToken);
    store.dispatch(pushAuthUser(thirdUser));
    storeUserAuth(thirdUser);
};

export default pushToDashboard;
