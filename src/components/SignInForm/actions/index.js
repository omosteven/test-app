import store from "../../../store/store";
import { pushAuthUser } from "../../../store/auth/actions";
import { setAccessToken } from "storage/cookieStorage";

const pushToDashboard = (LoginResponse) => {
    const { userToken, thirdUser } = LoginResponse;

    setAccessToken(userToken);
    store.dispatch(pushAuthUser(thirdUser));
};

export default pushToDashboard;
