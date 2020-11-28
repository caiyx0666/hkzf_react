import { Component } from "react";
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
import getCurrentCity from '../../utils/getCityInfo'
import axios from "axios";
import { Toast } from "antd-mobile";

const labelStyle = {
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
}

export default class Map extends Component {

    // 获取下一下需要展示的地图缩放级别和覆盖物的形状
    getTypeAndNextZoom() {
        // 获取当前地图缩放级别
        let zoom = this.map.getZoom()
        let nextZoom, type
        // 区 zoom  -> 11     nextZoom 13  type circle  zoom 11   10<zoom < 12
        // 镇 zoom  -> 13     nextZoom 15  type rect zoom 11   12 <zoom < 14
        // 小区 zoom -> 15    14 <zoom < 16
        console.log(zoom);
        if ( zoom > 12) {
            nextZoom = 15
            type = 'rect'
        }else if (10 < zoom < 12) {
            nextZoom = 13
            console.log('我变成13了');
            type = 'cicle'
        }else{
            nextZoom = 11
        }
        // console.log(nextZoom);
        return {
            nextZoom,
            type
        }
    }

    // 根据传递过来的城市id获取房源信息
    async renderOverlays(id) {
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`);
        
        // 根据获取到的房源信息渲染覆盖物
        this.createOverlays(this.mapList)
            
        // 关闭动画
        Toast.hide()
    }

    // 创建覆盖物
    createOverlays(mapList) {
        let { nextZoom,type } = this.getTypeAndNextZoom()
        console.log(nextZoom)
        mapList.forEach(item => {
            let { label: name, count, value, coord: { longitude, latitude } } = item
            let labelPoint = new window.BMap.Point(longitude, latitude)
    
            var opts = {
                position: labelPoint, // 指定文本标注所在的地理位置
                offset: new window.BMap.Size(-35, -35) // 设置文本偏移量
            };
            // 创建文本标注对象
            var label = new window.BMap.Label(`${name}<br/>${count}套`, opts);
            // label.setContent(`<p>${item.label}</p><p>${item.count}<p/>`)

            // 自定义文本标注样式
            label.setStyle(labelStyle);
            // 给绘制点添加点击事件
            label.addEventListener('click', () => {
                // 开启动画
                Toast.loading('加载中...',0,null,false)
                // 地图发生移动
                // map.panTo(labelPoint)
                // 放大地图
                // map.setZoom(13)
                this.map.centerAndZoom(labelPoint, nextZoom);
                // 清除原来的覆盖物
                setTimeout(() => {
                    this.map.clearOverlays()
                }, 0)
                // 请求镇的数据，渲染成覆盖物
                axios.get(`http://localhost:8080/area/map?id=${value}`).then(res => {
                    let mapList = res.data.body
                    console.log(mapList)
                    this.createOverlays(mapList)
                })

            })
            this.map.addOverlay(label)
            Toast.hide()
        })
    }
    // 创建圆形覆盖物
    createCircle() {

    }

    // 创建方形覆盖物
    createRect() {

    }

    async componentDidMount() {
        // 开启loading动画
        Toast.loading('加载中...', 0, null, false)

        // 发送请求获取房源信息
        let { label, value } = await getCurrentCity()
        let res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
        console.log(res.data.body);
        this.mapList = res.data.body

        var map = new window.BMap.Map("container");
        this.map = map

        //创建地址解析器实例
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, (point) => {
            if (point) {
                map.centerAndZoom(point, 11);

                // 添加地图控件
                map.addControl(new window.BMap.NavigationControl());
                map.addControl(new window.BMap.ScaleControl());

                // 传递城市名字获取房源信息
                this.renderOverlays(value);

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