#!/bin/bash

ip=`ifconfig en0 | grep 'inet ' | awk '{print $2}'`
port=3334

REACT_APP_API_URL="http://$ip:$port"
REACT_APP_INTRA_URL="https://api.intra.42.fr/oauth/authorize?client_id=62d3ba58218a1919cc25331d961e485c8969bd81aad394ecb207db5716c12b04&redirect_uri=http%3A%2F%2F10.11.43.5%3A3000%2Fauth&response_type=code"

touch .env .
echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env
echo "REACT_APP_INTRA_URL=\"$REACT_APP_INTRA_URL\"" >> .env