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

import { Button as ButtonDesign } from 'antd';
import React from 'react';

import { getBorderRadius, getFontColor, getBackgroundColor, getBoxShadows } from '../../utils/styleTemplates';

const Button = (props) => {
    const {
        width,
        height,
        placeholder,
        radiusType,
        colorType,
        onClick,
        backgroundColorType,
        fontSize,
        fontWeight,
        disabled,
        margin,
        isLoading,
        padding,
        textAlign,
        minWidth,
        marginBottom,
        marginTop,
        marginRight,
        boxShadowStyle,
        minHeight,
        zIndex,
        border,
        alignSelf
    } = props;

    const handleClick = (e) => {
        onClick(e);
    };

    const borderRadius = getBorderRadius(radiusType);
    const color = getFontColor(colorType);
    const backgroundColor = getBackgroundColor(backgroundColorType);
    const borderColor = border ? getBackgroundColor(border) : backgroundColor;
    const opacity = disabled ? '0.5' : '1';
    const boxShadow = getBoxShadows(boxShadowStyle);

    const styleButtonContainer = {
        margin: margin,
        textAlign: textAlign,
        marginBottom: marginBottom,
        marginTop: marginTop,
        marginRight: marginRight,
        alignSelf: alignSelf
    };

    const fieldProps = {
        onClick: handleClick,
        disabled,
        style: {
            borderRadius,
            color,
            backgroundColor,
            width,
            height,
            borderColor,
            fontSize,
            fontWeight,
            opacity,
            minHeight: minHeight,
            minWidth: minWidth || '60px',
            padding,
            zIndex: zIndex,
            boxShadow
        },
        loading: isLoading
    };

    return (
        <div className="button-container" style={styleButtonContainer}>
            <ButtonDesign {...fieldProps} type="primary" htmlType="submit">
                {placeholder}
            </ButtonDesign>
        </div>
    );
};

export default Button;
