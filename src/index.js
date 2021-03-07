import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Tabs, Select, Spin } from "antd";
import citiesList from "./city.json";
import nextCitiesList from "./estimated.json";
import ruleList from "./rules.json";
import updateData, {
  updateEstimatedData,
  getRegionCode,
} from "./getDataFromMinistry.js";
import moment from "moment";
import "moment/locale/tr";
import "./styles.css";
const { TabPane } = Tabs;
const LightBulb = () => {
  const [light, setLight] = useState(0);
  const [regionCode, setRegionCode] = useState(0);
  const [spinning, setSpinning] = useState(true);
  const [cityList, setCityList] = useState(
    Object.assign({}, JSON.parse(JSON.stringify(citiesList)))
  );
  const [estimatedCityList, setEstimatedCityList] = useState(
    Object.assign({}, JSON.parse(JSON.stringify(nextCitiesList)))
  );
  const [selectedCity, setSelectedCity] = useState({
    value: -1,
    label: "",
    status: -1,
  });
  const [selectedEstimatedCity, setSelectedEstimatedCity] = useState({
    value: -1,
    label: "",
    status: -1,
  });
  let ruleId = 1;
  let ruleIdTab2 = 1;

  const colorCode = [
    {
      key: 1,
      value: "#0071c1",
      label: "Düşük riskli bölge",
    },
    { key: 2, value: "#f0e513", label: "Orta riskli bölge" },
    { key: 3, value: "#f8931f", label: "Yüksek riskli bölge" },
    { key: 4, value: "#df1a23", label: "Çok yüksek riskli bölge" },
  ];
  const fillColor = colorCode.find((element) => element.key === light);
  useEffect(async () => {
    try {
      const newEstimatedCityList = await updateEstimatedData(estimatedCityList);
      const newCityList = await updateData(cityList);
      setCityList(newCityList);
      setEstimatedCityList(newEstimatedCityList);
    } catch {}
    const newRegionCode = await getRegionCode();
    setRegionCode(newRegionCode);
    setSpinning(false);
  }, []);
  useEffect(() => {
    if (regionCode) {
      const currentLocation = cityList.cities.find(
        (element) => element.value === parseInt(regionCode, 10)
      );
      const currentEstimatedLocation = estimatedCityList.cities.find(
        (element) => element.value === parseInt(regionCode, 10)
      );
      setSelectedCity(currentLocation);
      setSelectedEstimatedCity(currentEstimatedLocation);
      setLight(currentLocation.status);
    }
  }, [regionCode]);
  return (
    <div className="App">
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => {
          if (key === "2") {
            const cityStatus = estimatedCityList.cities.find(
              (item) => item.label === selectedEstimatedCity.label
            );
            setLight(cityStatus.status);
            setSelectedEstimatedCity(cityStatus);
          } else {
            const cityStatus = cityList.cities.find(
              (item) => item.label === selectedCity.label
            );
            setLight(cityStatus.status);
            setSelectedCity(cityStatus);
          }
        }}
      >
        <TabPane tab="Geçerli kısıtlamalar" key="1">
          <h4 className="title">
            {moment()
              .locale("tr")
              .format("LL") + " tarihi illere göre güncel kısıtlama kuralları"}
          </h4>
          <div
            style={{ paddingTop: 20, paddingBottom: 30, textAlign: "center" }}
          >
            <CoronaVirus fillColor={fillColor ? fillColor.value : "#fff"} />
          </div>
          <div className="container">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Şehir Seçiniz"
              onChange={(val) => {
                const cityStatus = cityList.cities.find(
                  (item) => item.value === val
                );
                setLight(cityStatus.status);
                setSelectedCity(cityStatus);
              }}
              options={cityList.cities}
              value={selectedCity.value > 0 ? selectedCity.value : undefined}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label
                  .toLocaleUpperCase("tr-TR")
                  .indexOf(input.toLocaleUpperCase("tr-TR")) >= 0
              }
            />
            {light !== 0 && selectedCity ? (
              <h2
                className="title"
                style={{ color: colorCode[light - 1].value }}
              >
                {colorCode[light - 1].label}
              </h2>
            ) : null}
            <div className={spinning ? "loader" : "loader-hide"}>
              <Spin spinning={spinning} size="large" />
            </div>
            {light !== 0 ? (
              <ul>
                {ruleList.rules.map((el) => {
                  if (el.ruleId === ruleId) {
                    const index = el.status.indexOf(light);
                    if (index > -1) {
                      ruleId++;
                      return (
                        <li
                          key={"tab1" + ruleId}
                          style={{ paddingBottom: 10 }}
                          className={"rule-item-" + el.icon}
                        >
                          {el.label}
                        </li>
                      );
                    }
                    return null;
                  }
                  return null;
                })}
              </ul>
            ) : null}
            {light !== 0 && selectedCity ? (
              <div className="footercontainer">
                <h5 className="titleH5WithoutPadding">
                  {
                    "Bilgilendirme amaçlıdır, gerçeği yansıtmayabilir, sorumluluk kabul edilmez."
                  }
                </h5>
                <a
                  href="https://twitter.com/intent/tweet?text=Ya%C5%9Fad%C4%B1%C4%9F%C4%B1m%20%C5%9Fehrin%20risk%20grubunu%20ve%20ge%C3%A7erli%20olan%20k%C4%B1s%C4%B1tlamalar%C4%B1%20%C3%B6%C4%9Frendim.%20Sende%20%C3%B6%C4%9Frenmek%20istiyorsan%3B&url=https%3A%2F%2Fhassan1903.github.io%2Fkisitlamalar"
                  className="tweetbutton"
                >
                  <TwitterIcon />
                  <span className="tweetlabel">Tweet</span>
                </a>
                <h5 className="titleH5">
                  {"Lovely developed by Hasan Kürşat Küçüköztaş"}
                </h5>
              </div>
            ) : null}
          </div>
        </TabPane>
        <TabPane tab="Vakalara göre tahmini kısıtlamalar" key="2">
          <h4 className="title">
            {"12 Mart 2021 tarihi illere göre tahmini kısıtlama kuralları"}
          </h4>
          <div
            style={{ paddingTop: 20, paddingBottom: 50, textAlign: "center" }}
          >
            <CoronaVirus fillColor={fillColor ? fillColor.value : "#fff"} />
          </div>
          <div className="container">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Şehir Seçiniz"
              onChange={(val) => {
                const cityStatus = estimatedCityList.cities.find(
                  (item) => item.value === val
                );
                setLight(cityStatus.status);
                setSelectedEstimatedCity(cityStatus);
              }}
              options={estimatedCityList.cities}
              value={
                selectedEstimatedCity.value > 0
                  ? selectedEstimatedCity.value
                  : undefined
              }
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label
                  .toLocaleUpperCase("tr-TR")
                  .indexOf(input.toLocaleUpperCase("tr-TR")) >= 0
              }
            />
            {light !== 0 && selectedEstimatedCity ? (
              <h2
                className="title"
                style={{ color: colorCode[light - 1].value }}
              >
                {colorCode[light - 1].label}
              </h2>
            ) : null}
            {light !== 0 ? (
              <ul>
                {ruleList.rules.map((el) => {
                  if (el.ruleId === ruleIdTab2) {
                    const index = el.status.indexOf(light);
                    if (index > -1) {
                      ruleIdTab2++;
                      return (
                        <li
                          key={"tab2" + ruleIdTab2}
                          style={{ paddingBottom: 10 }}
                          className={"rule-item-" + el.icon}
                        >
                          {el.label}
                        </li>
                      );
                    }
                    return null;
                  }
                  return null;
                })}
              </ul>
            ) : null}
            {light !== 0 && selectedEstimatedCity ? (
              <div className="footercontainer">
                <h5 className="titleH5WithoutPadding">
                  {
                    "Bilgilendirme amaçlıdır, gerçeği yansıtmayabilir, sorumluluk kabul edilmez."
                  }
                </h5>
                <a
                  href="https://twitter.com/intent/tweet?text=Ya%C5%9Fad%C4%B1%C4%9F%C4%B1m%20%C5%9Fehrin%20risk%20grubunu%20ve%20ge%C3%A7erli%20olan%20k%C4%B1s%C4%B1tlamalar%C4%B1%20%C3%B6%C4%9Frendim.%20Sende%20%C3%B6%C4%9Frenmek%20istiyorsan%3B&url=https%3A%2F%2Fhassan1903.github.io%2Fkisitlamalar"
                  className="tweetbutton"
                >
                  <TwitterIcon />
                  <span className="tweetlabel">Tweet</span>
                </a>
                <h5 className="titleH5">
                  {"Lovely developed by Hasan Kürşat Küçüköztaş"}
                </h5>
              </div>
            ) : null}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

const LightbulbSvg = (props) => {
  return (
    <svg width="56px" height="90px" viewBox="0 0 56 90" version="1.1">
      <defs />
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="noun_bulb_1912567" fill="#000000" fillRule="nonzero">
          <path
            d="M38.985,68.873 L17.015,68.873 C15.615,68.873 14.48,70.009 14.48,71.409 C14.48,72.809 15.615,73.944 17.015,73.944 L38.986,73.944 C40.386,73.944 41.521,72.809 41.521,71.409 C41.521,70.009 40.386,68.873 38.985,68.873 Z"
            id="Shape"
          />
          <path
            d="M41.521,78.592 C41.521,77.192 40.386,76.057 38.986,76.057 L17.015,76.057 C15.615,76.057 14.48,77.192 14.48,78.592 C14.48,79.993 15.615,81.128 17.015,81.128 L38.986,81.128 C40.386,81.127 41.521,79.993 41.521,78.592 Z"
            id="Shape"
          />
          <path
            d="M18.282,83.24 C17.114,83.24 16.793,83.952 17.559,84.83 L21.806,89.682 C21.961,89.858 22.273,90 22.508,90 L33.492,90 C33.726,90 34.039,89.858 34.193,89.682 L38.44,84.83 C39.207,83.952 38.885,83.24 37.717,83.24 L18.282,83.24 Z"
            id="Shape"
          />
          <path
            d="M16.857,66.322 L39.142,66.322 C40.541,66.322 41.784,65.19 42.04,63.814 C44.63,49.959 55.886,41.575 55.886,27.887 C55.887,12.485 43.401,0 28,0 C12.599,0 0.113,12.485 0.113,27.887 C0.113,41.575 11.369,49.958 13.959,63.814 C14.216,65.19 15.458,66.322 16.857,66.322 Z"
            id="Shape"
            fill={props.fillColor}
          />
        </g>
      </g>
    </svg>
  );
};

const TwitterIcon = (props) => {
  return (
    <svg
      version="1.1"
      id="Logo"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="14.88px"
      height="12.24px"
      viewBox="0 0 248 204"
    >
      <g id="Logo_1_">
        <path
          id="blue_background"
          fill={props.fillColor ? props.fillColor : "#fff"}
          d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04
		C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66
		c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64
		c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76
		c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26
		c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z"
        />
      </g>
    </svg>
  );
};

const CoronaVirus = (props) => {
  return (
    <svg
      version="1.1"
      id="VirusLogo"
      xmlns="http://www.w3.org/2000/svg"
      width="96px"
      height="96px"
      viewBox="0 0 48 48"
    >
      <defs></defs>
      <path
        fill={props.fillColor}
        d="M46.5,19A1.49977,1.49977,0,0,0,45,20.5V22H40.87225a16.9,16.9,0,0,0-3.53-8.51367l2.92121-2.92139,1.17582.99561a1.49993,1.49993,0,1,0,2.12134-2.1211l-4.99991-5a1.4999,1.4999,0,0,0-2.12127,2.1211l.99565,1.17578-2.92139,2.92138A16.90205,16.90205,0,0,0,26,7.12793V3h1.5a1.5,1.5,0,0,0,0-3h-7a1.5,1.5,0,0,0,0,3H22V7.12793a16.90205,16.90205,0,0,0-8.51367,3.52978L10.56494,7.73633l.99565-1.17578a1.4999,1.4999,0,0,0-2.12127-2.1211l-4.88475,5a1.49993,1.49993,0,0,0,2.12133,2.1211l1.06067-.99561,2.92121,2.92139A16.9,16.9,0,0,0,7.12775,22H3V20.5a1.5,1.5,0,0,0-3,0v7a1.5,1.5,0,0,0,3,0V26H7.12775a16.9,16.9,0,0,0,3.53,8.51367L7.73657,37.43506l-1.17582-.99561a1.49993,1.49993,0,0,0-2.12134,2.1211l4.99991,5a1.4999,1.4999,0,1,0,2.12127-2.1211l-.99565-1.17578,2.92127-2.92138A16.902,16.902,0,0,0,22,40.87207V45H20.5a1.5,1.5,0,0,0,0,3h7a1.5,1.5,0,0,0,0-3H26V40.87207a16.902,16.902,0,0,0,8.51379-3.52978l2.92127,2.92138-.99565,1.17578a1.4999,1.4999,0,0,0,2.12127,2.1211l4.99991-5a1.49993,1.49993,0,1,0-2.12134-2.1211l-1.17582.99561-2.92121-2.92139A16.9,16.9,0,0,0,40.87225,26H45v1.5a1.5,1.5,0,0,0,3,0v-7A1.49977,1.49977,0,0,0,46.5,19Zm-28,1A3.5,3.5,0,1,1,22,16.5,3.49994,3.49994,0,0,1,18.5,20ZM30,33a2,2,0,1,1,2-2A2.00006,2.00006,0,0,1,30,33Z"
      />
    </svg>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);
