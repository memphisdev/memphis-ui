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

import React, { useContext, useState, useEffect } from 'react';
import { Divider } from 'antd';

import CustomTabs from '../../components/Tabs';
import { Context } from '../../hooks/store';
import Integrations from './integrations';
import Profile from './profile';
import Alerts from './alerts';

function Users() {
    const [value, setValue] = useState(0);
    // const tabs = ['Profile', 'Integrations', 'Alerts'];
    const tabs = ['Profile'];
    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        dispatch({ type: 'SET_ROUTE', payload: '' });
    }, []);

    const handleChangeMenuItem = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="preferences-container">
            <h1 className="main-header-h1">Preferences</h1>
            <div className="preferences-panel-tabs">
                <div>
                    <CustomTabs value={value} onChange={handleChangeMenuItem} tabs={tabs}></CustomTabs>
                    <Divider />
                </div>
            </div>
            <div className="tabs-body">
                {value === 0 && <Profile />}
                {value === 1 && <Integrations />}
                {value === 2 && <Alerts />}
            </div>
        </div>
    );
}
export default Users;
