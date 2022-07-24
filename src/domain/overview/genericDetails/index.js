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

import React, { useContext, useEffect, useState } from 'react';

import stationIdleIcon from '../../../assets/images/stationIdleIcon.svg';
import liveMessagesIcon from '../../../assets/images/liveMessagesIcon.svg';
import stationActionIcon from '../../../assets/images/stationActionIcon.svg';
import comingSoonBox from '../../../assets/images/comingSoonBox.svg';
import { Context } from '../../../hooks/store';

const GenericDetails = () => {
    const [state, dispatch] = useContext(Context);

    return (
        <div className="generic-container">
            <div className="overview-wrapper data-box">
                {/* <div className="coming-soon-small">
                    <img src={comingSoonBox} width={25} height={45} />
                    <p>Coming soon</p>
                </div> */}
                <div className="icon-wrapper sta-act">
                    <img src={stationActionIcon} width={35} height={27} alt="stationActionIcon" />
                </div>
                <div className="data-wrapper">
                    <span>Total stations</span>
                    <p>{state?.monitor_data?.total_stations}</p>
                </div>
            </div>
            <div className="overview-wrapper data-box">
                {/* <div className="coming-soon-small">
                    <img src={comingSoonBox} width={25} height={45} />
                    <p>Coming soon</p>
                </div> */}
                <div className="icon-wrapper lve-msg">
                    <img src={liveMessagesIcon} width={35} height={26} alt="liveMessagesIcon" />
                </div>
                <div className="data-wrapper">
                    <span>Total messages</span>
                    <p> {state?.monitor_data?.total_messages}</p>
                </div>
            </div>
            {/* <div className="overview-wrapper data-box">
                <div className="coming-soon-small">
                    <img src={comingSoonBox} width={25} height={45} />
                    <p>Coming soon</p>
                </div>
                <div className="icon-wrapper sta-idl">
                    <img src={stationIdleIcon} width={35} height={27} alt="stationIdleIcon" />
                </div>
                <div className="data-wrapper">
                    <span>Total stations</span>
                    <p>
                        3 <span>on idle</span>
                    </p>
                </div>
            </div> */}
        </div>
    );
};

export default GenericDetails;
