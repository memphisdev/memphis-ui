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

import './style.scss';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

import overviewIconActive from '../../assets/images/overviewIconActive.svg';
import factoriesIconActive from '../../assets/images/factoriesIconActive.svg';
import usersIconActive from '../../assets/images/usersIconActive.svg';
import overviewIcon from '../../assets/images/overviewIcon.svg';
import factoriesIcon from '../../assets/images/factoriesIcon.svg';
import supportIcon from '../../assets/images/supportIcon.svg';
import accountIcon from '../../assets/images/accountIcon.svg';
import logoutIcon from '../../assets/images/logoutIcon.svg';
import usersIcon from '../../assets/images/usersIcon.svg';
import Logo from '../../assets/images/logo.svg';
import BetaLogo from '../../assets/images/betaLogo.svg';
import { Context } from '../../hooks/store';
import pathDomains from '../../router';
import AuthService from '../../services/auth';
import { LOCAL_STORAGE_AVATAR_ID, LOCAL_STORAGE_COMPANY_LOGO, LOCAL_STORAGE_USER_NAME } from '../../const/localStorageConsts';
import { httpRequest } from '../../services/http';
import { ApiEndpoints } from '../../const/apiEndpoints';
import { DOC_URL } from '../../config';

const { SubMenu } = Menu;

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 850 });
    return isDesktop ? children : null;
};

function SideBar() {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
    const [botUrl, SetBotUrl] = useState(require('../../assets/images/bots/1.svg'));
    const [systemVersion, setSystemVersion] = useState('');

    const getCompanyLogo = useCallback(async () => {
        try {
            const data = await httpRequest('GET', ApiEndpoints.GET_COMPANY_LOGO);
            if (data) {
                localStorage.setItem(LOCAL_STORAGE_COMPANY_LOGO, data.image);
                dispatch({ type: 'SET_COMPANY_LOGO', payload: data.image });
            }
        } catch (error) {}
    }, []);

    const getSystemVersion = useCallback(async () => {
        try {
            const data = await httpRequest('GET', ApiEndpoints.GET_CLUSTER_INFO);
            if (data) {
                setSystemVersion(data.version);
            }
        } catch (error) {}
    }, []);

    useEffect(() => {
        getCompanyLogo().catch(console.error);
        getSystemVersion().catch(console.error);
    }, []);

    useEffect(() => {
        setBotImage(state?.userData?.avatar_id || localStorage.getItem(LOCAL_STORAGE_AVATAR_ID));
    }, [state]);

    const setBotImage = (botId) => {
        SetBotUrl(require(`../../assets/images/bots/${botId}.svg`));
    };

    const handleClick = async (e) => {
        switch (e.key) {
            case '1':
                history.push(pathDomains.settings);
                break;
            case '2':
                break;
            case '3':
                await AuthService.logout();
                break;
            default:
                break;
        }
    };

    return (
        <div className="sidebar-container">
            <div className="upper-icons">
                <Link to={pathDomains.overview}>
                    <img src={BetaLogo} width="55" height="40" className="logoimg" alt="logo" />
                </Link>
                <div className="item-wrapper">
                    <Link to={pathDomains.overview}>
                        <div className="icon">
                            <div className={state.route === 'overview' ? 'circle-nav-item checked' : 'circle-nav-item'}>
                                {state.route === 'overview' ? (
                                    <img src={overviewIconActive} alt="overviewIconActive" width="20" height="20"></img>
                                ) : (
                                    <img src={overviewIcon} alt="overviewIcon" width="20" height="20"></img>
                                )}
                            </div>
                        </div>
                        <p className={state.route === 'overview' ? 'checked' : 'name'}>Overview</p>
                    </Link>
                </div>
                <div className="item-wrapper">
                    <div id="e2e-tests-factory-sidebar">
                        <Link to={pathDomains.factoriesList}>
                            <div className="icon">
                                <div className={state.route === 'factories' ? 'circle-nav-item checked' : 'circle-nav-item'}>
                                    {state.route === 'factories' ? (
                                        <img src={factoriesIconActive} alt="factoriesIconActive" width="20" height="20"></img>
                                    ) : (
                                        <img src={factoriesIcon} alt="factoriesIcon" width="20" height="20"></img>
                                    )}
                                </div>
                            </div>
                            <p className={state.route === 'factories' ? 'checked' : 'name'}>Factories</p>
                        </Link>
                    </div>
                </div>

                <div className="item-wrapper">
                    <div id="e2e-tests-users-sidebar">
                        <Link to={pathDomains.users}>
                            <div className="icon">
                                <div className={state.route === 'users' ? 'circle-nav-item checked' : 'circle-nav-item'}>
                                    {state.route === 'users' ? (
                                        <img src={usersIconActive} alt="usersIconActive" width="20" height="20"></img>
                                    ) : (
                                        <img src={usersIcon} alt="usersIcon" width="20" height="20"></img>
                                    )}
                                </div>
                            </div>
                            <p className={state.route === 'users' ? 'checked' : 'name'}>Users</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div id="e2e-tests-settings-btn" className="bottom-icons">
                <Menu onClick={handleClick} className="app-menu" mode="vertical" triggerSubMenuAction="click">
                    <SubMenu
                        key="subMenu"
                        icon={
                            <div className="sub-icon-wrapper">
                                <img
                                    className="sandboxUserImg"
                                    src={localStorage.getItem('profile_pic') || botUrl} // profile_pic is available only in sandbox env
                                    referrerPolicy="no-referrer"
                                    width={localStorage.getItem('profile_pic') ? 35 : 25}
                                    height={localStorage.getItem('profile_pic') ? 35 : 25}
                                    alt="bot"
                                ></img>
                            </div>
                        }
                    >
                        <Menu.ItemGroup
                            title={
                                <div className="header-menu">
                                    <div className="company-logo">
                                        <img className="logoimg" src={state?.companyLogo || Logo} width="30" height="30" alt="companyLogo" />
                                    </div>
                                    <p>{localStorage.getItem(LOCAL_STORAGE_USER_NAME)}</p>
                                </div>
                            }
                        >
                            <Menu.Item key={1} className="customclass">
                                <div className="item-wrapp">
                                    <img src={accountIcon} width="15" height="15" alt="accountIcon" />
                                    <p>Preferences</p>
                                </div>
                            </Menu.Item>
                            <Menu.Item key={2}>
                                <Link to={{ pathname: DOC_URL }} target="_blank">
                                    <div className="item-wrapp">
                                        <img src={supportIcon} width="15" height="15" alt="supportIcon" />
                                        <p>Support</p>
                                    </div>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key={3}>
                                <div className="item-wrapp">
                                    <img src={logoutIcon} width="15" height="15" alt="logoutIcon" />
                                    <p>Log out</p>
                                </div>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                </Menu>
                <div className="system-version">
                    <p>v{systemVersion}</p>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
