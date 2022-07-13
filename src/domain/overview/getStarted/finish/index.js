import React, { useContext, useEffect } from 'react';
import { Form } from 'antd';
import ReadyToroll from '../../../../assets/images/readyToRoll.svg';
import Button from '../../../../components/button';
import SlackIcon from '../../../../assets/images/slackIcon.svg';
import GithubIcon from '../../../../assets/images/githubIcon.svg';
import DiscordIcon from '../../../../assets/images/discordIcon.svg';
import { Link, useHistory } from 'react-router-dom';
import { GetStartedStoreContext } from '..';
import pathDomains from '../../../../router';
import './style.scss';

const Finsih = () => {
    const [creationForm] = Form.useForm();
    const history = useHistory();
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);

    useEffect(() => {
        getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: false });
    }, []);

    const onFinish = (e) => {
        e.preventDefault();
        history.push(`${pathDomains.factoriesList}/${getStartedState.factoryName}/${getStartedState.stationName}`);
    };

    return (
        <Form name="form" form={creationForm} autoComplete="off" className="finish-container">
            <img className="image-finish" src={ReadyToroll} height="150px" width="150px" alt="ready-to-roll"></img>
            <p className="header-finish">You are ready to roll</p>
            <p className="sub-header-finish">Congratulations - You’ve created your first broker app. </p>
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

export default Finsih;
