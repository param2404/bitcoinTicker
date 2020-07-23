/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import api from "../../api/api";
import { clientDateTime } from '../../@utils/currentDataTime';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const chartConfigs = {
    type: 'realtimeline',
    renderAt: 'container',
    width: '80%',
    height: '400',
    dataFormat: 'json',
};

let chartRef = FusionCharts("chartobject-1")

export default function Chart() {
    const [isLoading,setLoading]=useState(true)
    const [currentrate,setCurrentRate]=useState('')
    const [dataSource, setDataSource] = useState({
        "chart": {
            "showShadow": 1,
            "lineThickness": '15px',
            "lineColor": "#43A3F4",
            "numDivLines": '10',
            "divLineColor": "#00A3F4",
            "numVDivLines": '10',
            "vDivLineAlpha":40,
            "vDivLineDashed":1,
            "caption": "Bitcoin",
            "subCaption": "",
            "xAxisName": "Local Time",
            "yAxisName": "USD",
            "numberPrefix": "$",
            "refreshinterval": "2",
            "slantLabels": "1",
            // "yAxisMaxValue": '9550',
            // "yAxisMinValue": '9000',
            "numdisplaysets": "10",
            "labeldisplay": "rotate",
            "showValues": "0",
            "showRealTimeValue": "0",
            "theme": "fusion"
        },
        "categories": [{
            "category": [{
                "label": clientDateTime().toString()
            }]
        }],
        "dataset": [{
            "data": [{
                "value": 0
            }]
        }]
    })
 
    useEffect(() => {
        fetchData()
    }, [])


    useEffect(() => {
        const clock = setInterval(() => {
            startUpdatingData()
        }, 2000)
        return () => clearInterval(clock)
    }, [dataSource])


    
    const fetchData = () => {
        api().get('/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC', {
            mode: 'cors'
        })
            .then((response) => {
                let MyDataSource = dataSource;
                MyDataSource.chart.yAxisMaxValue = parseInt(response.data[0].price) + 100
                MyDataSource.chart.yAxisMinValue = parseInt(response.data[0].price) - 100
                MyDataSource.dataset[0]['data'][0].value = response.data[0].price;
                setCurrentRate(response.data[0].price)
                setLoading(false)
                setDataSource(MyDataSource)
            })
            .catch((error) => {
                console.log('error', error)
            })
    }


    const getChartRef = (chart) => {
        chartRef = chart;
    }


    const startUpdatingData = () => {
            api().get('/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC')
                .then(response => {
                    let x_axis = clientDateTime();
                    let y_axis = response.data[0].price;
                    setCurrentRate(response.data[0].price)
                    chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
                }).catch((error) => {
                    console.log('error', error)
                })
    }

    return (
        <>
           {currentrate !=='' && !isLoading && <h1 style={{color:'#000'}}>${currentrate}</h1>}
            <ReactFC
                {...chartConfigs}
                dataSource={dataSource}
                onRender={getChartRef.bind(this)} />
        </>
        
    )

}