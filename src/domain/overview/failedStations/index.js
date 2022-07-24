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

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import ErrorSharpIcon from '@material-ui/icons/ErrorSharp';
import { Context } from '../../../hooks/store';
import pathDomains from '../../../router';
import { parsingDate } from '../../../services/valueConvertor';
import OverflowTip from '../../../components/tooltip/overflowtip';

const FailedStations = () => {
    const [state, dispatch] = useContext(Context);
    return (
        <div className="overview-wrapper failed-factories-container">
            <p className="overview-components-header">Stations</p>
            {/* <p className="overview-components-header">Un-Healthy stations</p> */}
            {/* <div className="factories-err-message">
                <ErrorSharpIcon className="err-icon" theme="outlined" />
                <p>For 5/23 stations, there may be a problem</p>
            </div> */}
            <div className="err-factories-list">
                <div className="coulmns-table">
                    <span style={{ width: '100px' }}>Name</span>
                    <span style={{ width: '100px' }}>Factory</span>
                    <span style={{ width: '150px' }}>Creation date</span>
                    {/* <span style={{ width: '100px' }}>Status</span> */}
                    <span style={{ width: '100px' }}></span>
                </div>
                <div className="rows-wrapper">
                    {state?.monitor_data?.stations?.map((station, index) => {
                        return (
                            <div className="factory-row" key={index}>
                                <OverflowTip text={station.name} width={'100px'}>
                                    {station.name}
                                </OverflowTip>
                                <OverflowTip text={station.factory_name} width={'100px'}>
                                    {station.factory_name}
                                </OverflowTip>
                                <OverflowTip text={parsingDate(station.creation_date)} width={'150px'}>
                                    {parsingDate(station.creation_date)}
                                </OverflowTip>
                                {/* {station.status === 1 && (
                                    <span style={{ width: '100px' }}>
                                        <div className="dot green"></div>
                                        In action
                                    </span>
                                )}
                                {station.status === 2 && (
                                    <span style={{ width: '100px' }}>
                                        <div className="dot yellow"></div>
                                        On idle
                                    </span>
                                )} */}
                                <Link style={{ cursor: 'pointer' }} to={`${pathDomains.factoriesList}/${station.factory_name}/${station.name}`}>
                                    <span className="link-row" style={{ width: '100px' }}>
                                        Go to station
                                    </span>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FailedStations;
