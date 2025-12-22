import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetNewsletter from 'grapesjs-preset-newsletter';
import { Alert } from 'react-bootstrap';
import * as R from 'ramda';

export const Editor = ({ langKey, updateContent, defaultContents = '' }) => {
    const editorRef = useRef(null);
    const containerId = `newsletter-editor-${langKey}`;
    const containerRef = useRef(null);

    useEffect(() => {

        const editor = grapesjs.init({
            container: containerRef.current,
            height: '80vh',
            fromElement: true,
            plugins: [gjsPresetNewsletter],
            pluginsOpts: {
                mjml: {},
                'gjs-preset-newsletter': {
                    // Newsletter preset options
                    modalTitleImport: 'Import Newsletter',
                    modalLabelImport: '',
                    modalTitleExport: 'View code',
                    modalLabelExport: '',
                },
            }
        });

        editorRef.current = editor;

        const handleBeforeUnload = () => {
            var htmlWithCss = editor.runCommand('gjs-get-inlined-html');
            localStorage.setItem(langKey, htmlWithCss);
        };

        const handleComponentUpdate = () => {
            var htmlWithCss = editor.runCommand('gjs-get-inlined-html');
            updateContent(htmlWithCss);
        };

        editor.on('component:update', handleComponentUpdate);
        window.addEventListener('beforeunload', handleBeforeUnload);
        editor.on('load', () => {
            if (defaultContents) {
                editor.setComponents(defaultContents);
            }
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (!R.isNil(editorRef.current)) {
                const editor = editorRef.current;

                // Check if a component is selected before clearing
                if (editor.getSelected()) {
                    editor.getSelected().remove();
                }

                // Clear the DOM components
                editor.DomComponents.clear();

                // Clear the component collection
                const components = editor.getComponents();
                if (!R.isNil(components)){
                    components.reset();
                }
                editor.setComponents('');
                editor.store(); // Save empty content to prevent loading from cache
                editor.destroy();
            }
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!R.isNil(editorRef.current)]);

    return (
        <div>
            {defaultContents.includes("{{unsubscribeUrl}}") ? '' :
                <Alert variant="danger">
                    It is mandatory to include an hiperlink with {"{{unsubscribeUrl}}"} string.
                </Alert>}
            <div ref={containerRef} id={containerId}/>
        </div>
    );
};

export default Editor;
