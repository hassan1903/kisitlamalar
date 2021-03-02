const cheerio = require("cheerio");

const updateData = (cityList) => {
  let newCityList = cityList;
  fetch("https://covid19.saglik.gov.tr/?lang=tr-TR", {
    mode: "cors",
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

export default updateData;
