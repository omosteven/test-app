import store from "../../../store/store";
import { pushAuthUser } from "../../../store/auth/actions";

const pushToDashboard = async (LoginResponse) => {
    const {
        userToken, thirdUser
    } = LoginResponse;
    await window.sessionStorage.setItem("accessToken", userToken);
    console.log(thirdUser)
    store.dispatch(pushAuthUser(thirdUser));
    // callBack();
};

export default pushToDashboard;
