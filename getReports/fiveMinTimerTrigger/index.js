module.exports = async function () {
  const axios = require("axios");
  require("dotenv").config();
  
    // //Azure Settings
    const azureServiceGateway = process.env.AZURE_SERVICE_GATEWAY;
    const azureGatewayName = azureServiceGateway.toLowerCase();
    const azureBaseUrl = "https://" + azureGatewayName + ".management.azure-api.net";
    const azureResourceGroup = process.env.AZURE_RESOURCE_GROUP;
    const azureProvider = process.env.AZURE_PROVIDER_NAME;
    const azureAPIversion = process.env.AZURE_API_VERSION;
    const azureAnalyticsApiURL = process.env.AZURE_ANALYTICS_API;
  
    // //Azure Subscription Details
    const azureSubscription = process.env.AZURE_SUBSCRIPTION;
    const azureSharedAccessKey = process.env.AZURE_SHARED_ACCESS_KEY;
  
    //Azure Gateway API Endpoints
    const azureAPISpecURL = `${azureBaseUrl}/subscriptions/${azureSubscription}/resourceGroups/${azureResourceGroup}/providers/${azureProvider}/service/${azureServiceGateway}/reports/byRequest`;
  
  // Set Variables
  currentTime = "";
  fiveMinutesAgo = "";
  body = {};
  resp = "";
  
  // Determine the current time and the time 5 minutes ago
  async function getTime() {
    try {
      currentTime = new Date().toISOString();
      fiveMinutesAgo = new Date(Date.now() - 5000 * 60).toISOString();
    } catch (err) {
      console.log(err);
    }
    // process return
    return currentTime, fiveMinutesAgo;
  }
  
  async function getReport(currentTime, fiveMinutesAgo) {
    let resp = {}
    await axios({
      method: "GET",
      url: azureAPISpecURL,
      params: {
        $filter: `timestamp ge datetime'${fiveMinutesAgo}' and timestamp le datetime'${currentTime}'`,
        "api-version": azureAPIversion,
      },
      headers: {
        Authorization: azureSharedAccessKey,
      },
    })
      .then((response) => {
        resp = response.data
      })
      .catch((err) => {
        console.error(err);
      });
  
    // process return
    return resp
  }
  
  // Call to post the analytics
  async function postMet(body) {
    // let pBody = {}
    await axios({
    "method": "POST",
    "url": azureAnalyticsApiURL,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": body
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch((err) => {
    console.error(err);
  });
  }
  
  async function main() {
    try {
      console.log("******************\n*  running main  *\n******************\n");
  
      // Get the times needed to generate the report
      getTime();
      console.log("Current time is: ", currentTime);
      console.log("Previous time is: ", fiveMinutesAgo);
  
      // Get the report
      body = await getReport(currentTime, fiveMinutesAgo);
      // console.log("Main Function Body is: ", body);
  
      // Post the metrics
      pBody = await postMet(body);
      console.log("Posted Body is: ", body);
      
    } catch (err) {
      console.log(err);
    }
  }
  
  main();  
};
