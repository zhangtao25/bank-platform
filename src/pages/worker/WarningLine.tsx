import { Statistic } from "antd"
import CountUp from 'react-countup';

const formatter = (value: number) => <CountUp end={value} separator="," />;

function f() {

}

const WarningLine = ({record}) => {
    console.log(record,'record')
  return <div>
      <Statistic title="金额总计 (人民币)" value={(record||[]).reduce((p,c)=>{
          return p + c.trade_amount
      },0)} precision={2} formatter={formatter} />
  </div>
}

export default WarningLine
