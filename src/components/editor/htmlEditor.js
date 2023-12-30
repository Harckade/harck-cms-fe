import React from 'react';
import MDEditor, { commands, bold, italic, strikethrough, hr, link, quote, codeBlock, image, unorderedListCommand, orderedListCommand, checkedListCommand } from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import {MdOutlineOndemandVideo} from 'react-icons/md';
import { useSelector } from 'react-redux';

export const HtmlEditor = ({ updateContent, defaultContents, disabled }) => {
    const settings = useSelector(state => state.settings);
    //default Buttom list is complex: https://github.com/mkhstar/suneditor-react/blob/master/src/misc/buttonList.ts
    const video = {
        name: 'video',
        keyCommand: 'video',
        buttonProps: { 'aria-label': 'Insert video' },
        icon: <MdOutlineOndemandVideo/>,
        execute: (state, api) => {
          let modifyText = `${state.selectedText}<video width="320" height="240" controls>\n <source src="VIDEO_URL" type="video/mp4">\n</video>`;
          api.replaceSelection(modifyText);
        },
      };

    return (
        <div data-color-mode={settings.darkmode ? "dark": "light"}>
            <MDEditor minHeight='500' height='70vh'
                value={defaultContents}
                onChange={disabled ? undefined: updateContent}
                commands={
                    [
                        // Custom Toolbars
                        bold, italic, strikethrough, hr,
                        commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
                            name: 'title',
                            groupName: 'title',
                            buttonProps: { 'aria-label': 'Insert title' }
                        }),
                        commands.divider,
                        link, quote, codeBlock, image, video,
                        commands.divider,
                        unorderedListCommand,
                        orderedListCommand,
                        checkedListCommand
                    ]
                }
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize({attributes: ['video']})]],
                }}
            />
        </div>
    );
}