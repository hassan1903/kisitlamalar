// @flow
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import citiesList from "./city.json";
import ruleList from "./rules.json";
import updateData from "./getDataFromMinistry.js";
import moment from "moment";
import "moment/locale/tr";
import "./styles.css";

const LightBulb = () => {
  let [light, setLight] = useState(0);
  let [selectedCity, setSelectedCity] = useState({ value: "", label: "" });
  let ruleId = 1;
  let cityList = citiesList;
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
    cityList = await updateData(cityList);
  });
  return (
    <div className="App">
      <h4 className="title">
        {moment()
          .locale("tr")
          .format("LL") + " tarihi illere göre güncel kısıtlama kuralları"}
      </h4>
      <div style={{ paddingTop: 20, paddingBottom: 50, textAlign: "center" }}>
        <LightbulbSvg fillColor={fillColor ? fillColor.value : "#000"} />
      </div>
      <div className="container">
        <Select
          placeholder="Şehir seçiniz"
          label={selectedCity}
          options={cityList.cities}
          onInputChange={(newValue) => {
            return (
              newValue.charAt(0).toLocaleUpperCase("tr-TR") + newValue.slice(1)
            );
          }}
          onChange={(val) => {
            const cityStatus = cityList.cities.find(
              (item) => item.label === val.label
            );
            setLight(cityStatus.status);
            setSelectedCity(val);
          }}
        />
        {light !== 0 && selectedCity ? (
          <h3 className="title" style={{ color: colorCode[light - 1].value }}>
            {colorCode[light - 1].label}
          </h3>
        ) : null}
        {light !== 0 ? (
          <ul>
            {ruleList.rules.map((el) => {
              if (el.ruleId === ruleId) {
                const index = el.status.indexOf(light);
                if (index > -1) {
                  ruleId++;
                  return (
                    <li
                      key={ruleId}
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
          <div class="footercontainer">
            <h6 className="title">
              {
                "Bilgilendirme amaçlıdır, gerçeği yansıtmayabilir, sorumluluk kabul edilmez."
              }
            </h6>
            <a
              href="https://twitter.com/intent/tweet?text=Ya%C5%9Fad%C4%B1%C4%9F%C4%B1m%20%C5%9Fehrin%20risk%20grubunu%20ve%20ge%C3%A7erli%20olan%20k%C4%B1s%C4%B1tlamalar%C4%B1%20%C3%B6%C4%9Frendim.%20Sende%20%C3%B6%C4%9Frenmek%20istiyorsan%3B&url=https%3A%2F%2Fhassan1903.github.io%2Fkisitlamalar"
              class="tweetbutton"
            >
              <TwitterIcon />
              <span class="tweetlabel">Tweet</span>
            </a>
            <h6 className="title">
              {"Lovely developed by Hasan Kürşat Küçüköztaş"}
            </h6>
          </div>
        ) : null}
      </div>
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

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);
