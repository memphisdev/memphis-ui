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

import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import React, { useEffect, useState } from 'react';

import Button from '../button';

const TransitionsModal = (props) => {
    const {
        height,
        width,
        rBtnText,
        lBtnText,
        rBtnDisabled,
        lBtnDisabled,
        header,
        confirm,
        minHeight,
        minWidth,
        progress,
        isLoading,
        warning,
        border,
        hr = true
    } = props;

    const useStyles = makeStyles((theme) => ({
        dialogPaper: {
            display: 'flex',
            // padding: "10px",
            justifyContent: 'center',
            width: width,
            height: height,
            border: border,
            borderRadius: '4px',
            minWidth: minWidth || '703px',
            minHeight: minHeight,
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'relative'
        },
        dialogPaperConfirm: {
            display: 'flex',
            justifyContent: 'center',
            width: props.width ? props.width : '500px',
            height: props.height ? props.height : '230px',
            minWidth: minWidth || '703px',
            minHeight: minHeight,
            border: border,
            borderRadius: '4px',
            overflowY: 'auto'
        },
        buttonLoader: {
            color: '#f7f7f7',
            marginTop: '5px'
        }
    }));

    const classes = useStyles();
    const [open, setOpen] = useState(props);

    useEffect(() => {
        function handleEscapeKey(event) {
            if (event.code === 'Escape') {
                props.clickOutside();
            }
        }
        document.addEventListener('keyup', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);

    return confirm ? (
        <Dialog
            onClose={(_, reson) => {
                if (reson === 'backdropClick') {
                    props.clickOutside();
                }
            }}
            open={props.open}
            aria-labelledby="form-dialog-title"
            classes={{ paper: classes.dialogPaperConfirm }}
        >
            <DialogContent
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                }}
            >
                <span className="header-container">
                    {warning && (
                        <WarningRoundedIcon
                            style={{
                                fontSize: '30px',
                                color: '#fbbd71',
                                marginRight: '10px'
                            }}
                        />
                    )}
                    <p className="modal-header">{header}</p>
                    <CloseIcon onClick={() => props.clickOutside()} style={{ cursor: 'pointer' }} />
                </span>
                {props.children}
            </DialogContent>
            <DialogActions>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '10px'
                    }}
                >
                    <Button
                        className="modal-btn"
                        width="83px"
                        height="32px"
                        placeholder="Close"
                        colorType="white"
                        radiusType="circle"
                        backgroundColorType={warning ? 'orange' : 'purple'}
                        fontSize="12px"
                        fontWeight="600"
                        onClick={() => {
                            props.rBtnClick();
                            setOpen(false);
                        }}
                    />
                </div>
            </DialogActions>
        </Dialog>
    ) : (
        <Dialog
            open={props.open}
            onClose={(_, reson) => {
                if (reson === 'backdropClick') {
                    props.clickOutside();
                }
            }}
            aria-labelledby="form-dialog-title"
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogContent
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                }}
            >
                <span className="header-container">
                    {warning && (
                        <WarningRoundedIcon
                            style={{
                                fontSize: '30px',
                                color: '#fbbd71',
                                marginRight: '10px'
                            }}
                        />
                    )}
                    <p className="modal-header">{header}</p>
                    <CloseIcon onClick={() => props.clickOutside()} style={{ cursor: 'pointer' }} />
                </span>
                {props.children}
            </DialogContent>
            <DialogActions>
                {hr && <hr />}
                <div className="btnContainer">
                    <button className="cancel-button" disabled={lBtnDisabled} onClick={() => props.lBtnClick()}>
                        {lBtnText}
                    </button>
                    <Button
                        className="modal-btn"
                        width="83px"
                        height="32px"
                        placeholder={progress ? <CircularProgress size={20} className={classes.buttonLoader} /> : rBtnText}
                        disabled={rBtnDisabled}
                        colorType="white"
                        radiusType="circle"
                        backgroundColorType={warning ? 'orange' : 'purple'}
                        fontSize="12px"
                        fontWeight="600"
                        isLoading={isLoading}
                        onClick={() => {
                            props.rBtnClick();
                        }}
                    />
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default TransitionsModal;
