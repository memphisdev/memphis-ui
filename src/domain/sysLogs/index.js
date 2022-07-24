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

import React, { useEffect, useContext } from 'react';

import { Context } from '../../hooks/store';
import GenericList from './genericList';

const logColumns = [
    {
        key: '1',
        title: 'Source',
        width: '100px'
    },
    {
        key: '2',
        title: 'Type',
        width: '60px'
    },
    {
        key: '3',
        title: 'Creation date',
        width: '200px'
    },
    {
        key: '4',
        title: 'Log',
        width: '490px'
    }
];

const SysLogs = () => {
    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        dispatch({ type: 'SET_ROUTE', payload: 'overview' });
    }, []);

    return (
        <div className="logs-container">
            <h1 className="main-header-h1">System Logs</h1>
            <GenericList columns={logColumns} />
        </div>
    );
};

export default SysLogs;
