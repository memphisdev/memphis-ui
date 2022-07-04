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

import React, { useEffect, useContext, useState, useRef } from 'react';

import { useMediaQuery } from 'react-responsive';
import FailedStations from './failedStations';
import GenericDetails from './genericDetails';
import SysComponents from './sysComponents';
import { Context } from '../../hooks/store';
import Throughput from './throughput';
import Resources from './resources';

import Button from '../../components/button';
import CreateStationDetails from '../../components/createStationDetails';
import Modal from '../../components/modal';
import {
    LOCAL_STORAGE_ALLOW_ANALYTICS,
    LOCAL_STORAGE_ALREADY_LOGGED_IN,
    LOCAL_STORAGE_AVATAR_ID,
    LOCAL_STORAGE_TOKEN,
    LOCAL_STORAGE_USER_NAME
} from '../../const/localStorageConsts';
import { PRIVACY_URL, SOCKET_URL } from '../../config';
import { ApiEndpoints } from '../../const/apiEndpoints';
import { httpRequest } from '../../services/http';
import Loader from '../../components/loader';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 850 });
    return isDesktop ? children : null;
};
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 849 });
    return isMobile ? children : null;
};

function OverView() {
    const [state, dispatch] = useContext(Context);
    const [open, modalFlip] = useState(false);
    const [analyticsModal, analyticsModalFlip] = useState(true);
    const createStationRef = useRef(null);
    const [botUrl, SetBotUrl] = useState(require('../../assets/images/bots/1.svg'));
    const [isLoading, setisLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const getOverviewData = async () => {
        setisLoading(true);
        try {
            const data = await httpRequest('GET', ApiEndpoints.GET_MAIN_OVERVIEW_DATA);
            data.stations?.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            dispatch({ type: 'SET_MONITOR_DATA', payload: data });
            setisLoading(false);
            setIsDataLoaded(true);
        } catch (error) {
            setisLoading(false);
        }
    };

    useEffect(() => {
        dispatch({ type: 'SET_ROUTE', payload: 'overview' });
        getOverviewData();
        setBotImage(state?.userData?.avatar_id || localStorage.getItem(LOCAL_STORAGE_AVATAR_ID));
        analyticsModalFlip(
            localStorage.getItem(LOCAL_STORAGE_ALREADY_LOGGED_IN) === 'false' && localStorage.getItem(LOCAL_STORAGE_ALLOW_ANALYTICS) === 'true' && state?.analytics_modal
        );
    }, []);

    useEffect(() => {
        state.socket?.on('main_overview_data', (data) => {
            data.stations?.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
            dispatch({ type: 'SET_MONITOR_DATA', payload: data });
        });

        setTimeout(() => {
            state.socket?.emit('register_main_overview_data');
            setisLoading(false);
        }, 1000);
        return () => {
            state.socket?.emit('deregister');
        };
    }, [state.socket]);

    const setBotImage = (botId) => {
        SetBotUrl(require(`../../assets/images/bots/${botId}.svg`));
    };

    const dontSendAnalytics = async () => {
        try {
            await httpRequest('PUT', `${ApiEndpoints.EDIT_ANALYTICS}`, { send_analytics: false });
            localStorage.setItem(LOCAL_STORAGE_ALLOW_ANALYTICS, false);
            analyticsModalFlip(false);
            dispatch({ type: 'ANALYTICS_MODAL', payload: false });
        } catch (err) {
            return;
        }
    };

    const sendAnalytics = () => {
        analyticsModalFlip(false);
        dispatch({ type: 'ANALYTICS_MODAL', payload: false });
    };

    return (
        <div className="overview-container">
            {isLoading && (
                <div className="loader-uploading">
                    <Loader />
                </div>
            )}
            {!isLoading && (
                <div className="overview-wrapper">
                    <div className="header">
                        <div className="header-welcome">
                            <div className="bot-wrapper">
                                <img src={botUrl} width={40} height={40} alt="bot"></img>
                            </div>
                            <div className="dynamic-sentences">
                                {localStorage.getItem(LOCAL_STORAGE_ALREADY_LOGGED_IN) === 'true' ? (
                                    <h1>Welcome Back, {localStorage.getItem(LOCAL_STORAGE_USER_NAME)}</h1>
                                ) : (
                                    <h1>Welcome Aboard, {localStorage.getItem(LOCAL_STORAGE_USER_NAME)}</h1>
                                )}
                                {/* <p className="ok-status">You’re a memphis superhero! All looks good!</p> */}
                            </div>
                        </div>
                        <Button
                            className="modal-btn"
                            width="160px"
                            height="36px"
                            placeholder={'Create new station'}
                            colorType="white"
                            radiusType="circle"
                            backgroundColorType="purple"
                            fontSize="14px"
                            fontWeight="600"
                            aria-haspopup="true"
                            onClick={() => modalFlip(true)}
                        />
                    </div>
                    <div className="overview-components">
                        <div className="left-side">
                            <GenericDetails />
                            <FailedStations />
                            <Throughput />
                        </div>
                        <div className="right-side">
                            <Resources />
                            <SysComponents />
                        </div>
                    </div>
                </div>
            )}
            <Modal
                header="Your station details"
                minHeight="610px"
                minWidth="500px"
                rBtnText="Add"
                lBtnText="Cancel"
                closeAction={() => modalFlip(false)}
                lBtnClick={() => {
                    modalFlip(false);
                }}
                clickOutside={() => modalFlip(false)}
                rBtnClick={() => {
                    createStationRef.current();
                }}
                open={open}
            >
                <CreateStationDetails chooseFactoryField={true} createStationRef={createStationRef} />
            </Modal>
            <Modal
                header="Memphis Analytics"
                height="260px"
                minWidth="460px"
                rBtnText="Send"
                lBtnText="Don't send"
                closeAction={() => sendAnalytics()}
                lBtnClick={() => dontSendAnalytics()}
                clickOutside={() => sendAnalytics()}
                rBtnClick={() => sendAnalytics()}
                open={analyticsModal}
            >
                <label>As Memphis is in beta mode, we are collecting anonymous metadata to help improve its superpowers.</label>
                <br />
                <br />
                <label>
                    More details you can find{' '}
                    <a to={{ pathname: PRIVACY_URL }} target="_blank">
                        here
                    </a>
                    .
                </label>
            </Modal>
        </div>
    );
}

export default OverView;
