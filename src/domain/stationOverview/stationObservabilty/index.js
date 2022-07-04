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

import React, { useContext, useEffect, useRef } from 'react';
import lottie from 'lottie-web';

import animationData from '../../../assets/lotties/thunnel-many.json';
import Messages from './messages';
import PubSubList from './pubSubList';
import { StationStoreContext } from '..';

const StationObservabilty = () => {
    const fromProducer = useRef(null);
    const toConsumer = useRef(null);
    const [stationState, stationDispatch] = useContext(StationStoreContext);

    useEffect(() => {
        lottie.loadAnimation({
            container: fromProducer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
        });
    }, [stationState?.stationSocketData?.active_producers?.length > 0]);

    useEffect(() => {
        lottie.loadAnimation({
            container: toConsumer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
        });
    }, [stationState?.stationSocketData?.active_consumers?.length > 0]);

    return (
        <div className="station-observabilty-container">
            <PubSubList producer={true} />
            <div className="thunnel-from-sub">
                {stationState?.stationSocketData?.active_producers?.length > 0 && <div style={{ height: '10vw', width: '10vw' }} ref={fromProducer}></div>}
            </div>
            <Messages />
            <div className="thunnel-to-pub">
                {stationState?.stationSocketData?.active_consumers?.length > 0 && <div style={{ height: '10vw', width: '10vw' }} ref={toConsumer}></div>}
            </div>
            <PubSubList producer={false} />
        </div>
    );
};

export default StationObservabilty;
