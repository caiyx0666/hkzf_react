import { Component } from "react";
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import getCurrentCity from '../../utils/getCityInfo'
// import axios from "axios";

import API  from '../../utils/api';
import { Toast } from "antd-mobile";

// 原型覆盖物的样式
const cicleStyle = {
    color: '#fff',
    borderRadius: '50%',
    borderColor: '#fff',
    borderSize: '1px',
    backgroundColor: '#24b96b',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70px',
    height: '70px',
    fontSize: '12px',
    fontFamily: '微软雅黑'
}

// 方形覆盖物样式
const rectStyle = {
    color: '#fff',
    backgroundColor: '#24b96b',
    border: 'none',
    padding: '0 10px',
    height: '20px',
    lineHeight: '20px',
    fontSize: '12px',
    fontFamily: '微软雅黑'
}

export default class Map extends Component {
    state = {
        houselist: [],
        show: false
    }
    // 获取下一下需要展示的地图缩放级别
    getTypeAndNextZoom() {
        // 获取当前地图缩放级别
        let zoom = this.map.getZoom()
        let nextZoom
        // 区 zoom  -> 11     nextZoom 13  type circle  zoom 11   10<zoom < 12
        // 镇 zoom  -> 13     nextZoom 15  type rect zoom 11   12 <zoom < 14
        // 小区 zoom -> 15    14 <zoom < 16
        if (zoom > 12) {
            nextZoom = 15
        } else if (10 < zoom < 12) {
            nextZoom = 13
        } else {
            nextZoom = 11
        }
        // console.log(nextZoom);
        return {
            nextZoom,
        }
    }

    // 根据传递过来的城市id获取房源信息
    async renderOverlays() {
        // 根据获取到的房源信息渲染覆盖物
        this.createOverlays(this.mapList)

        // 关闭动画
        Toast.hide()
    }

    // 加载地图
    async getMap() {

        // 开启loading动画
        Toast.loading('加载中...', 0, null, false)

        // 发送请求获取房源信息
        let { label, value } = await getCurrentCity()
        let res = await API.get(`http://localhost:8080/area/map?id=${value}`)
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
                this.renderOverlays();

                // map.addControl(new window.BMap.OverviewMapControl());


                // map.addOverlay(new window.BMapGL.Marker(point, { title: label }))
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
    }

    // 创建覆盖物
    createOverlays(mapList) {
        let { nextZoom } = this.getTypeAndNextZoom()
        // console.log(nextZoom)
        mapList.forEach(item => {
            let { label: name, count, value, coord: { longitude, latitude } } = item
            let labelPoint = new window.BMap.Point(longitude, latitude)

            var opts = {
                position: labelPoint, // 指定文本标注所在的地理位置
                offset: new window.BMap.Size(-60, -10) // 设置文本偏移量
            };
            let zoom = this.map.getZoom()
            // 判断应该显示的样式
            if (zoom !== 15) {
                // 创建文本标注对象
                var label = new window.BMap.Label(`<div className="${styles.rectStyle}">${name}<br/>${count}套</div>`, opts);
                // label.setContent(`<p>${item.label}</p><p>${item.count}<p/>`)

                // 自定义文本标注样式
                label.setStyle(cicleStyle);
                // 给绘制点添加点击事件

                label.addEventListener('click', () => {
                    // 开启动画
                    Toast.loading('加载中...', 0, null, false)
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
                    API.get(`http://localhost:8080/area/map?id=${value}`).then(res => {
                        let mapList = res.data.body
                        this.createOverlays(mapList)
                    })

                })
            } else {
                // 创建文本标注对象
                var label = new window.BMap.Label(`
                    <div>${name.substring(0, 4)}...${count}套</div>
                    <i class="${styles.traingle}"></i>
                `, opts);
                // label.setContent(`<p>${item.label}</p><p>${item.count}<p/>`)

                // 自定义文本标注样式
                label.setStyle(rectStyle);
                // 给绘制点添加点击事件
                label.addEventListener('click', () => {
                    // 移动到中心点
                    this.map.panTo(labelPoint)
                    // 开启动画
                    Toast.loading('加载中...', 0, null, false)

                    API.get(`http://localhost:8080/houses?cityId=${value}`).then(res => {
                        Toast.hide()
                        let { list } = res.data.body
                        this.setState({
                            houselist: list,
                            show: true
                        })
                        console.log(list);
                    })
                })

                this.map.addEventListener('dragstart',()=>{
                    this.setState({
                        show: false
                    })
                })
            }

            this.map.addOverlay(label)
            Toast.hide()
        })
    }

    componentDidMount() {
        this.getMap()
    }

    render() {
        return (
            <div className={styles.mapWrapper}>
                <NavHeader>地图找房</NavHeader>
                <div id="container"></div>

                <div className={[styles.housearea, this.state.show ? styles.show : ''].join(' ')}>
                    <div className={styles.title}>
                        <h3>房源列表</h3>
                        <div>更多房源</div>
                    </div>

                    <div className={styles.houselist}>
                        {this.state.houselist.length ? this.state.houselist.map(item => (
                            <div className={styles.houseItem} key={item.houseCode}>
                                <img src={`http://localhost:8080${item.houseImg}`}  alt=""/>
                                <div className={styles.houseRight}>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                    <div>
                                        {item.tags[0] ? <span className={styles.houseTag1}>{item.tags[0]}</span> : ''}
                                        {item.tags[1] ? <span className={styles.houseTag2}>{item.tags[1]}</span> : ''}
                                    </div>
                                    <div className={styles.price}>
                                        <span>{item.price}</span> 元/月
                                    </div>
                                </div>
                            </div>
                        )) : ''}
                    </div>
                </div>
            </div>
        )
    }
}