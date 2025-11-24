#!/bin/bash
# Script para ejecutar el backend con Maven directamente

cd backend
mvn clean install -DskipTests
mvn spring-boot:run
