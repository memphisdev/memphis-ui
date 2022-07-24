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

import React from 'react';
import RightArrow from '../../../../assets/images/rightArrow.svg';
import './style.scss';
import Done from '../../../../assets/images/done.svg';

const SideStep = (props) => {
    const { stepNumber, stepName, currentStep } = props;
    return (
        <div className="side-step-container" style={currentStep === stepNumber ? { backgroundColor: '#F0EEFF' } : {}}>
            <div className="number-name-container">
                <div className="step-number-container" style={currentStep >= stepNumber ? { backgroundColor: 'white' } : {}}>
                    {currentStep > stepNumber ? (
                        <div className="done-image">
                            <img src={Done} alt="done" />
                        </div>
                    ) : (
                        <p className="step-number">{stepNumber}</p>
                    )}
                </div>
                <p className="step-name" style={currentStep === stepNumber ? { color: '#2E2C34' } : {}}>
                    {stepName}
                </p>
            </div>
            <div className="arrow-container">{currentStep === stepNumber && <img src={RightArrow} alt="select-arrow" />}</div>
        </div>
    );
};
export default SideStep;
