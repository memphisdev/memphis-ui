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

import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';

import CollapseArrow from '../../../../../assets/images/collapseArrow.svg';
import Copy from '../../../../../assets/images/copy.svg';
import Copied from '../../../../../assets/images/copied.svg';
import StatusIndication from '../../../../../components/indication';
import { Details } from '@material-ui/icons';

const { Panel } = Collapse;

const CustomCollapse = ({ status, data, header, defaultOpen, message }) => {
    const [activeKey, setActiveKey] = useState(defaultOpen ? ['1'] : []);
    const [copied, setCopied] = useState(false);
    const onChange = (key) => {
        setActiveKey(key);
    };
    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(data);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <Collapse ghost defaultActiveKey={activeKey} onChange={onChange} className="custom-collapse">
            <Panel
                showArrow={false}
                header={
                    <div className="collapse-header">
                        <p className="title">{header}</p>
                        <status is="x3d">
                            {/* {status && <StatusIndication is_active={data?.is_active} is_deleted={data?.is_deleted} />} */}
                            <img className={activeKey[0] === '1' ? 'collapse-arrow open' : 'collapse-arrow close'} src={CollapseArrow} alt="collapse-arrow" />
                        </status>
                    </div>
                }
                key="1"
            >
                {message ? (
                    <div className="message">
                        {message && activeKey.length > 0 && <img src={copied ? Copied : Copy} onClick={() => handleCopy()} className={'copy-icon'} />}
                        <p>{data}</p>
                    </div>
                ) : (
                    <>
                        {!status &&
                            data?.length > 0 &&
                            data?.map((row, index) => {
                                return (
                                    <content is="x3d" key={index}>
                                        <p>{row.name}</p>
                                        <span>{row.value}</span>
                                    </content>
                                );
                            })}
                        {status &&
                            data?.details?.length > 0 &&
                            data?.details?.map((row, index) => {
                                return (
                                    <content is="x3d" key={index}>
                                        <p>{row.name}</p>
                                        <span>{row.value}</span>
                                    </content>
                                );
                            })}
                    </>
                )}
            </Panel>
        </Collapse>
    );
};

export default CustomCollapse;
