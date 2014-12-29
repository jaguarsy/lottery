"use strict"

var XLSX = require('xlsx'),
	path = require('path'),
	fs = require('fs'),
	execPath = path.dirname(process.execPath);

angular.module('lottoryApp')
	.factory('lottery', [function() {

		var nameList,
			name,
			rand,
			count = 0,
			awardsPath = execPath + "/awards/",
			configPath = execPath + "/config",
			winnerindex = [],
			winners = [
				[],
				[],
				[]
			],
			neverWinners = [],
			defaultWinners = [
				[],
				[],
				[]
			],
			config,
			separator = /[,，]/;

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
				rand = this.rand(count);
				for (var i = 0; i < 50; i++) {
					name = nameList[rand];
					if (winnerindex.indexOf(name) < 0 && //排除已获奖的人
						config.n.indexOf(name) < 0) { //获奖人不在禁止获奖名单中
						return name;
					}
					rand = this.rand(count);
				}
				return '';
			},
			//获取默认的winner
			getDefaultName: function(aClass) {
				for (var i = 0, len = config.d[aClass].length; i < len; i++) {
					name = config.d[aClass][i];
					if (!name || name.trim() == '') continue;
					if (winnerindex.indexOf(name) < 0 && //排除已获奖的人
						config.n.indexOf(name) < 0) { //获奖人不在禁止获奖名单中
						return name;
					}
				}
				return undefined;
			},

			win: function(name, aClass) {
				if (this.isEnd()) return;
				winnerindex.push(name);
				winners[aClass].push(name);
				return winners;
			},

			isEnd: function() {
				return (+winnerindex.length + config.n.length) == nameList.length;
			},

			getWinners: function() {
				return winners;
			},

			removeWinner: function(name) {
				for (var i = 0, len = winners.length; i < len; i++) {
					var index = winners[i].indexOf(name)
					if (index > -1) {
						winners[i].splice(index, 1);
						winnerindex.splice(winnerindex.indexOf(name), 1);
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
				var file = fs.readFileSync(configPath);
				try {
					config = JSON.parse(file);
				} catch (e) {
					config = {
						d: [
							[],
							[],
							[]
						],
						n: []
					}
				}

				return config;
			},

			setConfig: function(dWinners, nWinners) {
				var dlist1 = dWinners[0].split(separator),
					dlist2 = dWinners[1].split(separator),
					dlist3 = dWinners[2].split(separator),
					nlist = nWinners.split(separator);
				config = {
					d: [dlist1, dlist2, dlist3],
					n: nlist
				};
				fs.writeFileSync(configPath, JSON.stringify(config));
			}
		}

	}])