#!/bin/bash
clear
echo "################################################"
echo "This script will add the internal users for Fin-support.
Please make sure the mongodb is started without --auth parameter."
echo "################################################"

if [[ $# -eq 0 ]]
then
  read -p "Enter Mongodb Host[localhost]: " host
  host=${host:-localhost}

  read -p "Enter Mongodb Port[20202]: " port
  port=${port:-20202}

  read -p "Enter admin schema[admin]: " admin_schema
  admin_schema=${admin_schema:-admin}

  read -p "Enter finSupport schema[fin_schema]: " fin_schema
  fin_schema=${fin_schema:-finSupport}

else
  host=$1

  port=$2

  admin_schema=$3

  fin_schema=$4

fi

current=$(pwd)

dbScripts=$current/dbQuery/

echo "queryDir: $dbScripts"
echo "Running scripts to $host:$port on $admin_schema and $fin_schema"

mongo ${host}:${port}/${admin_schema} --quiet ${dbScripts}/admin_user.js
mongo ${host}:${port}/${fin_schema} --quiet ${dbScripts}/fin_user.js

echo "Completed running scripts. Now change the mongodb to start with --auth parameter."

