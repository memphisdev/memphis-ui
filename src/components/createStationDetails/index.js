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

import React, { useState, useEffect } from 'react';
import { Button, Form, InputNumber } from 'antd';

import RadioButton from '../radioButton';
import Input from '../Input';
import SelectComponent from '../select';
import { httpRequest } from '../../services/http';
import { ApiEndpoints } from '../../const/apiEndpoints';
import { convertDateToSeconds } from '../../services/dateConvertor';
import { useHistory } from 'react-router';
import pathDomains from '../../router';

const retanionOptions = [
    {
        id: 1,
        value: 'message_age_sec',
        label: 'Time'
    },
    {
        id: 2,
        value: 'bytes',
        label: 'Size'
    },
    {
        id: 3,
        value: 'messages',
        label: 'Messages'
    }
];

const storageOptions = [
    {
        id: 1,
        value: 'file',
        label: 'File'
    },
    {
        id: 2,
        value: 'memory',
        label: 'Memory'
    }
];

const CreateStationDetails = (props) => {
    const { chooseFactoryField = false, createStationRef, factoryName = '' } = props;
    const [factoryNames, setFactoryNames] = useState([]);
    const [loading, setLoading] = useState([]);

    const [creationForm] = Form.useForm();
    const history = useHistory();
    const [formFields, setFormFields] = useState({
        name: '',
        factory_name: '',
        retention_type: 'message_age_sec',
        retention_value: '',
        storage_type: 'file',
        replicas: 1
    });
    const [timeSeparator, setTimeSeparator] = useState({
        days: 7,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [retentionMessagesValue, setRetentionMessagesValue] = useState('10');
    const [retentionSizeValue, setRetentionSizeValue] = useState('1000');

    const getAllFactories = async () => {
        setLoading(true);
        try {
            const data = await httpRequest('GET', ApiEndpoints.GEL_ALL_FACTORIES);
            if (data) {
                if (data.length === 0) {
                    updateFormState('factory_name', 'Melvis');
                    creationForm.setFieldsValue({ ['factory_name']: 'Melvis' });
                    creationForm.setFieldsValue({ ['factories_List']: [] });
                } else {
                    const factories = data.map((factory) => factory.name);
                    setFactoryNames(factories);
                    updateFormState('factory_name', data[0].name);
                    creationForm.setFieldsValue({ ['factory_name']: data[0].name });
                    creationForm.setFieldsValue({ ['factories_List']: factories });
                }
            }
        } catch (error) {}
        setLoading(false);
    };

    useEffect(() => {
        createStationRef.current = onFinish;
        if (chooseFactoryField) {
            getAllFactories();
        } else {
            updateFormState('factory_name', factoryName);
        }
    }, []);

    const updateFormState = (field, value) => {
        let updatedValue = { ...formFields };
        updatedValue[field] = value;
        setFormFields((formFields) => ({ ...formFields, ...updatedValue }));
    };

    const handleRetentionSizeChange = (e) => {
        setRetentionSizeValue(e.target.value);
    };
    const handleRetentionMessagesChange = (e) => {
        setRetentionMessagesValue(e.target.value);
    };

    const handleDaysChange = (e) => {
        setTimeSeparator({ ...timeSeparator, days: e });
    };
    const handleHoursChange = (e) => {
        setTimeSeparator({ ...timeSeparator, hours: e });
    };
    const handleMinutesChange = (e) => {
        setTimeSeparator({ ...timeSeparator, minutes: e });
    };
    const handleSecondsChange = (e) => {
        setTimeSeparator({ ...timeSeparator, seconds: e });
    };

    const onFinish = async () => {
        const values = await creationForm.validateFields();
        if (values?.errorFields) {
            return;
        } else {
            if (values.retention_type === 'message_age_sec') {
                values['retention_value'] = convertDateToSeconds(values.days, values.hours, values.minutes, values.seconds);
            } else if (values.retention_type === 'bytes') {
                values['retention_value'] = Number(values.retentionSizeValue);
            } else {
                values['retention_value'] = Number(values.retentionMessagesValue);
            }
            try {
                const bodyRequest = {
                    name: values.name,
                    factory_name: factoryName || values.factory_name,
                    retention_type: values.retention_type,
                    retention_value: values.retention_value,
                    storage_type: values.storage_type,
                    replicas: values.replicas
                };
                if (chooseFactoryField && creationForm.getFieldValue('factories_List').length === 0) {
                    const result = await createNewFactory(bodyRequest.factory_name);
                    if (result) {
                        createStation(bodyRequest);
                    }
                } else {
                    createStation(bodyRequest);
                }
            } catch (error) {}
        }
    };

    const createStation = async (bodyRequest) => {
        try {
            const data = await httpRequest('POST', ApiEndpoints.CREATE_STATION, bodyRequest);
            if (data) {
                history.push(`${pathDomains.factoriesList}/${bodyRequest.factory_name}/${data.name}`);
            }
        } catch (error) {}
    };

    const createNewFactory = async (factory_name) => {
        try {
            await httpRequest('POST', ApiEndpoints.CREATE_FACTORY, { name: factory_name });
            return true;
        } catch (error) {}
        return false;
    };

    return (
        <div className="create-station-form">
            <Form name="form" form={creationForm} autoComplete="off" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input station name!'
                        }
                    ]}
                    style={{ height: '90px', marginBottom: '0' }}
                >
                    <div className="station-name">
                        <p className="field-title">
                            <span className="required-field-mark">* </span>Station name
                        </p>
                        <Input
                            placeholder="Type station name"
                            type="text"
                            radiusType="semi-round"
                            colorType="black"
                            backgroundColorType="none"
                            borderColorType="gray"
                            width="450px"
                            height="40px"
                            onBlur={(e) => updateFormState('name', e.target.value)}
                            onChange={(e) => updateFormState('name', e.target.value)}
                            value={formFields.name}
                        />
                    </div>
                </Form.Item>
                <div className="retention">
                    <p className="field-title">Retention</p>
                    <Form.Item name="retention_type" initialValue={formFields.retention_type}>
                        <RadioButton
                            options={retanionOptions}
                            radioValue={formFields.retention_type}
                            onChange={(e) => updateFormState('retention_type', e.target.value)}
                        />
                    </Form.Item>
                    {formFields.retention_type === 'message_age_sec' && (
                        <div className="time-value">
                            <div className="days-section">
                                <Form.Item name="days" initialValue={timeSeparator.days}>
                                    <InputNumber bordered={false} min={0} max={100} keyboard={true} onChange={(e) => handleDaysChange(e)} value={timeSeparator.days} />
                                </Form.Item>
                                <p>days</p>
                            </div>
                            <p className="separator">:</p>
                            <div className="hours-section">
                                <Form.Item name="hours" initialValue={timeSeparator.hours}>
                                    <InputNumber bordered={false} min={0} max={24} keyboard={true} onChange={(e) => handleHoursChange(e)} value={timeSeparator.hours} />
                                </Form.Item>
                                <p>hours</p>
                            </div>
                            <p className="separator">:</p>
                            <div className="minutes-section">
                                <Form.Item name="minutes" initialValue={timeSeparator.minutes}>
                                    <InputNumber
                                        bordered={false}
                                        min={0}
                                        max={60}
                                        keyboard={true}
                                        onChange={(e) => handleMinutesChange(e)}
                                        value={timeSeparator.minutes}
                                    />
                                </Form.Item>
                                <p>minutes</p>
                            </div>
                            <p className="separator">:</p>
                            <div className="seconds-section">
                                <Form.Item name="seconds" initialValue={timeSeparator.seconds}>
                                    <InputNumber
                                        bordered={false}
                                        min={0}
                                        max={60}
                                        keyboard={true}
                                        onChange={(e) => handleSecondsChange(e)}
                                        value={timeSeparator.seconds}
                                    />
                                </Form.Item>
                                <p>seconds</p>
                            </div>
                        </div>
                    )}
                    {formFields.retention_type === 'bytes' && (
                        <Form.Item name="retentionSizeValue" initialValue={retentionSizeValue}>
                            <div className="size-value">
                                <Input
                                    placeholder="Type"
                                    type="number"
                                    radiusType="semi-round"
                                    colorType="black"
                                    backgroundColorType="none"
                                    borderColorType="gray"
                                    width="90px"
                                    height="38px"
                                    onBlur={(e) => handleRetentionSizeChange(e)}
                                    onChange={(e) => handleRetentionSizeChange(e)}
                                    value={retentionSizeValue}
                                />
                                <p>bytes</p>
                            </div>
                        </Form.Item>
                    )}
                    {formFields.retention_type === 'messages' && (
                        <Form.Item name="retentionMessagesValue" initialValue={retentionMessagesValue}>
                            <div className="messages-value">
                                <Input
                                    placeholder="Type"
                                    type="number"
                                    radiusType="semi-round"
                                    colorType="black"
                                    backgroundColorType="none"
                                    borderColorType="gray"
                                    width="90px"
                                    height="38px"
                                    onBlur={(e) => handleRetentionMessagesChange(e)}
                                    onChange={(e) => handleRetentionMessagesChange(e)}
                                    value={retentionMessagesValue}
                                />
                                <p>messages</p>
                            </div>
                        </Form.Item>
                    )}
                </div>
                <div className="storage">
                    <p className="field-title">Storage Type</p>
                    <Form.Item name="storage_type" initialValue={formFields.storage_type}>
                        <RadioButton options={storageOptions} radioValue={formFields.storage_type} onChange={(e) => updateFormState('storage_type', e.target.value)} />
                    </Form.Item>
                </div>
                <div className="replicas">
                    <p className="field-title">Replicas</p>
                    <div className="replicas-value">
                        <Form.Item name="replicas" initialValue={formFields.replicas}>
                            <InputNumber
                                bordered={false}
                                min={1}
                                max={5}
                                keyboard={true}
                                value={formFields.replicas}
                                onChange={(e) => updateFormState('replicas', e.target.value)}
                            />
                        </Form.Item>
                        <p>replicas</p>
                    </div>
                </div>
                <div className="replicas-and-storage"></div>
                {chooseFactoryField && !loading && (
                    <div className="factory-name">
                        <p className="field-title">Factory name</p>
                        <Form.Item name="factory_name" initialValue={formFields.factory_name}>
                            <SelectComponent
                                value={formFields.factory_name}
                                colorType="navy"
                                backgroundColorType="none"
                                borderColorType="gray"
                                radiusType="semi-round"
                                width="450px"
                                height="40px"
                                options={factoryNames}
                                onChange={(e) => updateFormState('factory_name', e)}
                                dropdownClassName="select-options"
                            />
                        </Form.Item>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default CreateStationDetails;
