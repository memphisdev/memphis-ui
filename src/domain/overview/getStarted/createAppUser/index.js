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
import Input from '../../../../components/Input';

import './style.scss';
import { httpRequest } from '../../../../services/http';
import { ApiEndpoints } from '../../../../const/apiEndpoints';
import Button from '../../../../components/button';
import CopyIcon from '../../../../assets/images/copy.svg';
import Information from '../../../../assets/images/information.svg';
import UserCheck from '../../../../assets/images/userCheck.svg';
import CreatingTheUser from '../../../../assets/images/creatingTheUser.svg';
import ClickableImage from '../../../../components/clickableImage';
import { GetStartedStoreContext } from '..';
import SelectedClipboard from '../../../../assets/images/selectedClipboard.svg';
import TitleComponent from '../../../../components/titleComponent';

const screenEnum = {
    CREATE_USER_PAGE: 0,
    DATA_WAITING: 1,
    DATA_RECIEVED: 2
};

const CreateAppUser = (props) => {
    const { createStationFormRef } = props;
    const [creationForm] = Form.useForm();
    const [selectedClipboardUserName, setSelectedClipboardUserName] = useState(false);
    const [selectedClipboardToken, setSelectedClipboardToken] = useState(false);
    const [isCreatedUser, setCreatedUser] = useState(screenEnum['CREATE_USER_PAGE']);
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);

    const [formFields, setFormFields] = useState({
        username: '',
        user_type: 'application'
    });

    useEffect(() => {
        createStationFormRef.current = onNext;
        getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: true });
        getStartedDispatch({ type: 'SET_CREATE_APP_USER_DISABLE', payload: false });
        if (getStartedState?.username) {
            setFormFields({ ...formFields, username: getStartedState.username });
        }
    }, []);

    const onNext = () => {
        getStartedDispatch({ type: 'SET_CURRENT_STEP', payload: getStartedState?.currentStep + 1 });
    };

    const onCopy = async (copyParam) => {
        navigator.clipboard.writeText(copyParam);
    };

    const updateFormState = (field, value) => {
        let updatedValue = { ...formFields };
        updatedValue[field] = value;
        setFormFields((formFields) => ({ ...formFields, ...updatedValue }));
    };

    const createAppUser = async (bodyRequest) => {
        try {
            const data = await httpRequest('POST', ApiEndpoints.ADD_USER, bodyRequest);
            setCreatedUser(screenEnum['DATA_WAITING']);

            if (data) {
                getStartedDispatch({ type: 'IS_LOADING', payload: false });

                getStartedDispatch({ type: 'SET_USER_NAME', payload: data?.username });
                getStartedDispatch({ type: 'SET_BROKER_CONNECTION_CREDS', payload: data?.broker_connection_creds });

                getStartedDispatch({ type: 'SET_CREATE_APP_USER_DISABLE', payload: true });
                getStartedDispatch({ type: 'IS_APP_USER_CREATED', payload: true });
                setTimeout(() => {
                    setCreatedUser(screenEnum['DATA_RECIEVED']);
                    getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: false });
                }, 1000);
            }
        } catch (error) {
            getStartedDispatch({ type: 'IS_LOADING', payload: false });
            setCreatedUser(screenEnum['CREATE_USER_PAGE']);
            console.log(error);
        }
    };
    const onCopyClick = (copyValue, setImageState) => {
        onCopy(copyValue);
        setImageState(true);
        setTimeout(() => {
            setImageState(false);
        }, 3000);
    };

    const onFinish = async () => {
        try {
            getStartedDispatch({ type: 'IS_LOADING', payload: true });
            const values = await creationForm.validateFields();
            if (values?.errorFields) {
                return;
            } else {
                try {
                    const bodyRequest = {
                        username: values.username,
                        user_type: 'application'
                    };
                    createAppUser(bodyRequest);
                } catch (error) {
                    console.log('err create user', error);
                }
            }
        } catch (error) {
            console.log(`validate error ${JSON.stringify(error)}`);
        }
    };

    return (
        <Form name="form" form={creationForm} autoComplete="off" className="create-station-form-create-app-user">
            <div>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Type here'
                        }
                    ]}
                    style={{ marginBottom: '0' }}
                >
                    <div>
                        <div style={{ display: 'flex' }}>
                            <p className="field-title">
                                <span className="required-field-mark">* </span>
                            </p>{' '}
                            <TitleComponent
                                headerTitle="Enter user name"
                                typeTitle="sub-header"
                                // headerDescription="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                            ></TitleComponent>
                        </div>
                        <Input
                            placeholder="Type user name"
                            type="text"
                            radiusType="semi-round"
                            colorType="black"
                            backgroundColorType="none"
                            borderColorType="gray"
                            width="371px"
                            height="38px"
                            onBlur={(e) => updateFormState('username', e.target.value)}
                            onChange={(e) => updateFormState('username', e.target.value)}
                            value={formFields.username}
                            disabled={getStartedState?.isAppUserCreated}
                        />
                    </div>
                </Form.Item>
                <Button
                    placeholder="Create app user"
                    colorType="white"
                    radiusType="circle"
                    backgroundColorType="purple"
                    fontSize="12px"
                    fontWeight="bold"
                    marginTop="25px"
                    disabled={getStartedState.createAppUserDisable}
                    onClick={onFinish}
                    isLoading={getStartedState?.isLoading}
                />
                {isCreatedUser === screenEnum['DATA_WAITING'] ? (
                    <div className="creating-the-user-container">
                        <img src={CreatingTheUser} alt="creating-the-user"></img>
                        <p className="create-the-user-header">User is getting created</p>
                    </div>
                ) : isCreatedUser === screenEnum['DATA_RECIEVED'] ? (
                    <div className="connection-details-container">
                        <div className="user-details-container">
                            <img src={UserCheck} alt="usercheck" width="20px" height="20px" className="user-check"></img>
                            <p className="user-connection-details">User connection details</p>
                        </div>
                        <div className="container-username-token">
                            <div className="username-container">
                                <p>Username: {getStartedState.username}</p>
                                {selectedClipboardUserName ? (
                                    <ClickableImage image={SelectedClipboard} className="copy-icon"></ClickableImage>
                                ) : (
                                    <ClickableImage
                                        image={CopyIcon}
                                        alt="copyIcon"
                                        className="copy-icon"
                                        onClick={() => {
                                            onCopyClick(getStartedState.username, setSelectedClipboardUserName);
                                        }}
                                    />
                                )}
                            </div>
                            <div className="token-container">
                                <p>Connection token: {getStartedState?.connectionCreds}</p>
                                {selectedClipboardToken ? (
                                    <ClickableImage image={SelectedClipboard} className="copy-icon"></ClickableImage>
                                ) : (
                                    <ClickableImage
                                        image={CopyIcon}
                                        alt="copyIcon"
                                        className="copy-icon"
                                        onClick={() => {
                                            onCopyClick(getStartedState.connectionCreds, setSelectedClipboardToken);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="information-container">
                            <img src={Information} alt="information" className="information-img" />
                            <p className="information">Please note when you close this modal, you will not be able to restore your user details!!</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </Form>
    );
};

export default CreateAppUser;
