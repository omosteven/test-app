import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { retriveAccessToken } from "storage/cookieStorage";
import { getUserAuth } from "storage/localStorage";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated =
        retriveAccessToken() ||
        window.location.pathname === "/direct" ||
        window.location.pathname === "/link" ||
        window.location.search?.includes?.("token") ||
        getUserAuth();

    const {
        chatSettings: { workspaceSlug },
    } = useSelector((state) => state.chat);

    return (
        <Route {...rest}>
            {isAuthenticated ? (
                <Component />
            ) : (
                <Redirect
                    to={{
                        pathname: `/?workspaceSlug=${workspaceSlug}`,
                        state: { referrer: rest.location.pathname },
                    }}
                />
            )}
        </Route>
    );
};

export default withRouter(ProtectedRoute);
