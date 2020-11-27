import { Component } from "react";
import './index.scss'
import NavHeader from '../../components/NavHeader'

export default class Map extends Component {
    componentDidMount(){
        var map = new window.BMap.Map("container");
        var point = new window.BMap.Point(116.404, 39.915); 
        map.centerAndZoom(point, 15);
    }
    render(){
        return(
            <div className="map-wrapper">
                <NavHeader>地图找房</NavHeader>
                <div id="container"></div> 
            </div>
        )
    }
}