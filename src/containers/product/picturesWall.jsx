import React, { PureComponent } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../config'
import { reqDeletePicture } from '../../api'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends PureComponent {

    state = {
        previewVisible: false,    //是否展示预览窗
        previewImage: '',         //要预览的图片的URL地址或base64编码
        previewTitle: '',         // 预览时 模态框展示的title
        fileList: [],
    };

    //关闭预览模态窗
    handleCancel = () => this.setState({ previewVisible: false });

    //点击文件（图片）链接或预览图标时的回调
    handlePreview = async file => {
        //如果图片没有url也没有转换过base64，那么调用如下方法把图片转成base64
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //当文件（图片）状态发生改变的回调 
    handleChange = async ({ file, fileList, event }) => {
        // 坑位：https://www.wolai.com/sGLMtoaFsCiSCMfZFTepCK#bQiRfVBbcLPQM2P573XBE9
        if (file.status === 'done') {
            let newFileObj = fileList[fileList.length - 1]
            // 把服务器返回的url和图片名显示出来
            // 因为是上传成功操作，此时newFileObj 即 file
            // const {  url } = newFileObj.response.data
            const { name, url } = file.response.data
            // 上传图片成功后，图片名经后台处理重命名后作为该图片的唯一标识保存于数据库中，并将包含图片名在内的相关信息返回了
            // 若不替换图片名，则后续跟图片相关的操作都将失败，因为没改名，没有唯一标识，拿图片本来的名字 访问不到该图片
            newFileObj.name = name
            newFileObj.url = url
        }
        if (file.status === 'removed') {
            let result = await reqDeletePicture(file.name)
            console.log(result);
            const { status, msg } = result
            if (status === 0) message.success('删除图片成功', 2)
            else message.error(msg, 2)
        }
        this.setState({ fileList })
    };

    // 父子传参 
    //从state → fileList提取出所有该商品对应的图片名字，构建一个数组，供新增商品按钮使用。
    getImgsName = () => {
        let imgsNameArr = []
        this.state.fileList.forEach(cur => imgsNameArr.push(cur.name))
        return imgsNameArr
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        );
        return (
            <>
                <Upload
                    action={`${BASE_URL}/api1/manage/img/upload`}
                    name="image"                      //发到后台的文件参数名,默认值为file，跟后台限制有关
                    // multiple                          //是否支持多选文件，开启后按住 ctrl 可选择多个文件，存在bug，见 我来 笔记
                    listType="picture-card"           //照片墙的展示方式
                    fileList={fileList}               //图片列表，一个数组里面包含着多个图片对象{uid:xxxx,name:xxx,status:xxx,url:xxx}
                    onPreview={this.handlePreview}    //点击预览按钮的回调
                    onChange={this.handleChange}      //图片状态改变的回调（上传中、完成、失败都会调用这个函数）
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
