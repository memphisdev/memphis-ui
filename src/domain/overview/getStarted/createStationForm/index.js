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

import React, { useState, useEffect, useContext } from 'react';
import { Form, InputNumber } from 'antd';
import Input from '../../../../components/Input';
import RadioButton from '../../../../components/radioButton';
import './style.scss';
import { convertDateToSeconds, convertSecondsToDateObject } from '../../../../services/valueConvertor';
import { ApiEndpoints } from '../../../../const/apiEndpoints';
import { httpRequest } from '../../../../services/http';
import { GetStartedStoreContext } from '..';
import TitleComponent from '../../../../components/titleComponent';

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

const CreateStationForm = (props) => {
    const { createStationFormRef } = props;
    const [creationForm] = Form.useForm();
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);

    const [formFields, setFormFields] = useState({
        factory_name: '',
        name: '',
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

    useEffect(() => {
        createStationFormRef.current = onFinish;
        getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: true });
        saveFormField();
    }, []);

    useEffect(() => {
        if (formFields.factory_name !== '' && formFields.name !== '') {
            getStartedDispatch({ type: 'SET_NEXT_DISABLE', payload: false });
        }
    }, [formFields]);

    const saveFormField = () => {
        if (getStartedState?.formFieldsCreateStation) {
            setFormFields({
                factory_name: getStartedState?.formFieldsCreateStation?.factory_name,
                name: getStartedState?.formFieldsCreateStation?.name,
                retention_type: getStartedState?.formFieldsCreateStation?.retention_type,
                retention_value: getStartedState?.formFieldsCreateStation?.retention_value,
                storage_type: getStartedState?.formFieldsCreateStation?.storage_type,
                replicas: getStartedState?.formFieldsCreateStation?.replicas
            });
            if (getStartedState?.formFieldsCreateStation?.retention_type === 'bytes') {
                setRetentionSizeValue(getStartedState?.formFieldsCreateStation?.retention_value);
            }
            if (getStartedState?.formFieldsCreateStation?.retention_type === 'messages') {
                setRetentionMessagesValue(getStartedState?.formFieldsCreateStation?.retention_value);
            }
            if (getStartedState?.formFieldsCreateStation?.retention_type === 'message_age_sec') {
                const timeObject = convertSecondsToDateObject(getStartedState?.formFieldsCreateStation?.retention_value);
                const { days, hours, minutes, seconds } = timeObject;
                setTimeSeparator({
                    days,
                    hours,
                    minutes,
                    seconds
                });
            }
        } else {
            setFormFields({ factory_name: '', name: '', retention_type: 'message_age_sec', retention_value: '', storage_type: 'file', replicas: 1 });
            setRetentionMessagesValue('10');
            setRetentionSizeValue('1000');
            setTimeSeparator({ days: 7, hours: 0, minutes: 0, seconds: 0 });
        }
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
        try {
            getStartedDispatch({ type: 'IS_LOADING', payload: true });
            setTimeout(async () => {
                const values = await creationForm.validateFields();
                if (values?.errorFields || values.name === undefined || values.factory_name === undefined) {
                    return;
                } else {
                    if (values.retention_type === 'message_age_sec') {
                        values['retention_value'] = convertDateToSeconds(values.days, values.hours, values.minutes, values.seconds);
                    } else if (values.retention_type === 'bytes') {
                        values['retention_value'] = Number(values.retentionSizeValue);
                    } else {
                        values['retention_value'] = Number(values.retentionMessagesValue);
                    }
                    if (
                        values.name === getStartedState?.formFieldsCreateStation?.name ||
                        values.factory_name === getStartedState?.formFieldsCreateStation?.factory_name
                    ) {
                        return;
                    }
                    try {
                        const bodyRequest = {
                            name: values.name,
                            factory_name: values.factory_name,
                            retention_type: values.retention_type,
                            retention_value: values.retention_value,
                            storage_type: values.storage_type,
                            replicas: values.replicas
                        };
                        createStation(bodyRequest);
                    } catch (error) {}
                }
            }, 1000);
        } catch (error) {
            console.log(`validate error ${JSON.stringify(error)}`);
        }
    };

    const createStation = async (bodyRequest) => {
        try {
            const data = await httpRequest('POST', ApiEndpoints.CREATE_STATION, bodyRequest);
            if (data) {
                getStartedDispatch({ type: 'IS_LOADING', payload: false });
                getStartedDispatch({ type: 'SET_FACTORY', payload: bodyRequest.factory_name });
                getStartedDispatch({ type: 'SET_STATION', payload: data.name });
                getStartedDispatch({ type: 'SET_FORM_FIELDS_CREATE_STATION', payload: bodyRequest });
                getStartedDispatch({ type: 'SET_CURRENT_STEP', payload: getStartedState?.currentStep + 1 });
            }
        } catch (error) {
            getStartedDispatch({ type: 'IS_LOADING', payload: false });
            console.log(error);
        }
    };

    const updateFormState = (field, value) => {
        let updatedValue = { ...formFields };
        updatedValue[field] = value;
        setFormFields((formFields) => ({ ...formFields, ...updatedValue }));
    };

    return (
        <Form name="form" form={creationForm} autoComplete="off" className="create-station-form-getstarted">
            <Form.Item
                name="factory_name"
                rules={[
                    {
                        required: true,
                        message: 'Type here'
                    }
                ]}
                style={{ marginBottom: '10px' }}
            >
                <div>
                    <div style={{ display: 'flex' }}>
                        <p className="field-title">
                            <span className="required-field-mark">* </span>
                        </p>

                        <TitleComponent
                            headerTitle="Enter factory name"
                            typeTitle="sub-header"
                            headerDescription="A factory presents the application/use case that the user requires to build, and, within it, all the stations (queues) that establish the use case"
                        ></TitleComponent>
                    </div>

                    <Input
                        placeholder="Type factory name"
                        type="text"
                        radiusType="semi-round"
                        colorType="black"
                        backgroundColorType="none"
                        borderColorType="gray"
                        width="450px"
                        height="40px"
                        onBlur={(e) => updateFormState('factory_name', e.target.value)}
                        onChange={(e) => {
                            updateFormState('factory_name', e.target.value);
                        }}
                        value={formFields.factory_name}
                    />
                </div>
            </Form.Item>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Type here'
                    }
                ]}
                style={{ marginBottom: '10px' }}
            >
                <div>
                    <div style={{ display: 'flex' }}>
                        <p className="field-title">
                            <span className="required-field-mark">* </span>
                        </p>{' '}
                        <TitleComponent
                            headerTitle="Enter station name"
                            typeTitle="sub-header"
                            headerDescription="RabbitMQ has queues, Kafka has topics, and Memphis has stations"
                        ></TitleComponent>
                    </div>

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

            <div>
                <TitleComponent
                    headerTitle="Retention type"
                    typeTitle="sub-header"
                    headerDescription="By which criteria messages will be expel from the station"
                ></TitleComponent>
                <Form.Item name="retention_type" initialValue={formFields.retention_type}>
                    <RadioButton
                        className="radio-button"
                        options={retanionOptions}
                        radioValue={formFields.retention_type}
                        optionType="button"
                        style={{ marginRight: '20px', content: '' }}
                        onChange={(e) => updateFormState('retention_type', e.target.value)}
                    />
                </Form.Item>

                {formFields.retention_type === 'message_age_sec' && (
                    <div className="time-value">
                        <div className="days-section">
                            <Form.Item name="days" initialValue={timeSeparator?.days}>
                                <InputNumber bordered={false} min={0} max={100} keyboard={true} onChange={(e) => handleDaysChange(e)} value={timeSeparator?.days} />
                            </Form.Item>
                            <p>days</p>
                        </div>
                        <p className="separator">:</p>
                        <div className="hours-section">
                            <Form.Item name="hours" initialValue={timeSeparator?.hours}>
                                <InputNumber bordered={false} min={0} max={24} keyboard={true} onChange={(e) => handleHoursChange(e)} value={timeSeparator?.hours} />
                            </Form.Item>
                            <p>hours</p>
                        </div>
                        <p className="separator">:</p>
                        <div className="minutes-section">
                            <Form.Item name="minutes" initialValue={timeSeparator?.minutes}>
                                <InputNumber bordered={false} min={0} max={60} keyboard={true} onChange={(e) => handleMinutesChange(e)} value={timeSeparator?.minutes} />
                            </Form.Item>
                            <p>minutes</p>
                        </div>
                        <p className="separator">:</p>
                        <div className="seconds-section">
                            <Form.Item name="seconds" initialValue={timeSeparator?.seconds}>
                                <InputNumber bordered={false} min={0} max={60} keyboard={true} onChange={(e) => handleSecondsChange(e)} value={timeSeparator?.seconds} />
                            </Form.Item>
                            <p>seconds</p>
                        </div>
                    </div>
                )}
                {formFields.retention_type === 'bytes' && (
                    <Form.Item name="retentionSizeValue" initialValue={retentionSizeValue}>
                        <div>
                            <Input
                                placeholder="Type"
                                type="number"
                                radiusType="semi-round"
                                colorType="black"
                                backgroundColorType="none"
                                borderColorType="gray"
                                width="90px"
                                height="38px"
                                onBlur={handleRetentionSizeChange}
                                onChange={handleRetentionSizeChange}
                                value={retentionSizeValue}
                            />
                            <p>bytes</p>
                        </div>
                    </Form.Item>
                )}
                {formFields.retention_type === 'messages' && (
                    <Form.Item name="retentionMessagesValue" initialValue={retentionMessagesValue}>
                        <div>
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
            <div className="storage-replicas-container">
                <div>
                    <TitleComponent
                        // style={{ width: '15vw' }}
                        headerTitle="Storage type"
                        typeTitle="sub-header"
                        headerDescription="Type of message persistence"
                        style={{ description: { width: '18vw' } }}
                    ></TitleComponent>
                    <Form.Item name="storage_type" initialValue={formFields.storage_type}>
                        <RadioButton
                            options={storageOptions}
                            radioValue={formFields.storage_type}
                            optionType="button"
                            onChange={(e) => updateFormState('storage_type', e.target.value)}
                        />
                    </Form.Item>
                </div>
                <div>
                    <TitleComponent
                        headerTitle="Replicas"
                        typeTitle="sub-header"
                        headerDescription="Amount of mirrors per message"
                        style={{ description: { width: '16vw' } }}
                    ></TitleComponent>
                    <div>
                        <Form.Item name="replicas" initialValue={formFields.replicas}>
                            <InputNumber bordered={false} min={1} max={5} keyboard={true} value={formFields.replicas} onChange={(e) => updateFormState('replicas', e)} />
                        </Form.Item>
                    </div>
                </div>
            </div>
        </Form>
    );
};
export default CreateStationForm;
