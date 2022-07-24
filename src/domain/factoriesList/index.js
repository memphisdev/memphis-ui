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

import React, { useEffect, useContext, useState, useRef } from 'react';

import CreateFactoryDetails from './createFactoryDetails';
import emptyList from '../../assets/images/emptyList.svg';
import { ApiEndpoints } from '../../const/apiEndpoints';
import { httpRequest } from '../../services/http';
import Button from '../../components/button';
import Loader from '../../components/loader';
import { Context } from '../../hooks/store';
import Modal from '../../components/modal';
import Factory from './factory';

function FactoriesList() {
    const [state, dispatch] = useContext(Context);
    const [factoriesList, setFactoriesList] = useState([]);
    const [modalIsOpen, modalFlip] = useState(false);
    const createFactoryRef = useRef(null);
    const [isLoading, setisLoading] = useState(false);

    const getFactories = async () => {
        setisLoading(true);
        try {
            const data = await httpRequest('GET', ApiEndpoints.GEL_ALL_FACTORIES);
            setFactoriesList(data);
            setisLoading(false);
        } catch (error) {
            setisLoading(false);
        }
    };

    useEffect(() => {
        dispatch({ type: 'SET_ROUTE', payload: 'factories' });
        getFactories();
    }, []);

    useEffect(() => {
        state.socket?.on('factories_overview_data', (data) => {
            setFactoriesList(data);
        });

        setTimeout(() => {
            state.socket?.emit('register_factories_overview_data');
        }, 1000);
        return () => {
            state.socket?.emit('deregister');
        };
    }, [state.socket]);

    const removeFactory = (id) => {
        setFactoriesList(factoriesList.filter((item) => item.id !== id));
    };

    return (
        <div>
            <div className="factories-container">
                <div className="one-edge-shadow">
                    <h1 className="main-header-h1">Factories</h1>
                    <div className="factories-header-flex">
                        <h3>Select a factory to edit</h3>
                        <Button
                            className="modal-btn"
                            width="160px"
                            height="36px"
                            placeholder={'Create new factory'}
                            colorType="white"
                            radiusType="circle"
                            backgroundColorType="purple"
                            fontSize="14px"
                            fontWeight="600"
                            aria-haspopup="true"
                            onClick={() => modalFlip(true)}
                        />
                    </div>
                </div>
                <div className="factories-list">
                    {isLoading && (
                        <div className="loader-uploading">
                            <Loader />
                        </div>
                    )}
                    {factoriesList.map((factory) => {
                        return <Factory key={factory.id} content={factory} removeFactory={() => removeFactory(factory.id)}></Factory>;
                    })}
                    {!isLoading && factoriesList.length === 0 && (
                        <div className="no-factory-to-display">
                            <img src={emptyList} width="100" height="100" alt="emptyList" />
                            <p>There are no factories yet</p>
                            <p className="sub-title">Get started by creating a factory</p>
                            <Button
                                className="modal-btn"
                                width="240px"
                                height="50px"
                                placeholder="Create your first factory"
                                colorType="white"
                                radiusType="circle"
                                backgroundColorType="purple"
                                fontSize="12px"
                                fontWeight="600"
                                aria-controls="usecse-menu"
                                aria-haspopup="true"
                                onClick={() => modalFlip(true)}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Modal
                header="Create a factory"
                height="475px"
                minWidth="440px"
                rBtnText="Create"
                lBtnText="Cancel"
                closeAction={() => modalFlip(false)}
                lBtnClick={() => {
                    modalFlip(false);
                }}
                clickOutside={() => modalFlip(false)}
                rBtnClick={() => {
                    createFactoryRef.current();
                    // modalFlip(false);
                }}
                open={modalIsOpen}
            >
                <CreateFactoryDetails createFactoryRef={createFactoryRef} />
            </Modal>
        </div>
    );
}

export default FactoriesList;
