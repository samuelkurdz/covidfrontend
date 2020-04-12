console.log("App Launcehd");
const   data = {};

const button = document.querySelector('[data-go-estimate]');
const population = document.querySelector('[data-population]');
const timeToElapse = document.querySelector('[data-time-to-elapse]');
const reportedCases = document.querySelector('[data-reported-cases]');
const totalHospitalBeds = document.querySelector('[data-total-hospital-beds]');
const periodType = document.querySelector('[data-period-type]');

const displayer = document.getElementById('dataDisplayer');

const clearFormField = () => {
  population.value = '';
  timeToElapse.value = '';
  reportedCases.value = '';
  totalHospitalBeds.value = '';
  periodType.value = 'Days'
}

const submitHandler = (e) => {
  e.preventDefault();

  data.population = Number(population.value);
  data.timeToElapse = Number(timeToElapse.value);
  data.reportedCases = Number(reportedCases.value);
  data.totalHospitalBeds = Number(totalHospitalBeds.value);
  data.periodType = periodType.value;
  
  let textedJSON = JSON.stringify(data, undefined, 4);
  displayer.textContent = textedJSON;

  clearFormField();

  console.log("Form Submitted", data);
}

button.addEventListener('click', submitHandler);