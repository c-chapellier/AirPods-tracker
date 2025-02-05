#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p src/assets/icons

# Download icons
curl -o src/assets/icons/airtag.png "https://raw.githubusercontent.com/google/material-design-icons/master/png/device/bluetooth_searching/materialicons/24dp/1x/baseline_bluetooth_searching_black_24dp.png"
curl -o src/assets/icons/keys.png "https://raw.githubusercontent.com/google/material-design-icons/master/png/content/key/materialicons/24dp/1x/baseline_key_black_24dp.png"
curl -o src/assets/icons/wallet.png "https://raw.githubusercontent.com/google/material-design-icons/master/png/action/account_balance_wallet/materialicons/24dp/1x/baseline_account_balance_wallet_black_24dp.png"
curl -o src/assets/icons/car.png "https://raw.githubusercontent.com/google/material-design-icons/master/png/maps/directions_car/materialicons/24dp/1x/baseline_directions_car_black_24dp.png"
curl -o src/assets/icons/airpods.png "https://raw.githubusercontent.com/google/material-design-icons/master/png/hardware/headphones/materialicons/24dp/1x/baseline_headphones_black_24dp.png"
