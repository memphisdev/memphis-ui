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

import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'antd';
import SelectComponent from '../../../../components/select';
import CodeSnippet from '../../../../components/codeSnippet';
import Button from '../../../../components/button';
import SuccessfullyReceivedProduce from '../../../../assets/images/successfullyReceivedProduce.svg';
import { GetStartedStoreContext } from '..';
import { httpRequest } from '../../../../services/http';
import { ApiEndpoints } from '../../../../const/apiEndpoints';
import './style.scss';
import TitleComponent from '../../../../components/titleComponent';

export const produceConsumeScreenEnum = {
    DATA_SNIPPET: 0,
    DATA_WAITING: 1,
    DATA_RECIEVED: 2
};

const ProduceConsumeData = (props) => {
    const { waitingImage, waitingTitle, successfullTitle, languagesOptions, activeData, dataName, displayScreen } = props;
    const [creationForm] = Form.useForm();
    const [isCopyToClipBoard, setCopyToClipBoard] = useState(displayScreen);
    const [languageOption, setLanguageOption] = useState();
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);
    const [intervalStationDetails, setintervalStationDetails] = useState();

    const getStationDetails = async () => {
        try {
            const data = await httpRequest('GET', `${ApiEndpoints.GET_STATION_DATA}?station_name=${getStartedState?.formFieldsCreateStation?.name}`);
            if (data) {
                getStartedDispatch({ type: 'GET_STATION_DATA', payload: data });
            }
        } catch (error) {
            if (error?.status === 666) {
                clearInterval(intervalStationDetails);
            }
        }
    };

    useEffect(() => {
        if (displayScreen !== isCopyToClipBoard) {
            if (displayScreen === produceConsumeScreenEnum['DATA_WAITING']) {
                onCopyToClipBoard();
            }
            setCopyToClipBoard(displayScreen);
        }
    }, [displayScreen]);

    const onCopyToClipBoard = () => {
        let interval = setInterval(() => {
            getStationDetails();
        }, 3000);
        setintervalStationDetails(interval);
    };

    useEffect(() => {
        setLanguageOption(languagesOptions['Go']);
        return () => {
            clearInterval(intervalStationDetails);
        };
    }, []);

    useEffect(() => {
        if (isCopyToClipBoard === produceConsumeScreenEnum['DATA_WAITING']) {
            getStartedDispatch({ type: 'SET_HIDDEN_BUTTON', payload: true });
        } else {
            getStartedDispatch({ type: 'SET_HIDDEN_BUTTON', payload: false });
            getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: false });
        }

        if (isCopyToClipBoard === produceConsumeScreenEnum['DATA_RECIEVED']) {
            clearInterval(intervalStationDetails);
        }
        return () => {
            getStartedDispatch({ type: 'SET_HIDDEN_BUTTON', payload: false });
            clearInterval(intervalStationDetails);
        };
    }, [isCopyToClipBoard]);

    useEffect(() => {
        if (
            getStartedState?.stationData &&
            getStartedState?.stationData[activeData] &&
            Object.keys(getStartedState?.stationData[activeData]).length >= 1 &&
            getStartedState?.stationData[activeData][0]?.name === dataName
        ) {
            setCopyToClipBoard(produceConsumeScreenEnum['DATA_RECIEVED']);
            // clearInterval(intervalStationDetails);
        }
        return () => {
            if (isCopyToClipBoard === produceConsumeScreenEnum['DATA_RECIEVED']) {
                clearInterval(intervalStationDetails);
            }
        };
    }, [[getStartedState?.stationData?.[activeData]]]);

    const updateDisplayLanguage = (lang) => {
        setLanguageOption(languagesOptions[lang]);
    };

    return (
        <Form name="form" form={creationForm} autoComplete="off" className="create-produce-data">
            <Form.Item
                name="languages"
                rules={[
                    {
                        required: true,
                        message: 'Type here'
                    }
                ]}
                style={{ marginBottom: '0' }}
            >
                <div className="select-container">
                    {isCopyToClipBoard === produceConsumeScreenEnum['DATA_SNIPPET'] ? (
                        <div>
                            <TitleComponent headerTitle="Language" typeTitle="sub-header"></TitleComponent>
                            <SelectComponent
                                initialValue={languageOption?.name}
                                value={languageOption?.name}
                                colorType="navy"
                                backgroundColorType="none"
                                borderColorType="gray"
                                radiusType="semi-round"
                                width="450px"
                                height="40px"
                                options={Object.keys(languagesOptions).map((lang) => languagesOptions[lang].name)}
                                onChange={(e) => updateDisplayLanguage(e)}
                                dropdownClassName="select-options"
                            />
                        </div>
                    ) : null}
                </div>
                {isCopyToClipBoard === produceConsumeScreenEnum['DATA_WAITING'] ? (
                    <div className="data-waiting-container">
                        <img className="image-waiting-successful" src={waitingImage} alt="waiting-data"></img>
                        <TitleComponent headerTitle={waitingTitle} typeTitle="sub-header" style={{ header: { fontSize: '18px' } }}></TitleComponent>
                        <div>
                            <Button
                                width="129px"
                                height="40px"
                                placeholder="Skip"
                                colorType="black"
                                radiusType="circle"
                                backgroundColorType="white"
                                border="border: 1px solid #EBEBEB"
                                fontSize="14px"
                                fontWeight="bold"
                                marginBottom="3px"
                                onClick={() => {
                                    clearInterval(intervalStationDetails);

                                    getStartedDispatch({ type: 'SET_CURRENT_STEP', payload: getStartedState?.currentStep + 1 });
                                }}
                            />
                        </div>
                    </div>
                ) : isCopyToClipBoard === produceConsumeScreenEnum['DATA_RECIEVED'] ? (
                    <div className="successfully-container">
                        <img className="image-waiting-successful" src={SuccessfullyReceivedProduce} alt="successfully-received-produce"></img>
                        <TitleComponent headerTitle={successfullTitle} typeTitle="sub-header" style={{ header: { fontSize: '18px' } }}></TitleComponent>
                    </div>
                ) : (
                    <CodeSnippet languageOption={languageOption} codeSnippet={languageOption?.value} />
                )}
            </Form.Item>
        </Form>
    );
};

export default ProduceConsumeData;
