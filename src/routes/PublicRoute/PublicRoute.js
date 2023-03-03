import React from "react";
import { Redirect, Route } from "react-router-dom";
import { retriveAccessToken } from "storage/cookieStorage";
import { useSelector } from "react-redux";
const authRedirectPath = "/chat";

const PublicRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = retriveAccessToken();

    const {
        chatSettings: { workspaceSlug },
    } = useSelector((state) => state.chat);

    return (
        <Route {...rest}>
            {isAuthenticated ? (
                <Redirect
                    to={{
                        pathname: `${authRedirectPath}?workspaceSlug=${workspaceSlug}`,
                        // state: { from: props.location },
                    }}
                />
            ) : (
                <Component {...rest} />
            )}
        </Route>
    );
};

export default PublicRoute;
