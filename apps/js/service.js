"use strict"

var XLSX = require('xlsx');

angular.module('lottoryApp')
	.factory('lottory', [function() {

		var nameList,
			count = 0,
			winners = [
				[],
				[],
				[]
			];

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
				return nameList[this.rand(count)];
			},

			win: function(name, aClass) {
				winners[aClass].push(name);
				return winners;
			},

			getWinners: function(){
				return winners;
			}
		}

	}])