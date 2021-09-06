#!/usr/bin/env bash

# npm install
npx sequelize db:create
npx sequelize db:migrate
npm run Dev