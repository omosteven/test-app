import store from "../../../store/store";
import { pushAuthUser } from "../../../store/auth/actions";
import { setAccessToken, storeUserAuth } from "storage/sessionStorage";

const pushToDashboard = (LoginResponse) => {
    const { userToken, thirdUser } = LoginResponse;
    userToken && setAccessToken(userToken);
    store.dispatch(pushAuthUser(thirdUser));
    storeUserAuth(thirdUser);
};

export default pushToDashboard;
