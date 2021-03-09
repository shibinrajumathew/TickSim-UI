#!/bin/bash
clear
echo "################################################"
echo "This script will add the intitial data.
Please make sure the mongodb is started without --auth parameter."
echo "################################################"

if [[ $# -eq 0 ]]
then
  read -p "Enter Mongodb Host[localhost]: " host
  host=${host:-localhost}

  read -p "Enter Mongodb Port[20202]: " port
  port=${port:-20202}

  read -p "Enter finSupport schema[fin_schema]: " fin_schema
  fin_schema=${fin_schema:-finSupport}
  
  read -p "Enter username[fin_support]: " mongodbusername
  mongodbusername=${mongodbusername:-fin_support}

  read -p "Enter password[01March2020]: " mongodbpassword
  mongodbpassword=${mongodbpassword:-01March2020}

else
  host=$1

  port=$2

  admin_schema=$3

  afgpim_schema=$4

fi

current=$(pwd)

dbScripts=$current/dbQuery/

echo "Running scripts to $host:$port $dbScripts"



echo "Running scripts to $host:$port on $fin_schema with $mongodbusername:$mongodbpassword"

mongo -u ${mongodbusername} -p ${mongodbpassword} ${host}:${port}/${fin_schema} --quiet ${dbScripts}/db6monthsData.js

echo "Completed running scripts."

exit
