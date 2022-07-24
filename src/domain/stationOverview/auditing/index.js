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

import React, { useState } from 'react';

import CustomTabs from '../../../components/Tabs';
import GenericList from './genericList';
import { Divider } from 'antd';
import comingSoonBox from '../../../assets/images/comingSoonBox.svg';

const auditColumns = [
    {
        key: '1',
        title: 'Message',
        width: '300px'
    },
    {
        key: '2',
        title: 'User',
        width: '200px'
    },
    {
        key: '3',
        title: 'Date',
        width: '200px'
    }
];

const Auditing = () => {
    const [tabValue, setTabValue] = useState(0);
    const tabs = ['Audit'];

    const handleChangeMenuItem = (_, newValue) => {
        setTabValue(newValue);
    };

    return (
        // <div className="auditing-container">
        //     {tabValue === 0 && <p className="audit-hint">*last 30 days</p>}
        //     <CustomTabs value={tabValue} onChange={handleChangeMenuItem} tabs={tabs}></CustomTabs>
        //     <Divider />
        //     <div className="auditing-body">{tabValue === 0 && <GenericList tab={tabValue} columns={auditColumns} />}</div>
        // </div>
        <GenericList tab={tabValue} columns={auditColumns} />
    );
};

export default Auditing;
