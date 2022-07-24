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

import { Select } from 'antd';
import React from 'react';

import { getFontColor, getBackgroundColor, getBorderColor, getBoxShadows, getBorderRadius } from '../../utils/styleTemplates';
import Arrow from '../../assets/images/arrow.svg';

const { Option } = Select;

const SelectComponent = (props) => {
    const {
        options = [],
        width,
        onChange,
        colorType,
        value,
        backgroundColorType,
        borderColorType,
        dropdownClassName,
        boxShadowsType,
        radiusType,
        size,
        dropdownStyle,
        height,
        customOptions,
        disabled
    } = props;

    const handleChange = (e) => {
        onChange(e);
    };

    const color = getFontColor(colorType);
    const backgroundColor = getBackgroundColor(backgroundColorType);
    const borderColor = getBorderColor(borderColorType);
    const boxShadow = getBoxShadows(boxShadowsType);
    const borderRadius = getBorderRadius(radiusType);

    const fieldProps = {
        onChange: handleChange,
        disabled,
        style: {
            width,
            color,
            backgroundColor,
            boxShadow,
            borderColor,
            borderRadius,
            height: height || '40px'
        }
    };

    return (
        <div className="select-container">
            <Select
                {...fieldProps}
                className="select"
                size={size}
                dropdownClassName={dropdownClassName}
                value={value}
                suffixIcon={<img src={Arrow} alt="select-arrow" />}
                dropdownStyle={dropdownStyle}
            >
                {customOptions && options}
                {!customOptions &&
                    options.map((option) => (
                        <Option key={option?.id || option} disabled={option?.disabled || false}>
                            {option?.name || option}
                        </Option>
                    ))}
            </Select>
        </div>
    );
};

export default SelectComponent;
