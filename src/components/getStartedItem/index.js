import React, { useContext } from 'react';
import TitleComponent from '../titleComponent';
import './style.scss';
import Button from '../button';
import { GetStartedStoreContext } from '../../domain/overview/getStarted';

const GetStartedItem = (props) => {
    const { headerImage, headerTitle, headerDescription, style, children, onNext } = props;
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);

    return (
        <div className="get-started-wrapper">
            <div className="get-started-container" style={style?.container}>
                <img className="header-image" src={headerImage} alt={headerImage} style={style?.image}></img>
                <TitleComponent className="header-description" headerTitle={headerTitle} headerDescription={headerDescription} style={style}></TitleComponent>
                {children}
            </div>
            {getStartedState.isHiddenButton === false ? (
                <Button
                    width={getStartedState?.currentStep === 5 ? '190px' : '129px'}
                    height="42px"
                    placeholder={getStartedState?.currentStep === 5 ? 'Lanuch Dashboard' : 'Next'}
                    colorType="white"
                    radiusType="circle"
                    alignSelf="flex-end"
                    backgroundColorType={'purple'}
                    fontSize="16px"
                    fontWeight="bold"
                    htmlType="submit"
                    marginTop="27px"
                    disabled={getStartedState?.nextDisable}
                    onClick={() => onNext()}
                    isLoading={getStartedState?.isLoading}
                />
            ) : null}
        </div>
    );
};

export default GetStartedItem;
