import React from "react";
import { Redirect, Route } from "react-router-dom";
import { retriveAccessToken } from "../../storage/sessionStorage";

const authRedirectPath = '/chat';

const PublicRoute = ({ component: Component, ...rest }) => {

    const isAuthenticated = retriveAccessToken();

    return (
        <Route {...rest}>
            {
                isAuthenticated ?
                    <Redirect
                        to={{
                            pathname: authRedirectPath,
                            // state: { from: props.location },
                        }}
                    /> :
                    <Component {...rest} />
            }
        </Route>
    )
};

export default PublicRoute;
