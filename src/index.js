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
                    <li key={ruleId} className={"rule-item-" + el.icon}>
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
          <h6 className="title">
            {
              "Bilgilendirme amaçlıdır, gerçeği yansıtmayabilir, sorumluluk kabul edilmez."
            }
          </h6>
        ) : null}
        {light !== 0 && selectedCity ? (
          <h6 className="title">
            {"Lovely developed by Hasan Kürşat Küçüköztaş"}
          </h6>
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

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);
