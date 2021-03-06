import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


export default class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,    //构建一个初始化状态的编辑器+内容
        });
    };

    // 将富文本转为HTML 并传给addAndUpdate.jsx 从而提交给服务器
    editorConvertToHTML = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    // 修改商品页 将后台返回的html数据展示出来
    HTMLConvertToEditor = (html) => {
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            this.setState({editorState})
        }
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorStyle={{
                        border: ' 1px solid gray',
                        paddingLeft: '10px',
                        lineHeight: '20px',
                        minHeight: '200px'
                    }}
                    editorState={editorState}
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        );
    }
}