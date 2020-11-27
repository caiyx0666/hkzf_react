import { Component } from "react";
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
import getCurrentCity from '../../utils/getCityInfo'

export default class Map extends Component {
    async componentDidMount() {
        let { label } = await getCurrentCity()
        var map = new window.BMap.Map("container");
        //创建地址解析器实例
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, function (point) {
            if (point) {
                map.centerAndZoom(point, 11);
                // map.addOverlay(new window.BMapGL.Marker(point, { title: label }))
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
    }
    render() {
        return (
            <div className={styles.mapWrapper}>
                <NavHeader>地图找房</NavHeader>
                <div id="container"></div>
            </div>
        )
    }
}