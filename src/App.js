// Copyright 2021-2022 The Memphis Authors
// Licensed under the GNU General Public License v3.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// https://www.gnu.org/licenses/gpl-3.0.en.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import './App.scss';

import { Switch, Route, withRouter } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import React, { useContext, useEffect, useState } from 'react';

import StationOverview from './domain/stationOverview';
import FactoriesList from './domain/factoriesList';
import AppWrapper from './components/appWrapper';
import StationsList from './domain/stationsList';
import SysLogs from './domain/sysLogs';
import PrivateRoute from './PrivateRoute';
import Overview from './domain/overview';
import Settings from './domain/settings';
import pathDomains from './router';
import Users from './domain/users';
import Login from './domain/login';
import { Redirect } from 'react-router-dom';
import { handleRefreshTokenRequest } from './services/http';
import { LOCAL_STORAGE_TOKEN } from './const/localStorageConsts';
import { useHistory } from 'react-router-dom';
import { HANDLE_REFRESH_INTERVAL, SOCKET_URL } from './config';
import io from 'socket.io-client';
import { Context } from './hooks/store';
import SandboxLogin from './domain/sandboxLogin';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 850 });
    return isDesktop ? children : null;
};

const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 849 });
    return isMobile ? children : null;
};

const App = withRouter(() => {
    const [authCheck, setAuthCheck] = useState(true);
    const [state, dispatch] = useContext(Context);

    const history = useHistory();

    useEffect(async () => {
        await handleRefresh(true);
        setAuthCheck(false);

        const interval = setInterval(() => {
            handleRefresh(false);
        }, HANDLE_REFRESH_INTERVAL);

        return () => {
            clearInterval(interval);
            state.socket?.close();
        };
    }, []);

    const handleRefresh = async (firstTime) => {
        if (window.location.pathname === pathDomains.login) {
            return;
        } else if (localStorage.getItem(LOCAL_STORAGE_TOKEN)) {
            const handleRefreshStatus = await handleRefreshTokenRequest();
            if (handleRefreshStatus) {
                if (firstTime) {
                    const socket = await io.connect(SOCKET_URL, {
                        path: '/api/socket.io',
                        query: {
                            authorization: localStorage.getItem(LOCAL_STORAGE_TOKEN)
                        },
                        reconnection: false
                    });
                    dispatch({ type: 'SET_SOCKET_DETAILS', payload: socket });
                }
                return true;
            }
        } else {
            history.push('/login');
        }
    };

    return (
        <div className="app-container">
            <div>
                {' '}
                {!authCheck && (
                    <Switch>
                        <Route exact path={pathDomains.login} component={process.env.REACT_APP_SANDBOX_ENV ? SandboxLogin : Login} />
                        <PrivateRoute
                            exact
                            path={pathDomains.overview}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <Overview />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            exact
                            path={pathDomains.users}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <Users />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            exact
                            path={pathDomains.settings}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <Settings />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            exact
                            path={pathDomains.factoriesList}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <FactoriesList />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            exact
                            path={`${pathDomains.factoriesList}/:id`}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <StationsList />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            exact
                            path={`${pathDomains.factoriesList}/:id/:id`}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <StationOverview />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            exact
                            path={`${pathDomains.sysLogs}`}
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <SysLogs />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <PrivateRoute
                            path="/"
                            component={
                                <AppWrapper
                                    content={
                                        <div>
                                            <Overview />
                                        </div>
                                    }
                                ></AppWrapper>
                            }
                        />
                        <Route>
                            <Redirect to={pathDomains.overview} />
                        </Route>
                    </Switch>
                )}
            </div>
        </div>
    );
});

export default App;
