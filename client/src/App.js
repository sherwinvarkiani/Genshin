// client/src/App.js

import React from "react";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  console.log(data);

  function display() {
    if (data && data.length === 25) {
      return (<div className="App">
      <header className="App-header">
        <table>
          <tr>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td>{data[2]}</td>
            <td>{data[3]}</td>
            <td>{data[4]}</td>
          </tr>
          <tr>
            <td>{data[5]}</td>
            <td>{data[6]}</td>
            <td>{data[7]}</td>
            <td>{data[8]}</td>
            <td>{data[9]}</td>
          </tr>
          <tr>
            <td>{data[10]}</td>
            <td>{data[11]}</td>
            <td>{data[12]}</td>
            <td>{data[13]}</td>
            <td>{data[14]}</td>
          </tr>
          <tr>
            <td>{data[15]}</td>
            <td>{data[16]}</td>
            <td>{data[17]}</td>
            <td>{data[18]}</td>
            <td>{data[19]}</td>
          </tr>
          <tr>
            <td>{data[20]}</td>
            <td>{data[21]}</td>
            <td>{data[22]}</td>
            <td>{data[23]}</td>
            <td>{data[24]}</td>
          </tr>
        </table>
      </header>
    </div>);
    }
    return (<div></div>)
  }

  return (
    <div className="App">
      <header className="App-header">
        {display()}
      </header>
    </div>
  );
}

export default App;