const InputData = {};

// assuming the regions
let region = {
  name: "Africa",
  avgAge: 19.7,
  avgDailyIncomeInUSD: 5,
  avgDailyIncomePopulation: 0.71
  };
 
const DataButton = document.querySelector('[data-go-estimate]');

const population = document.querySelector('[data-population]');
const timeToElapse = document.querySelector('[data-time-to-elapse]');
const reportedCases = document.querySelector('[data-reported-cases]');
const totalHospitalBeds = document.querySelector('[data-total-hospital-beds]');
const periodType = document.querySelector('[data-period-type]');

const DataDisplayer = document.getElementById('dataDisplayer');
const ResultDisplayer = document.getElementById('ResultDisplayer');


const clearFormField = () => {
  population.value = '';
  timeToElapse.value = '';
  reportedCases.value = '';
  totalHospitalBeds.value = '';
  periodType.value = 'Days'
}

const submitHandler = (e) => {
  e.preventDefault();

  InputData.region = region;
  InputData.population = Number(population.value);
  InputData.timeToElapse = Number(timeToElapse.value);
  InputData.reportedCases = Number(reportedCases.value);
  InputData.totalHospitalBeds = Number(totalHospitalBeds.value);
  InputData.periodType = periodType.value;

  
  let textedJSON = JSON.stringify(InputData, undefined, 4);
  DataDisplayer.textContent = textedJSON;

  clearFormField();

  // console.log("Form Submitted", InputData);
}

DataButton.addEventListener('click', submitHandler);


// Estimator

const Sampledata = {
  region: {
  name: "Africa",
  avgAge: 19.7,
  avgDailyIncomeInUSD: 5,
  avgDailyIncomePopulation: 0.71
  },
  periodType: "days",
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
 };
 

const convertToDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

const fifteenPercent = (infectionsByRequestedTime) => Math.trunc(0.15 * infectionsByRequestedTime);

const availableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableBedSpace = 0.35 * totalHospitalBeds;
  return Math.trunc(availableBedSpace - severeCasesByRequestedTime);
};

const ICUcare = (infectionsByRequestedTime) => Math.trunc(0.05 * infectionsByRequestedTime);

const ventilators = (infectionsByRequestedTime) => Math.trunc(0.02 * infectionsByRequestedTime);

const dollarsInFlightCalc = (
  infectionsByRequestedTime,
  avgDailyIncome,
  avgDailyIncomePercent,
  days
) => {
  const value = (infectionsByRequestedTime * avgDailyIncome * avgDailyIncomePercent) / days;
  return Math.trunc(value);
};

const covid19ImpactEstimator = (data) => {
  const outputData = {
    data: null,
    impact: {},
    severeImpact: {}
  };

  // destructuringthe data Object
  const {
    timeToElapse,
    reportedCases,
    periodType,
    totalHospitalBeds
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  const { impact, severeImpact } = outputData;
  outputData.data = data;
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  const days = convertToDays(periodType, timeToElapse);
  const factor = 2 ** Math.trunc(days / 3);
  impact.infectionsByRequestedTime = impact.currentlyInfected * factor;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * factor;
  impact.severeCasesByRequestedTime = fifteenPercent(
    impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = fifteenPercent(
    severeImpact.infectionsByRequestedTime
  );
  impact.hospitalBedsByRequestedTime = availableBeds(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = availableBeds(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  );
  impact.casesForICUByRequestedTime = ICUcare(impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = ICUcare(
    severeImpact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = ventilators(
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = ventilators(
    severeImpact.infectionsByRequestedTime
  );
  impact.dollarsInFlight = dollarsInFlightCalc(
    impact.infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );
  severeImpact.dollarsInFlight = dollarsInFlightCalc(
    severeImpact.infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );
  return outputData;
};


// to Perform Estimations

const EstimationButton = document.querySelector('.toEstimate');

const EstimationHandler = () => {
  const results = covid19ImpactEstimator(InputData);
  const resultJSON = JSON.stringify(results, undefined, 4);
  ResultDisplayer.textContent = resultJSON;

  alert('Scroll Down To View The Estimations Results');

  // console.log(covid19ImpactEstimator(InputData));
}

EstimationButton.addEventListener('click', EstimationHandler);

