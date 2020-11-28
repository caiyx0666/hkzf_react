import { Component } from "react";
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
import getCurrentCity from '../../utils/getCityInfo'
import axios from "axios";
import { Toast } from "antd-mobile";

export default class Map extends Component {
    async componentDidMount() {
        // 开启loading动画
        Toast.loading('加载中...',30)

        // 发送请求获取房源信息
        let { label, value } = await getCurrentCity()
        let res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
        console.log(res.data.body);
        let mapList = res.data.body

        var map = new window.BMap.Map("container");

        //创建地址解析器实例
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, function (point) {
            if (point) {
                map.centerAndZoom(point, 11);
                
                
                
                mapList.forEach(item => {
                    
                    var opts = {
                        position: new window.BMap.Point(item.coord.longitude,item.coord.latitude,), // 指定文本标注所在的地理位置
                        offset: new window.BMap.Size(-35, -35) // 设置文本偏移量
                    };
                    // 创建文本标注对象
                    var label = new window.BMap.Label(`${item.label}<br/>${item.count}套`, opts);
                    // label.setContent(`<p>${item.label}</p><p>${item.count}<p/>`)
                    // 自定义文本标注样式
                    label.setStyle({
                        color: '#fff',
                        borderRadius: '50%',
                        borderColor: '#fff',
                        borderSize: '1px',
                        backgroundColor: '#24b96b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70px',
                        height: '70px',
                        fontSize: '12px',
                        fontFamily: '微软雅黑'
                    });
                    // 给绘制点添加点击事件
                    map.addOverlay(label)
                })
                // 关闭动画
                Toast.hide()
                map.addControl(new window.BMap.NavigationControl());
                map.addControl(new window.BMap.ScaleControl());
                // map.addControl(new window.BMap.OverviewMapControl());


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