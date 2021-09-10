#!/usr/bin/env bash

npx sequelize db:create
npx sequelize db:migrate
npm run Dev