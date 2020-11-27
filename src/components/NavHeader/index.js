import { NavBar, Icon } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import styles from './index.module.css';

function NavHeader(props) {
    const defaultHandle = () =>{props.history.go(-1)}
    return (
        <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={props.onLeftClick || defaultHandle}
        >{props.children}</NavBar>
    )
}

NavHeader.propTypes ={
    children: propTypes.string.isRequired,
    onLeftClick: propTypes.func
}

export default withRouter(NavHeader)