module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  require("dotenv").config();
  const axios = require("axios");

  //Rapid GraphQL PAPI Settings
  const gHost = process.env.GQL_HOST;
  const gUrl = process.env.GQL_URL;
  const gRapidKey = process.env.GQL_RAPID_KEY;

  //Rapid Analytics PAPI Settings
  const aHost = process.env.ANL_HOST;
  const aUrl = process.env.ANL_URL;
  const aRapidKey = process.env.ANL_RAPID_KEY;

  //Azure Settings
  const azureServiceGateway = process.env.AZURE_SERVICE_GATEWAY;
  const azureGatewayName = azureServiceGateway.toLowerCase();
  const azureBaseUrl =
    "https://" + azureGatewayName + ".management.azure-api.net";
  const azureResourceGroup = process.env.AZURE_RESOURCE_GROUP;
  const azureProvider = process.env.AZURE_PROVIDER_NAME;
  const azureAPIversion = process.env.AZURE_API_VERSION;

  //Azure Subscription Details
  const azureSubscription = process.env.AZURE_SUBSCRIPTION;
  const azureSharedAccessKey = process.env.AZURE_SHARED_ACCESS_KEY;
  
  // Neeed variables
  rapidApiId = "";
  apiVersionName = "";
  displayName = "";
  apiName = "";
  productId = "";
  ipAddress = "";
  responseCode = "";
  timeStamp = "";
  time = "";
  appId = "";
  productId = "";
  unixTime = "";
  newTime = "";
  method = "";
  endpoint = "";

  // Get the details from the report
  async function getReportDetail() {
    try {
      // Use regex to get just the Api name out of the API Id
      apiId = req.body.value[i].apiId;
      const regex1 = "^/apis/([a-zA-Z]+(-[a-zA-Z]+)+)$";
      apiRegex = apiId.match(regex1);
      apiName = apiRegex[1];

      // Use regex to get just the AppId out of the productId
      productId = req.body.value[i].productId;
      const regex2 = "^/products/(.*)";
      productRegex = productId.match(regex2);
      appId = productRegex[1];

      // Use regex to get just the endpoint out of the url
      url = req.body.value[i].url;
      const regex3 = "^https://myazureapigateway.azure-api.net(.*)";
      urlRegex = url.match(regex3);
      endpoint = urlRegex[1];

      // Get the rest of the details: ipAddress, responseCode, timeStamp
      method = req.body.value[i].method;
      ipAddress = req.body.value[i].ipAddress;
      responseCode = req.body.value[i].responseCode;
      timeStamp = req.body.value[i].timestamp;

      // Get the UNIX time
      newTime = JSON.stringify(Date.parse(timeStamp));
      const regex4 = "^.{0,10}";
      timeRegex = newTime.match(regex4);
      time = Number(timeRegex[0]);
    } catch (err) {
      console.log(err);
    }
    // process return
    return apiName, appId, endpoint, method, ipAddress, responseCode, time;
  }

  // Call to get the API "Display Name"
  async function getDisplayName(apiName) {
    await axios({
      method: "GET",
      url: `${azureBaseUrl}/subscriptions/${azureSubscription}/resourceGroups/${azureResourceGroup}/providers/${azureProvider}/service/${azureServiceGateway}/apis/${apiName}`,
      params: {
        "api-version": azureAPIversion,
      },
      headers: {
        Authorization: azureSharedAccessKey,
      },
    })
      .then((response) => {
        displayName = response.data.properties.displayName;
      })
      .catch((err) => {
        console.error(err);
      });
    // process return
    return displayName;
  }

  // Call to get the Rapid API Id
  async function getRapiApiId(displayName) {
    //Operating variables
    let rapidApiId = "";

    //Build API call
    const getRapiApiId = {
      method: "POST",
      url: gUrl,
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": gRapidKey,
        "X-RapidAPI-Host": gHost,
      },
      data: {
        query: `query queryApis ($name: [String!] ) {\n  apis(\n    where: {\n      name: $name\n    },\n  ) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}`,
        variables: { name: displayName },
      },
    };

    await axios
      .request(getRapiApiId)
      .then(function (response) {
        rapidApiId = response.data.data.apis.edges[0].node.id;
      })
      .catch(function (error) {
        console.error(error);
      });
    // process return
    return rapidApiId;
  }

  // Call to create the metric in Rapid
  async function createMetric(
    rapidApiId,
    appId,
    endpoint,
    method,
    responseCode,
    time,
    ipAddress
  ) {
    const createMetric = {
      method: "POST",
      url: aUrl,
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": aRapidKey,
        "X-RapidAPI-Host": aHost,
      },
      // data: `[{"api":"${rapidApiId}","application":"${appId}","endpoint":"${endpoint}","method":"${method}","status":${responseCode},"type":"http","timestamp":${time},"originIP":"${ipAddress}"}]`,
      data: `[{"api":"${rapidApiId}","application":"${appId}","endpoint":"${endpoint}","method":"${method}","status":${responseCode},"type":"http","timestamp":${time},"originIP":"${ipAddress}"}]`,
    };

    await axios
      .request(createMetric)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function main() {
    try {
      console.log(
        "******************\n*  running main  *\n******************\n"
      );
      // Get details from the report
      getReportDetail();

      // console.log("apiVersionName is: ", apiVersionName);
      console.log("apiName is: ", apiName);
      console.log("application is: ", appId);
      console.log("method is: ", method);
      console.log("endpoint is: ", endpoint);
      console.log("ipAddress is: ", ipAddress);
      console.log("status is: ", responseCode);
      console.log("timeStamp is: ", time);

      // Get the displayName
      displayName = await getDisplayName(apiName);
      console.log("displayName is : ", displayName);

      // Get the Rapid API Id
      rapidApiId = await getRapiApiId(displayName);
      console.log("rapidApiId is : ", rapidApiId);

      // Create Metric in Rapid
      createMet = await createMetric(
        rapidApiId,
        appId,
        endpoint,
        method,
        responseCode,
        time,
        ipAddress
      );
    } catch (err) {
      console.log(err);
    }
  }
  // Iterate through the report and call main
  count = req.body.count;
  console.log("Count is: ", count);
  i = 0;

  while (i < count) {
    console.log("i is: ", i);
    if (req.body.value[i].method != "OPTIONS")
    if (req.body.value[i].apiId != "/apis/create-analytics")
    main();
    async function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    await sleep(5000);
    i++;
    console.log("i incremented is: ", i);
  }
};
