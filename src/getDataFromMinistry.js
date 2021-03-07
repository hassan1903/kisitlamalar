const cheerio = require("cheerio");

const updateData = async (cityList) => {
  let newCityList = { ...cityList };
  await fetch("https://covid19.saglik.gov.tr/?lang=tr-TR", {
    mode: "no-cors",
  })
    .then((response) => response.text())
    .then((data) => {
      const $ = cheerio.load(data);
      cityList.cities.forEach((element, index) => {
        const city = $("[data-adi=" + element.label + "]").get(1);
        if (city && city.attribs && city.attribs.id) {
          const color = city.attribs.id;
          newCityList.cities[index].status = parseInt(
            color.replace("color_", ""),
            10
          );
        }
      });
    });
  return newCityList;
};

export const updateEstimatedData = async (cityEstimatedList) => {
  let newCityListEstimated = { ...cityEstimatedList };
  await fetch("https://covid19.saglik.gov.tr/?lang=tr-TR", {
    mode: "no-cors",
  })
    .then((response) => response.text())
    .then((data) => {
      const $ = cheerio.load(data);
      cityEstimatedList.cities.forEach((element, index) => {
        const city = $("[data-adi=" + element.label + "]").get(0);
        if (city && city.attribs && city.attribs["data-detay"]) {
          const numberOfPatient = parseInt(city.attribs["data-detay"], 10);
          let color = newCityListEstimated.cities[index].status;
          switch (true) {
            case numberOfPatient >= 0 && numberOfPatient < 20:
              color = 1;
              break;
            case numberOfPatient >= 20 && numberOfPatient < 50:
              color = 2;
              break;
            case numberOfPatient >= 50 && numberOfPatient < 100:
              color = 3;
              break;
            case numberOfPatient >= 100:
              color = 4;
              break;
            default:
              break;
          }
          newCityListEstimated.cities[index].status = color;
        }
      });
    });
  return newCityListEstimated;
};

export const getRegionCode = async () => {
  let regionCode;
  await fetch("https://ipapi.co/json/", {
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.country === "TR" && data.region_code) {
        regionCode = data.region_code;
      }
    });
  return regionCode;
};

export default updateData;
