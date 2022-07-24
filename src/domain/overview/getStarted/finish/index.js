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

import React, { useContext, useEffect } from 'react';
import { Form } from 'antd';
import Button from '../../../../components/button';
import SlackIcon from '../../../../assets/images/slackIcon.svg';
import GithubIcon from '../../../../assets/images/githubIcon.svg';
import DiscordIcon from '../../../../assets/images/discordIcon.svg';
import { Link, useHistory } from 'react-router-dom';
import { GetStartedStoreContext } from '..';
import pathDomains from '../../../../router';
import './style.scss';
import { ApiEndpoints } from '../../../../const/apiEndpoints';
import { httpRequest } from '../../../../services/http';

const Finish = (props) => {
    const { createStationFormRef } = props;

    const [creationForm] = Form.useForm();
    const history = useHistory();
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);

    useEffect(() => {
        getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: false });
        createStationFormRef.current = onNext;
    }, []);

    const onNext = () => {
        doneNextSteps();
        window.location.reload(false);
    };

    const onFinish = (e) => {
        e.preventDefault();
        doneNextSteps();
        history.push(`${pathDomains.factoriesList}/${getStartedState.factoryName}/${getStartedState.stationName}`);
    };

    const doneNextSteps = async () => {
        try {
            const data = await httpRequest('POST', ApiEndpoints.DONE_NEXT_STEPS);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form name="form" form={creationForm} autoComplete="off" className="finish-container">
            <Button
                width="192px"
                height="42px"
                placeholder="Go to station"
                radiusType="circle"
                backgroundColorType="white"
                fontSize="16px"
                fontWeight="bold"
                border="1px solid #EEEEEE"
                borderRadius="31px"
                boxShadowStyle="none"
                onClick={(e) => {
                    onFinish(e);
                }}
            />
            <div className="container-icons-finish">
                <p className="link-finish-header">Link to our channels</p>
                <Link className="icon-image" to={{ pathname: 'https://memphiscommunity.slack.com/archives/C03KRNC6R3Q' }} target="_blank">
                    <img src={SlackIcon} width="25px" height="25px" alt="slack-icon"></img>
                </Link>
                <Link className="icon-image" to={{ pathname: 'https://github.com/memphisdev' }} target="_blank">
                    <img src={GithubIcon} width="25px" height="25px" alt="github-icon"></img>
                </Link>
                <Link className="icon-image" to={{ pathname: 'https://discord.com/invite/WZpysvAeTf' }} target="_blank">
                    <img src={DiscordIcon} width="25px" height="25px" alt="discord_icon"></img>
                </Link>
            </div>
        </Form>
    );
};

export default Finish;
