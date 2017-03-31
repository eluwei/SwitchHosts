/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

import React from 'react'
import Editor from './editor'
import Agent from '../../../renderer/Agent'
import classnames from 'classnames'
import './content.less'

export default class Content extends React.Component {

  constructor (props) {
    super(props)

    this.codemirror = null
    this.state = {
      is_loading: this.props.current.is_loading,
      code: this.props.current.content || ''
    }
    this._t = null

    Agent.on('loading', (hosts) => {
      if (hosts === this.props.current) {
        this.setState({
          is_loading: true
        })
      }
    })

    Agent.on('loading_done', (hosts, data) => {
      if (hosts === this.props.current) {
        this.setState({
          is_loading: false,
          code: data.content || ''
        })
      }
    })
  }

  setValue (v) {
    this.props.setHostsContent(v)
  }

  componentWillReceiveProps (next_props) {
    this.setState({
      is_loading: next_props.current.is_loading,
      code: next_props.current.content || ''
    })
  }

  render () {
    let {current} = this.props

    return (
      <div id="sh-content">
        <div className="inform">
                    <span
                      className={classnames({
                        loading: 1,
                        show: this.state.is_loading
                      })}
                    >loading...</span>
          <i
            className={classnames({
              show: current.where === 'remote',
              iconfont: 1,
              'icon-earth': 1
            })}
            title={Agent.lang.remote_hosts}
          />
          <i
            className={classnames({
              show: this.props.readonly,
              iconfont: 1,
              'icon-lock2': 1
            })}
            title={Agent.lang.readonly}
          />
        </div>
        <div className={classnames({
          errorMessage: 1,
          show: !!this.props.current.error
        })}>{this.props.current.error}</div>
        <Editor
          code={this.state.code}
          readonly={this.props.readonly}
          setValue={this.setValue.bind(this)}/>
      </div>
    )
  }
}