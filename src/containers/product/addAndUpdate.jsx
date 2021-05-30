import React, { PureComponent } from 'react'

export default class AddAndUpdate extends PureComponent {
    render() {
        return (
            <div>
                添加或修改商品{this.props.match.params.id}
            </div>
        )
    }
}
