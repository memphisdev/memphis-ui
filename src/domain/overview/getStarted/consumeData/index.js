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

import React, { useContext, useEffect, useState } from 'react';
import { CODE_CONSUME_JAVASCRIPT, CODE_CONSUME_GO, CODE_CONSUME_PYTHON } from '../../../../const/SDKExample';
import WaitingConsumeData from '../../../../assets/images/waitingConsumeData.svg';
import ProduceConsumeData, { produceConsumeScreenEnum } from '../produceConsumeData';
import { GetStartedStoreContext } from '..';

const ConsumeData = (props) => {
    const { createStationFormRef } = props;
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);
    const [displayScreen, setDisplayScreen] = useState();

    const host = process.env.REACT_APP_SANDBOX_ENV ? 'broker.sandbox.memphis.dev' : 'localhost';

    const languagesOptions = {
        Go: {
            name: 'Go',
            language: 'go',
            value: CODE_CONSUME_GO.replace('<username>', getStartedState?.username)
                .replace('<memphis_host>', host)
                .replace('<connection_token>', getStartedState?.connectionCreds)
                .replace('<station_name>', getStartedState?.stationName)
        },
        // Python: {
        //     name: 'Python',
        //     language: 'python',
        //     value: CODE_CONSUME_PYTHON.replace('<username>', getStartedState?.username)
        //         .replace('<memphis_host>', host)
        //         .replace('<connection_token>', getStartedState?.connectionCreds)
        //         .replace('<station_name>', getStartedState?.stationName)
        // },
        'Node.js': {
            name: 'Node.js',
            language: 'javascript',
            value: CODE_CONSUME_JAVASCRIPT.replace('<username>', getStartedState?.username)
                .replace('<memphis_host>', host)
                .replace('<connection_token>', getStartedState?.connectionCreds)
                .replace('<station_name>', getStartedState?.stationName)
        }
    };

    const onNext = () => {
        if (displayScreen === produceConsumeScreenEnum['DATA_SNIPPET']) {
            setDisplayScreen(produceConsumeScreenEnum['DATA_WAITING']);
        } else {
            getStartedDispatch({ type: 'SET_CURRENT_STEP', payload: getStartedState?.currentStep + 1 });
        }
    };

    useEffect(() => {
        createStationFormRef.current = onNext;
    }, [displayScreen]);

    useEffect(() => {
        setDisplayScreen(produceConsumeScreenEnum['DATA_SNIPPET']);
    }, []);

    return (
        <ProduceConsumeData
            waitingImage={WaitingConsumeData}
            waitingTitle={'We are waiting for a consumer to consume data'}
            successfullTitle={'Start to receive messages.'}
            languagesOptions={languagesOptions}
            activeData={'connected_cgs'}
            dataName={'consumer_app'}
            displayScreen={displayScreen}
        ></ProduceConsumeData>
    );
};

export default ConsumeData;
