#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const args = minimist(process.argv.slice(2));

if(args.h) {
	console.log(
	"Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE \n \
	-h            Show this help message and exit. \n \
	-n, -s        Latitude: N positive; S negative. \n \
	-e, -w        Longitude: E positive; W negative. \n \
	-z            Time zone: uses tz.guess() from moment-timezone by default. \n \
	-d 0-6        Day to retrieve weather: 0 is today; defaults to 1. \n \
	-j            Echo pretty JSON from open-meteo API and exit." 
	);
	process.exit(0);
}

const timezone = args.z ? args.z : moment.tz.guess();

var latitude = args.n || args.s * -1;
var longitude = args.e || args.w * -1;
var day = args.d ? args.d : 1;
var start_date = moment().format("YYYY-MM-DD"); 
var end_date = moment().add(day,'days').format("YYYY-MM-DD");

var URL  = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&temperature_unit=fahrenheit&timezone=' + timezone + '&start_date=' + start_date + '&end_date=' + end_date;

// Make a request
const response = await fetch(URL);

// Get the data from the request
const data = await response.json();

if(args.j) {
	console.log(data);
	process.exit(0);
}

const days = args.d;

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

console.log(data);
