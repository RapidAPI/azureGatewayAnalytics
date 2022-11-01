# azureGatewayAnalytics
Code to enable analytics to be gathered every 5 minutes and sent to RapidAPI via the Analytics API

This code utilizes a Timer Trigger function in Azure to gather reports on API traffic over the last 5 minutes and then posts them to an HTTP Trigger function in Azure that creates the analytics in RapidAPI.

## GitHub Repo

[https://github.com/RapidAPI/azureGatewayAnalytics](https://github.com/RapidAPI/azureGatewayAnalytics)

## What You Will Need

1. Access to the Azure Platform. You can [try it for free here](https://azure.microsoft.com/en-us/free/). 
2. Set up a [Timer Trigger](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-csharp) Azure Function
3. Set up an [HTTP Trigger](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp) Azure Function
4. Set the following environment values in your .env file to support the javascript code running in the Azure serverless function.

## Environment Values:

- From RapidAPI

```jsx
// Rapid GQL PAPI Values\
GQL_HOST='{your-graphql-platform-api-host}'\
GQL_URL='{your-graphql-platform-api-url}'\
GQL_RAPID_KEY='{your-graphql-platform-api-key}'\

// Rapid REST PAPI Values\
ANL_HOST='{your-analytics-platform-api-host}'\
ANL_URL='{your-analytics-platform-api-url}'\
ANL_RAPID_KEY='{your-analytics-platform-api-key}'\
```

- From Azure

```jsx
// AZURE GATEWAY API Values\
AZURE_SERVICE_GATEWAY='your-azure-api-gateway-name'\
AZURE_RESOURCE_GROUP='your-resource-group'\
AZURE_PROVIDER_NAME='Microsoft.ApiManagement'\
AZURE_API_VERSION='2021-12-01-preview'\
AZURE_SUBSCRIPTION='your 36-digit-azure subscription'\
AZURE_SHARED_ACCESS_KEY='your-shared-access-key-from-apim-service'\
AZURE_ANALYTICS_API='you-http-trigger-url'\
```

## Future Enhancements

The functionality is split into 2 Azure functions; a timer trigger to get the reports and an HTTP trigger to create the analytics. Although this shows the flexibility of the Azure functions and the platform, these two can be combined into a single Timer trigger function.
