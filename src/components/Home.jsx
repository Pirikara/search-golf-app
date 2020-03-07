import React from 'react';
import './Common.css';
import 'semantic-ui-css/semantic.min.css'

// カレンダー導入用のライブラリ
// react-datepickerに定義されているコンポーネントを利用できる
import DatePicker, { registerLocale } from 'react-datepicker'
import ja from 'date-fns/locale/ja';
// cssをインポート
import "react-datepicker/dist/react-datepicker.css"

// date-fnsからaddDaysという関数をimportする
// formにあるプレー日を本日から14日後の日付に初期設定するための関数
import addDays from 'date-fns/addDays';

// HTTP通信を実装するため、axiosというライブラリを導入
import axios from 'axios';
// dateパラメーターのフォーマットを整えるための関数
import format from 'date-fns/format';

import Result from './Result';



const Today = new Date();
registerLocale('ja', ja);


// Homeコンポーネントを定義
// index.jsでHomeコンポーネントが渡され、ReactDOM.render()関数で本物のDOMに変換される
class Home extends React.Component {
  // stateの初期値を定義
  // ここで定義されたものが最初に画面に表示される値となる
  // plansとplanCountの初期値を空の配列と0で定義しておく
  state = { date: addDays(new Date(), 14), budget: '12000', departure: '1', duration: '90', plans: null, planCount: 0, error: null }

  // onFormSubmit関数の定義
  // async awaitという記述は、非同期通信
  // JavaScriptは処理が終わっていなくても次のコードを実行してしまうという特徴がある
  // ゴルフ場の取得の処理が終わるまではthis.setState...の処理はしないでね、という意味
  onFormSubmit = async(event) => {
    // try/catch構文
    // tryに書いた処理が実行されている際に起きた例外をcatchで拾うことができる
    // 例外が起きた場合の処理をcatch内に記述 アプリケーションの停止を防ぐ
    try {
    // デフォルトのsubmit処理をキャンセル
    event.preventDefault();
    // axiosを使用して、getのHTTP通信を行う
    // パラメーターとして、stateを送信
    const response = await axios.get('https://api.myjson.com/bins/m0kp2', {
      params: { date: format(this.state.date, 'yyyyMMdd'), budget: this.state.budget, departure: this.state.departure, duration: this.state.duration }
    });
    // responseにAPIから返却された値が含まれているので、stateにsetして更新
    this.setState({ planCount: response.data.planCount, plans: response.data.plans })

    }catch (e){
      // stateのerrorにエラーオブジェクトをセット
      this.setState({error: e})
    }
  }
  render(){
    // それぞれのfieldに、定義したstateの値を放り込む
    // onChangeイベント発生時にe(イベントオブジェクト)を各キーにsetStateして更新していく
    return (
      <div className="ui container" id="container">
        <div className="Search__Form">
          <form className="ui form segment" onSubmit={this.onFormSubmit} >
            <div className="field">
              <label><i className="calendar alternate outline icon"></i>プレー日</label>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                locale='ja'
                selected={this.state.date}
                onChange={e => this.setState({date: e})}
                minDate={Today}
               />
            </div>
            <div className="field">
              <label><i className="yen sign icon"></i>上限金額</label>
              <select className="ui dropdown" name="dropdown" value={this.state.budget} onChange={e => this.setState({budget: e.target.value})}>
                <option valie="8000">8,000円</option>
                <option value="12000">12,000円</option>
                <option value="16000">16,000円</option>
              </select>
            </div>
            <div className="field">
              <label><i className="map pin icon"></i>移動時間計算の出発地点（自宅から近い地点をお選びください）</label>
              <select className="ui dropdown" name="dropdown" value={this.state.departure} onChange={e => this.setState({ departure: e.target.value})}>
                <option value="1">東京駅</option>
                <option value="2">横浜駅</option>
              </select>
            </div>
            <div className="field">
              <label><i className="car icon"></i>車での移動時間の上限</label>
              <select className="ui dropdown" name="dropdown" value={this.state.duration} onChange={e => this.setState({ duration: e.target.value})}>
                <option value="60">60分</option>
                <option value="90">90分</option>
                <option value="120">120分</option>
              </select>
            </div>
            <div className="Search__Button">
              <button type="submit" className="Search__Button__Design">
                <i className="search icon"></i>ゴルフ場を検索する
              </button>
            </div>
          </form>
          <Result 
            // Resultコンポーネントにplansを渡す
            // plansにはAPIから取得した値が入っている
            // コンポーネントにplanCountを渡す
            plans={this.state.plans}
            planCount={this.state.planCount}
            error={this.state.error}
          />
        </div>
      </div>
    );
  }
}

export default Home;