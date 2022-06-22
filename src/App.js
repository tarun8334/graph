import logo from './logo.svg';
import './App.css';
import { createClient } from 'urql'
import { useEffect, useState } from 'react'
import LOGO_SOLANA from './img/solana-sol-logo.png';
import Vector from './img/Vector.png';
import ReactApexChart from 'react-apexcharts'
const APIURL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon";

const query = `
  query {
    tokenHourDatas(
      first: 100
      skip: 0
      where: {token: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", periodStartUnix_gt: 1654079400}
      orderBy: periodStartUnix
      orderDirection: asc
    ) {
      periodStartUnix
      high
      low
      open
      close
    }
  }
`

const client = createClient({
  url: APIURL
})

function App(props) {
  const [result, setResult] = useState({
    series: [{
      data: []
    }],
    options: {
      chart: {
        type: 'candlestick',
        height: 350
      },
      title: {
        text: 'My chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    }
  })
  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData() {
    const response = await client.query(query).toPromise()
    response.data.tokenHourDatas.forEach(element => {
      element.x=element.periodStartUnix
      element.y=[element.open, element.high, element.low, element.close]
    }
    )
    setResult({
      series: [{
        data: response.data.tokenHourDatas
      }],
      options: {
        chart: {
          type: 'candlestick',
          height: 350
        },
        title: {
          text: 'My chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      }
    })

    console.log('response:', response)
  }
  return (
    <div className='page_graph_maicomponent'>
        <div className="page_graph_coin_name">
          <div className="page_graph_coin_name_1"><img src={LOGO_SOLANA}></img></div>
          <div className="page_graph_coin_name_2"><span>SOL / USDC</span></div>
          <div className="page_graph_coin_name_3"><img src={Vector}></img></div>
        </div>
        <div className="page_graph_title">
          <div className="page_graph_title_1">Index Price</div>
          <div className="page_graph_title_2">Mark Price</div>
          <div className="page_graph_title_3">Predicted Funding Rate</div>
        </div>
        <div className="page_graph_title2">
          <div className="page_graph_title2_1">$32.40</div>
          <div className="page_graph_title2_2">$32.45</div>
          <div className="page_graph_title2_3">0.006% in 10 min</div>
        </div>
        <div className="page_graph_main_graph">
          <div id="chart">
            <ReactApexChart options={result.options} series={result.series} type="candlestick" height={350} />
          </div>
          <div id="html-dist"></div>
        </div>
      </div>
  );
}

export default App;


