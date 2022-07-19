import React from 'react';
import './style.scss';
import EditorCodeSnippet from '../editorCodeSnippet';
import CopyClipboard from '../../assets/images/copyClipboard.svg';
import ClickableImage from '../clickableImage';

const CodeSnippet = (props) => {
    const { languageOption, codeSnippet } = props;

    const options = (EditorCodeSnippet.IStandaloneEditorConstructionOptions = {
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        selectionHighlight: true,
        renderLineHighlight: 'none',
        scrollbar: {
            verticalScrollbarSize: 3,
            horizontalScrollbarSize: 3
        }
    });

    const onCopy = () => {
        navigator.clipboard.writeText(codeSnippet);
    };

    return (
        <div className="editor-code-snippet-container">
            <EditorCodeSnippet height="23vh" path={languageOption?.name} options={options} language={languageOption?.language} value={codeSnippet} />
            <ClickableImage className="clipboard-image" image={CopyClipboard} onClick={onCopy}></ClickableImage>
        </div>
    );
};

export default CodeSnippet;
