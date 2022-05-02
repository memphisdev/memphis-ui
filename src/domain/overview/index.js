// Copyright 2021-2022 The Memphis Authors
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import './style.scss';

import React, { useEffect, useContext, useState, useRef } from 'react';

import FailedFactories from './failedFactories';
import GenericDetails from './genericDetails';
import SysComponents from './sysComponents';
import Throughput from './throughput';
import Resources from './resources';
import { useMediaQuery } from 'react-responsive';
import { Context } from '../../hooks/store';

import Button from '../../components/button';
import CreateStationDetails from '../../components/createStationDetails';
import Modal from '../../components/modal';
import { LOCAL_STORAGE_ALREADY_LOGGED_IN, LOCAL_STORAGE_AVATAR_ID, LOCAL_STORAGE_USER_NAME } from '../../const/localStorageConsts';

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
    const createStationRef = useRef(null);
    const [botUrl, SetBotUrl] = useState(require('../../assets/images/bots/1.svg'));
    useEffect(() => {
        dispatch({ type: 'SET_ROUTE', payload: 'overview' });
        setBotImage(state?.userData?.avatar_id || localStorage.getItem(LOCAL_STORAGE_AVATAR_ID));
    }, []);

    const setBotImage = (botId) => {
        SetBotUrl(require(`../../assets/images/bots/${botId}.svg`));
    };

    return (
        <div className="overview-container">
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
                            <p className="ok-status">You’re a memphis superhero! All looks good!</p>
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
                        <Throughput />
                        <FailedFactories />
                    </div>
                    <div className="right-side">
                        <Resources />
                        <SysComponents />
                    </div>
                </div>
            </div>
            <Modal
                header="Your station details"
                minHeight="590px"
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
        </div>
    );
}

export default OverView;
