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
import { CopyBlock, atomOneLight } from 'react-code-blocks';
import { useHistory } from 'react-router-dom';
import { Progress } from 'antd';

import { CODE_EXAMPLE, DOCKER_CODE_EXAMPLE } from '../../../const/SDKExample';
import { convertBytes, convertSecondsToDate } from '../../../services/valueConvertor';
import averageMesIcon from '../../../assets/images/averageMesIcon.svg';
import awaitingIcon from '../../../assets/images/awaitingIcon.svg';
import storageIcon from '../../../assets/images/storageIcon.svg';
import memoryIcon from '../../../assets/images/memoryIcon.svg';
import HealthyBadge from '../../../components/healthyBadge';
import cpuIcon from '../../../assets/images/cpuIcon.svg';
import SelectComponent from '../../../components/select';
import Button from '../../../components/button';
import { Context } from '../../../hooks/store';
import Modal from '../../../components/modal';
import pathDomains from '../../../router';
import { StationStoreContext } from '..';
import TooltipComponent from '../../../components/tooltip/tooltip';
import Auditing from '../auditing';
import { InfoOutlined } from '@material-ui/icons';
import { LOCAL_STORAGE_ENV, LOCAL_STORAGE_NAMESPACE } from '../../../const/localStorageConsts';

const StationOverviewHeader = (props) => {
    const [state, dispatch] = useContext(Context);
    const [stationState, stationDispatch] = useContext(StationStoreContext);
    const history = useHistory();
    const [retentionValue, setRetentionValue] = useState('');
    const [sdkModal, setSdkModal] = useState(false);
    const [auditModal, setAuditModal] = useState(false);
    const selectLngOption = ['Go', 'Node.js'];
    const [langSelected, setLangSelected] = useState('Go');
    const [codeExample, setCodeExample] = useState('');
    const url = window.location.href;
    const stationName = url.split('factories/')[1].split('/')[1];
    const handleSelectLang = (e) => {
        setLangSelected(e);
        changeDynamicCode(e);
    };
    useEffect(() => {
        changeDynamicCode(langSelected);
        switch (stationState?.stationMetaData?.retention_type) {
            case 'message_age_sec':
                setRetentionValue(convertSecondsToDate(stationState?.stationMetaData?.retention_value));
                break;
            case 'bytes':
                setRetentionValue(`${stationState?.stationMetaData?.retention_value} bytes`);
                break;
            case 'messages':
                setRetentionValue(`${stationState?.stationMetaData?.retention_value} messages`);
                break;
            default:
                break;
        }
    }, []);

    const changeDynamicCode = (lang) => {
        let codeEx = CODE_EXAMPLE[lang].code;
        let host = process.env.REACT_APP_SANDBOX_ENV
            ? 'broker.sandbox.memphis.dev'
            : localStorage.getItem(LOCAL_STORAGE_ENV) === 'docker'
            ? 'localhost'
            : 'memphis-cluster.' + localStorage.getItem(LOCAL_STORAGE_NAMESPACE) + '.svc.cluster.local';
        codeEx = codeEx.replaceAll('<memphis-host>', host);
        codeEx = codeEx.replaceAll('<station_name>', stationName);
        setCodeExample(codeEx);
    };

    const returnToStaionsList = () => {
        const url = window.location.href;
        const staionName = url.split('factories/')[1].split('/')[0];
        history.push(`${pathDomains.factoriesList}/${staionName}`);
    };

    return (
        <div className="station-overview-header">
            <div className="title-wrapper">
                <div className="station-details">
                    <h1 className="station-name">{stationState?.stationMetaData?.name}</h1>
                    <span className="created-by">
                        Created by {stationState?.stationMetaData?.created_by_user} at {stationState?.stationMetaData?.creation_date}
                    </span>
                </div>
                <div id="e2e-tests-station-close-btn">
                    <Button
                        width="80px"
                        height="32px"
                        placeholder="Back"
                        colorType="white"
                        radiusType="circle"
                        backgroundColorType="navy"
                        fontSize="13px"
                        fontWeight="600"
                        border="navy"
                        onClick={() => returnToStaionsList()}
                    />
                </div>
            </div>
            <div className="details">
                <div className="main-details">
                    <p>
                        <b>Retention:</b> {retentionValue}
                    </p>
                    <p>
                        <b>Replicas:</b> {stationState?.stationMetaData?.replicas}
                    </p>
                    <p>
                        <b>Storage Type:</b> {stationState?.stationMetaData?.storage_type}
                    </p>
                </div>
                <div className="icons-wrapper">
                    <div className="details-wrapper">
                        <div className="icon">
                            <img src={awaitingIcon} width={22} height={44} alt="awaitingIcon" />
                        </div>
                        <div className="more-details">
                            <p className="title">Total messages</p>
                            <p className="number">{stationState?.stationSocketData?.total_messages || 0}</p>
                        </div>
                    </div>
                    <TooltipComponent text="Include extra bytes added by memphis." width={'220px'} cursor="pointer">
                        <div className="details-wrapper average">
                            <div className="icon">
                                <img src={averageMesIcon} width={24} height={24} alt="averageMesIcon" />
                            </div>
                            <div className="more-details">
                                <p className="title">Av. message size</p>
                                <p className="number">{convertBytes(stationState?.stationSocketData?.average_message_size)}</p>
                            </div>
                        </div>
                    </TooltipComponent>
                    {/* <div className="details-wrapper">
                        <div className="icon">
                            <img src={memoryIcon} width={24} height={24} alt="memoryIcon" />
                        </div>
                        <div className="more-details">
                            <p className="number">20Mb/80Mb</p>
                            <Progress showInfo={false} status={(20 / 80) * 100 > 60 ? 'exception' : 'success'} percent={(20 / 80) * 100} size="small" />
                            <p className="title">Mem</p>
                        </div>
                    </div>
                    <div className="details-wrapper">
                        <div className="icon">
                            <img src={cpuIcon} width={22} height={22} alt="cpuIcon" />
                        </div>
                        <div className="more-details">
                            <p className="number">50%</p>
                            <Progress showInfo={false} status={(35 / 100) * 100 > 60 ? 'exception' : 'success'} percent={(35 / 100) * 100} size="small" />
                            <p className="title">CPU</p>
                        </div>
                    </div>
                    <div className="details-wrapper">
                        <div className="icon">
                            <img src={storageIcon} width={30} height={30} alt="storageIcon" />
                        </div>
                        <div className="more-details">
                            <p className="number">{60}Mb/100Mb</p>
                            <Progress showInfo={false} status={(60 / 100) * 100 > 60 ? 'exception' : 'success'} percent={(60 / 100) * 100} size="small" />
                            <p className="title">Storage</p>
                        </div>
                    </div> */}
                </div>
                <div className="info-buttons">
                    <div className="sdk">
                        <p>SDK</p>
                        <span onClick={() => setSdkModal(true)}>View Details ></span>
                    </div>
                    <div className="audit">
                        <p>Audit</p>
                        <span onClick={() => setAuditModal(true)}>View Details ></span>
                    </div>
                </div>
            </div>
            <Modal
                header="SDK"
                minHeight="700px"
                minWidth="700px"
                closeAction={() => setSdkModal(false)}
                clickOutside={() => setSdkModal(false)}
                open={sdkModal}
                hr={false}
            >
                <div className="sdk-details-container">
                    <div className="select-lan">
                        <p>Language</p>
                        <SelectComponent
                            value={langSelected}
                            colorType="navy"
                            backgroundColorType="none"
                            borderColorType="gray"
                            radiusType="semi-round"
                            width="220px"
                            height="50px"
                            options={selectLngOption}
                            onChange={(e) => handleSelectLang(e)}
                            dropdownClassName="select-options"
                        />
                    </div>
                    <div className="installation">
                        <p>Installation</p>
                        <div className="install-copy">
                            <p></p>
                            <CopyBlock text={CODE_EXAMPLE[langSelected].installation} showLineNumbers={false} theme={atomOneLight} wrapLines={true} codeBlock />
                        </div>
                    </div>
                    <div className="code-example">
                        <p>Code</p>
                        <div className="code-content">
                            <CopyBlock
                                language={CODE_EXAMPLE[langSelected].langCode}
                                text={codeExample}
                                showLineNumbers={true}
                                theme={atomOneLight}
                                wrapLines={true}
                                codeBlock
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                header={
                    <div className="audit-header">
                        <p className="title">Audit</p>
                        <div className="msg">
                            <InfoOutlined />
                            <p>Showing last 5 days</p>
                        </div>
                    </div>
                }
                minHeight="400px"
                minWidth="800px"
                closeAction={() => setAuditModal(false)}
                clickOutside={() => setAuditModal(false)}
                open={auditModal}
                hr={false}
                className="audit"
            >
                <Auditing />
            </Modal>
        </div>
    );
};

export default StationOverviewHeader;
