"use strict"

var XLSX = require('xlsx'),
	path = require('path'),
	fs = require('fs'),
	execPath = path.dirname(process.execPath);

angular.module('lottoryApp')
	.factory('lottery', [function() {

		var nameList,
			count = 0,
			winners = [
				[],
				[],
				[]
			],
			winnerindex = [],
			awardsPath = execPath + "/awards/",
			configPath = execPath + "/config",
			defaultWinner = [],
			neverWinner = [];

		var getFiles = function(dir) {
			return fs.readdirSync(dir);
		};

		return {
			loadList: function(filename, callback) {
				var sheet = XLSX.readFile(filename).Sheets.Sheet1;
				nameList = []
				for (var index in sheet) {
					if (sheet[index].w)
						nameList.push(sheet[index].w)
				}
				count = nameList.length;
				return nameList;
			},

			getList: function() {
				return nameList;
			},

			rand: function(max) {
				return Math.round(Math.random() * max);
			},

			getCount: function() {
				return count;
			},

			getOneName: function() {
				var rand = this.rand(count);
				for (var i = 0; i < 10; i++) {
					if (winnerindex.indexOf(nameList[rand]) < 0) {
						return nameList[rand];
					}
				}
				rand = this.rand(count);
			},

			win: function(name, aClass) {
				winnerindex.push(name);
				winners[aClass].push(name);
				return winners;
			},

			getWinners: function() {
				return winners;
			},

			removeWinner: function(name) {
				for (var i = 0, len = winners.length; i < len; i++) {
					var index = winners[i].indexOf(name)
					if (index > -1) {
						winners[i].splice(index, 1);
						return;
					}
				}
			},

			getAwardsPath: function() {
				return awardsPath;
			},

			getAwards: function(aClass) {
				return getFiles(awardsPath + aClass)[0];
			},

			getConfig: function() {
				var data = fs.readFileSync(configPath);
				return JSON.parse(data);
			},

			setConfig: function(dWinners, nWinners) {
				var dlist = dWinners.split(',');
				var nlist = nWinners.split(',');
				console.log(fs.writeFile(configPath, JSON.stringify({
					d: dlist,
					n: nlist
				})));
			}
		}

	}])