import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import { retriveAccessToken } from "../../storage/sessionStorage";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated =
        retriveAccessToken() ||
        window.location.pathname === "/direct" ||
        window.location.search?.includes?.("token");

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
