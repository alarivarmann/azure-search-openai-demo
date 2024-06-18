#!/bin/bash
azd env set AZURE_OPENAI_SERVICE openaimain
azd env set AZURE_OPENAI_RESOURCE_GROUP rg-sote-hackathon-5
azd env set AZURE_SEARCH_SERVICE sote-search1
azd env set AZURE_SEARCH_SERVICE_RESOURCE_GROUP rg-sote-hackathon-5
azd env set AZURE_SEARCH_SERVICE_LOCATION westeurope
azd env set AZURE_SEARCH_QUERY_LANGUAGE fi
azd env set AZURE_SEARCH_QUERY_SPELLER fi
azd env set AZURE_APP_SERVICE_PLAN plan-xf45xqygt5trq
azd env set AZURE_SEARCH_INDEX azureblob-index
