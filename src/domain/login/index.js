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

import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'antd';

import { LOCAL_STORAGE_TOKEN } from '../../const/localStorageConsts';
import betaFullLogo from '../../assets/images/betaFullLogo.svg';
import { ApiEndpoints } from '../../const/apiEndpoints';
import sharps from '../../assets/images/sharps.svg';
import { httpRequest } from '../../services/http';
import AuthService from '../../services/auth';
import Button from '../../components/button';
import Loader from '../../components/loader';
import { Context } from '../../hooks/store';
import Input from '../../components/Input';

const Login = (props) => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
    const [loginForm] = Form.useForm(); // form controller
    const [formFields, setFormFields] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const referer = props?.location?.state?.referer || '/overview';
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(async () => {
        if (localStorage.getItem(LOCAL_STORAGE_TOKEN) && AuthService.isValidToken()) {
            history.push(referer);
        }
    }, []);

    const handleUserNameChange = (e) => {
        setFormFields({ ...formFields, username: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setFormFields({ ...formFields, password: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = await loginForm.validateFields();
        if (values?.errorFields) {
            return;
        } else {
            try {
                setLoadingSubmit(true);
                const { username, password } = formFields;
                const data = await httpRequest('POST', ApiEndpoints.LOGIN, { username, password }, {}, {}, false);
                if (data) {
                    AuthService.saveToLocalStorage(data);
                    history.push(referer);
                }
                dispatch({ type: 'SET_USER_DATA', payload: data });
            } catch (err) {
                setError(err);
            }
            setLoadingSubmit(false);
        }
    };

    const layout = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16
        }
    };

    return (
        <section className="loginContainers">
            {state.loading ? <Loader></Loader> : ''}
            <div className="desktop-container">
                <div className="desktop-content">
                    <div className="logoImg">
                        <img alt="logo" src={betaFullLogo}></img>
                    </div>
                    <div className="title">
                        <p>Hey Memphiser,</p>
                        <p>Welcome</p>
                    </div>
                    <div className="login-form">
                        <Form
                            {...layout}
                            name="basic"
                            initialValues={{
                                remember: true
                            }}
                            form={loginForm}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Username can not be empty'
                                    }
                                ]}
                            >
                                <div className="field name">
                                    <p>Username</p>
                                    <Input
                                        placeholder="Type username"
                                        type="text"
                                        radiusType="semi-round"
                                        colorType="gray"
                                        backgroundColorType="none"
                                        borderColorType="gray"
                                        width="19vw"
                                        height="43px"
                                        minWidth="200px"
                                        onBlur={handleUserNameChange}
                                        onChange={handleUserNameChange}
                                        value={formFields.username}
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Password can not be empty'
                                    }
                                ]}
                            >
                                <div className="field password">
                                    <p>Password</p>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        radiusType="semi-round"
                                        colorType="gray"
                                        backgroundColorType="none"
                                        borderColorType="gray"
                                        width="19vw"
                                        height="43px"
                                        minWidth="200px"
                                        onChange={handlePasswordChange}
                                        onBlur={handlePasswordChange}
                                        value={formFields.password}
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item {...tailLayout} className="button-container">
                                <Button
                                    width="19vw"
                                    height="43px"
                                    minWidth="200px"
                                    placeholder="Sign in"
                                    colorType="white"
                                    radiusType="circle"
                                    backgroundColorType="purple"
                                    fontSize="12px"
                                    fontWeight="600"
                                    isLoading={loadingSubmit}
                                    onClick={handleSubmit}
                                />
                            </Form.Item>

                            {error && (
                                <div className="error-message">
                                    <p>An account with that sign-in information does not exist. Try again or create a new account.</p>
                                </div>
                            )}
                            {/* {timerForRetry.length !== 0 && (
                                    <div className="error-message">
                                        <p>Your acount was blocked, please try again in {timerForRetry}</p>
                                    </div>
                                )} */}
                        </Form>
                    </div>
                </div>
                <div className="brand-shapes">
                    <img alt="sharps" src={sharps}></img>
                </div>
            </div>
        </section>
    );
};

export default Login;
