<template>
  <div class="background">
    <p class="searchBar">Latitude:</p>
    <input class="searchBar" v-model="latitudeInput" />
    <p class="searchBar">Longitude:</p>
    <input class="searchBar" v-model="longitudeInput" />
    <button v-on:click="locationSearchHandler()">Submit</button>
    <p id="inputError">{{inputError}}</p>
    <p>{{searchResults}}</p>

    <table>
      <tr>
        <th>Countries</th>
        <th>Cities</th>
        <th>Measurements</th>
      </tr>
      <tr>
        <td>
          <li
            class="countries"
            v-for="country in countries"
            :key="country.name"
            v-on:click="showCities(country.code)"
          >{{country.name}}</li>
          <div class="pageContainer">
          <button class="pageNavigator" v-on:click="previousPage">Previous Page</button>
          <p class="pageNavigator">{{pageNum}}</p>
          <button class="pageNavigator" v-on:click="nextPage">Next Page</button>
          </div>
        </td>
        <td>
          <li
            class="cities"
            v-for="cityy in cityData"
            :key="cityy.name"
            v-on:click="showMeasurements(cityy.city, cityy.country)"
          >{{cityy.name}}</li>
        </td>
        <td>
          <li
            class="measurements"
            v-for="(parameter, index) in uniqueParams"
            :key="index"
            v-on:click="populateChart(parameter)"
          >{{parameter}}</li>
          <h2 class="chartTitle">{{chartTitle}}</h2>
          <div class = 'chart' >
          <LineChart :chart-data="datacollection"></LineChart>
          </div>
        </td>
      </tr>
    </table>
    <p>{{chartError}}</p>
  </div>
</template>

<script>
import LineChart from "./gasChart.js";
export default {
  components: {
    LineChart
  },
  name: "CountryList",

  data: function() {
    return {
      countries: [],
      cityData: [],
      error: [],
      pageNum: 1,
      measurementData: [],
      measurementDataSpecificParam: [],
      longitudeInput: null,
      latitudeInput: null,
      inputError: "",
      searchResults: null,
      uniqueParams: [],
      datacollection: null,
      loaded: false,
      chartError: "",
      measurementDataSpecificParamData: [],
      measurementDataSpecificParamDates: [],
      chartTitle: "",
      isoCountries: {
        AF: "Afghanistan",
        AX: "Aland Islands",
        AL: "Albania",
        DZ: "Algeria",
        AS: "American Samoa",
        AD: "Andorra",
        AO: "Angola",
        AI: "Anguilla",
        AQ: "Antarctica",
        AG: "Antigua And Barbuda",
        AR: "Argentina",
        AM: "Armenia",
        AW: "Aruba",
        AU: "Australia",
        AT: "Austria",
        AZ: "Azerbaijan",
        BS: "Bahamas",
        BH: "Bahrain",
        BD: "Bangladesh",
        BB: "Barbados",
        BY: "Belarus",
        BE: "Belgium",
        BZ: "Belize",
        BJ: "Benin",
        BM: "Bermuda",
        BT: "Bhutan",
        BO: "Bolivia",
        BA: "Bosnia And Herzegovina",
        BW: "Botswana",
        BV: "Bouvet Island",
        BR: "Brazil",
        IO: "British Indian Ocean Territory",
        BN: "Brunei Darussalam",
        BG: "Bulgaria",
        BF: "Burkina Faso",
        BI: "Burundi",
        KH: "Cambodia",
        CM: "Cameroon",
        CA: "Canada",
        CV: "Cape Verde",
        KY: "Cayman Islands",
        CF: "Central African Republic",
        TD: "Chad",
        CL: "Chile",
        CN: "China",
        CX: "Christmas Island",
        CC: "Cocos (Keeling) Islands",
        CO: "Colombia",
        KM: "Comoros",
        CG: "Congo",
        CD: "Congo, Democratic Republic",
        CK: "Cook Islands",
        CR: "Costa Rica",
        CI: "Cote D'Ivoire",
        HR: "Croatia",
        CU: "Cuba",
        CY: "Cyprus",
        CZ: "Czech Republic",
        DK: "Denmark",
        DJ: "Djibouti",
        DM: "Dominica",
        DO: "Dominican Republic",
        EC: "Ecuador",
        EG: "Egypt",
        SV: "El Salvador",
        GQ: "Equatorial Guinea",
        ER: "Eritrea",
        EE: "Estonia",
        ET: "Ethiopia",
        FK: "Falkland Islands (Malvinas)",
        FO: "Faroe Islands",
        FJ: "Fiji",
        FI: "Finland",
        FR: "France",
        GF: "French Guiana",
        PF: "French Polynesia",
        TF: "French Southern Territories",
        GA: "Gabon",
        GM: "Gambia",
        GE: "Georgia",
        DE: "Germany",
        GH: "Ghana",
        GI: "Gibraltar",
        GR: "Greece",
        GL: "Greenland",
        GD: "Grenada",
        GP: "Guadeloupe",
        GU: "Guam",
        GT: "Guatemala",
        GG: "Guernsey",
        GN: "Guinea",
        GW: "Guinea-Bissau",
        GY: "Guyana",
        HT: "Haiti",
        HM: "Heard Island & Mcdonald Islands",
        VA: "Holy See (Vatican City State)",
        HN: "Honduras",
        HK: "Hong Kong",
        HU: "Hungary",
        IS: "Iceland",
        IN: "India",
        ID: "Indonesia",
        IR: "Iran, Islamic Republic Of",
        IQ: "Iraq",
        IE: "Ireland",
        IM: "Isle Of Man",
        IL: "Israel",
        IT: "Italy",
        JM: "Jamaica",
        JP: "Japan",
        JE: "Jersey",
        JO: "Jordan",
        KZ: "Kazakhstan",
        KE: "Kenya",
        KI: "Kiribati",
        KR: "Korea",
        KW: "Kuwait",
        KG: "Kyrgyzstan",
        LA: "Lao People's Democratic Republic",
        LV: "Latvia",
        LB: "Lebanon",
        LS: "Lesotho",
        LR: "Liberia",
        LY: "Libyan Arab Jamahiriya",
        LI: "Liechtenstein",
        LT: "Lithuania",
        LU: "Luxembourg",
        MO: "Macao",
        MK: "Macedonia",
        MG: "Madagascar",
        MW: "Malawi",
        MY: "Malaysia",
        MV: "Maldives",
        ML: "Mali",
        MT: "Malta",
        MH: "Marshall Islands",
        MQ: "Martinique",
        MR: "Mauritania",
        MU: "Mauritius",
        YT: "Mayotte",
        MX: "Mexico",
        FM: "Micronesia, Federated States Of",
        MD: "Moldova",
        MC: "Monaco",
        MN: "Mongolia",
        ME: "Montenegro",
        MS: "Montserrat",
        MA: "Morocco",
        MZ: "Mozambique",
        MM: "Myanmar",
        NA: "Namibia",
        NR: "Nauru",
        NP: "Nepal",
        NL: "Netherlands",
        AN: "Netherlands Antilles",
        NC: "New Caledonia",
        NZ: "New Zealand",
        NI: "Nicaragua",
        NE: "Niger",
        NG: "Nigeria",
        NU: "Niue",
        NF: "Norfolk Island",
        MP: "Northern Mariana Islands",
        NO: "Norway",
        OM: "Oman",
        PK: "Pakistan",
        PW: "Palau",
        PS: "Palestinian Territory, Occupied",
        PA: "Panama",
        PG: "Papua New Guinea",
        PY: "Paraguay",
        PE: "Peru",
        PH: "Philippines",
        PN: "Pitcairn",
        PL: "Poland",
        PT: "Portugal",
        PR: "Puerto Rico",
        QA: "Qatar",
        RE: "Reunion",
        RO: "Romania",
        RU: "Russian Federation",
        RW: "Rwanda",
        BL: "Saint Barthelemy",
        SH: "Saint Helena",
        KN: "Saint Kitts And Nevis",
        LC: "Saint Lucia",
        MF: "Saint Martin",
        PM: "Saint Pierre And Miquelon",
        VC: "Saint Vincent And Grenadines",
        WS: "Samoa",
        SM: "San Marino",
        ST: "Sao Tome And Principe",
        SA: "Saudi Arabia",
        SN: "Senegal",
        RS: "Serbia",
        SC: "Seychelles",
        SL: "Sierra Leone",
        SG: "Singapore",
        SK: "Slovakia",
        SI: "Slovenia",
        SB: "Solomon Islands",
        SO: "Somalia",
        ZA: "South Africa",
        GS: "South Georgia And Sandwich Isl.",
        ES: "Spain",
        LK: "Sri Lanka",
        SD: "Sudan",
        SR: "Suriname",
        SJ: "Svalbard And Jan Mayen",
        SZ: "Swaziland",
        SE: "Sweden",
        CH: "Switzerland",
        SY: "Syrian Arab Republic",
        TW: "Taiwan",
        TJ: "Tajikistan",
        TZ: "Tanzania",
        TH: "Thailand",
        TL: "Timor-Leste",
        TG: "Togo",
        TK: "Tokelau",
        TO: "Tonga",
        TT: "Trinidad And Tobago",
        TN: "Tunisia",
        TR: "Turkey",
        TM: "Turkmenistan",
        TC: "Turks And Caicos Islands",
        TV: "Tuvalu",
        UG: "Uganda",
        UA: "Ukraine",
        AE: "United Arab Emirates",
        GB: "United Kingdom",
        US: "United States",
        UM: "United States Outlying Islands",
        UY: "Uruguay",
        UZ: "Uzbekistan",
        VU: "Vanuatu",
        VE: "Venezuela",
        VN: "Viet Nam",
        VG: "Virgin Islands, British",
        VI: "Virgin Islands, U.S.",
        WF: "Wallis And Futuna",
        EH: "Western Sahara",
        YE: "Yemen",
        ZM: "Zambia",
        ZW: "Zimbabwe"
      }
    };
  },

  created() {
    this.displayPage();
  },

  methods: {
    displayPage() {
      this.$http
        .get("countries", { params: { limit: 20, page: this.pageNum } })
        .then(response => {
          if (response.status >= 200 || response.status <= 300) {
            this.countries = response.data.results;
          } else {
            this.error = response;
          }
        });
    },
    nextPage() {
      if (this.countries.length == 20) {
        this.pageNum++;
        this.displayPage();
      }
    },
    previousPage() {
      if (this.pageNum != 1) {
        this.pageNum--;
        this.displayPage();
      }
    },
    showCities(countryCode) {
      this.$http
        .get("cities", { params: { country: countryCode } })
        .then(response => {
          if (response.status >= 200 || response.status <= 300) {
            this.cityData = [];
            this.cityData = response.data.results;
          } else {
            this.error = response;
          }
        });
    },
    showMeasurements(recievedCity, recievedCountry) {
      this.$http
        .get("measurements", {
          params: { country: recievedCountry, city: recievedCity }
        })
        .then(response => {
          if (response.status >= 200 || response.status <= 300) {
            this.measurementData = [];
            this.measurementData = response.data.results;
            this.findUniqueParams();
          } else {
            this.error = response;
          }
        });
    },
    findUniqueParams() {
      var items = [];
      for (var i = 0; i < this.measurementData.length; i++) {
        if (!items.includes(this.measurementData[i].parameter)) {
          items.push(this.measurementData[i].parameter);
        }
      }
      if (items.length > 0) {
        this.uniqueParams = items;
      } else {
        this.uniqueParams = ["No measurements recorded!"];
      }
    },
    locationSearchHandler() {
      if (this.validateInput()) {
        this.searchResults = [];
        this.inputError = "";
        this.$http
          .get("locations", {
            params: {
              coordinates: this.latitudeInput + ", " + this.longitudeInput,
              order_by: "distance",
              limit: 1,
              radius: 100000
            }
          })
          .then(response => {
            if (response.status >= 200 || response.status <= 300) {
              if (response.data.results.length > 0) {
                this.searchResults =
                  "Closest city is '" +
                  response.data.results[0].city +
                  "' in " +
                  this.getCountryName(response.data.results[0].country) + ' - Select a measurement for more information';
                this.showMeasurements(
                  response.data.results[0].city,
                  response.data.results[0].country
                );
              } else {
                this.searchResults =
                  "There are no measurements within a 100km radius of these coordinates!";
              }
            } else {
              this.error = response;
            }
          });
      } else {
        this.inputError = "Please enter valid coordinates";
      }
    },
    populateChart(parameter) {
      this.compileData(parameter);
      if (this.measurementDataSpecificParam.length > 0) {
        this.chartError = "";
        this.datacollection = {
          labels: this.measurementDataSpecificParamDates,
          datasets: [
            {
              label: this.measurementDataSpecificParam[0].unit,
              backgroundColor: "rgba(255,141,96)",
              borderColor: "black",
              pointBackgroundColor: "blue",
              borderWidth: 1,
              pointBorderColor: "white",
              data: this.measurementDataSpecificParamData
            }
          ]
        };
        this.chartTitle =
          this.measurementDataSpecificParam[0].city +
          "'s " +
          this.measurementDataSpecificParam[0].parameter +
          " readings";
      } else {
        this.chartError = "No data for selected parameter";
      }
    },
    compileData(parameter) {
      this.measurementDataSpecificParam = [];
      this.measurementDataSpecificParamData = [];
      this.measurementDataSpecificParamDates = [];
      for (var i = 0; i < this.measurementData.length; i++) {
        if (this.measurementData[i].parameter == parameter) {
          this.measurementDataSpecificParam.push(this.measurementData[i]);
        }
      }
      for (i = 0; i < this.measurementDataSpecificParam.length; i++) {
        this.measurementDataSpecificParamData.push(
          this.measurementDataSpecificParam[i].value
        );
      }
      for (i = 0; i < this.measurementDataSpecificParam.length; i++) {
        this.measurementDataSpecificParamDates.push(
          this.measurementDataSpecificParam[i].date.local
        );
      }
    },
    getCountryName(countryCode) {
      if (this.isoCountries.hasOwnProperty(countryCode)) {
        return this.isoCountries[countryCode];
      } else {
        return countryCode;
      }
    },
    validateInput() {
      const coordREXP = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
      const coords = this.latitudeInput + ", " + this.longitudeInput;
      if (coordREXP.test(coords)) {
        return true;
      } else return false;
    }
  }
};
</script>

<style scoped>
.background {
  background-color: rgb(61, 245, 205);
}
li {
  text-align: center;
  list-style: none;

  margin-bottom: 5px;
}
.countries:hover {
  cursor: pointer;
  background-color: rgb(255, 226, 96);
}
.cities:hover {
  cursor: pointer;
  background-color: rgb(255, 206, 71);
}
.measurements:hover {
  cursor: pointer;
  background-color: rgb(255, 206, 71);
}
table,
th,
td {
  margin-top: 10px;
  border: 1px solid black;
  vertical-align: top;
  border-collapse: collapse;
}
table {
  width: 100%;
}
.pageNavigator {
  display: inline;
}
.pageNavigator,button {
  width: 120px;
  margin: 5px;
}
.pageContainer {
  margin-top: 10px;
  text-align: center;
}
.searchBar {
  margin-top: 5px;
  display: inline;
  margin-right: 3px;
}
#inputError {
  color: red;
}
.chartTitle {
  text-align: center
}
.chart {
  text-align: center;
  margin: 0 auto;
  margin-right: 25%;
  width: 500px;
  height:500px
}
</style>
