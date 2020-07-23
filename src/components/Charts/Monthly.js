/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import api from "../../api/api";
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import moment from 'moment';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const chartConfigs = {
    type: 'line',
    renderAt: 'chart-container',
    width: '80%',
    height: '450',
    dataFormat: 'json',
};

const endDate = moment(new Date).format('YYYY-MM-DD')

const startDate = moment(new Date().setDate(new Date().getDate() - 31)).format('YYYY-MM-DD')

export default function Chart() {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const dataSource = {
        "chart": {
            "theme": "fusion",
            "caption": "Bitcoin",
            "subCaption": "",
            "xAxisName": "Day",
            "yAxisName": "USD",
            "lineThickness": "2",
            "numDivLines": 10,
        },
    }


    useEffect(() => {
        fetchData(startDate, endDate)
    }, [])


    const fetchData = (startDate, endDate) => {
        api().get(`/exchange-rates/history?key=demo-26240835858194712a4f8cc0dc635c7a&currency=BTC&start=${startDate}T00%3A00%3A00Z&end=${endDate}T00%3A00%3A00Z`, {
            mode: 'cors'
        })
            .then((response) => {
                let result = []
                response.data.map((r) => {
                    result.push({ label: moment(r.timestamp).format('YYYY-MM-DD'), value: r.rate })
                })
                setLoading(false)
                setData(result)
            })
            .catch((error) => {
                console.log('error', error)
            })
    }



    return (
        data.length > 0 && !isLoading  ? <ReactFC
            {...chartConfigs}
            dataSource={{ ...dataSource, data }} /> : <h3 style={{ color: '#000' }}>Loading...Please Wait..</h3>
    )

}