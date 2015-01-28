"use strict"

var XLSX = require('xlsx'),
	path = require('path'),
	fs = require('fs'),
	execPath = path.dirname(process.execPath);

angular.module('lottoryApp')
	.factory('lottery', [function() {

		var nameList,
			person,
			rand,
			count = 0,
			awardsPath = execPath + "/awards/",
			configPath = execPath + "/config",
			winners,
			turnConfig = [{
				turnCount: 1,
				number: 1
			}, {
				turnCount: 1,
				number: 1
			}, {
				turnCount: 2,
				number: 1
			}, {
				turnCount: 3,
				number: 1
			}, {
				turnCount: 2,
				number: 3
			}, {
				turnCount: 2,
				number: 4
			}, {
				turnCount: 3,
				number: 5
			}, {
				turnCount: 1,
				number: 25
			}, ],
			separator = /[,，]/;

		var getFiles = function(dir) {
			return fs.readdirSync(dir);
		};

		var trim = function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}

		return {
			loadList: function(filename, callback) {
				var sheet = XLSX.readFile(filename).Sheets.Sheet1;
				nameList = [];

				for (var i = 2;; i++) {
					if (!sheet['A' + i]) {
						break;
					}
					nameList.push({
						name: trim(sheet['A' + i].w),
						isIn: sheet['B' + i] ? trim(sheet['B' + i].w) == 'y':true,
						aClass: sheet['C' + i] ? trim(sheet['C' + i].w) : -1,
						awardIndex: sheet['D' + i] ? trim(sheet['D' + i].w) : -1
					})
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

			getOneName: function(isIn) {
				rand = this.rand(count);
				for (var i = 0; i < 50; i++) {
					person = nameList[rand];
					if (person && (!isIn || person.isIn && person.aClass == -1)) { //随机抽取名字时跳过已设定获奖内容的人
						if (isIn) {
							var name = person.name;
							nameList.splice(rand, 1);
							return name;
						} else {
							return person.name;
						}
					}
					rand = this.rand(count);
				}
				return '';
			},

			getNames: function(aClass, turn) {
				var list = [],
					length = turnConfig[aClass].number;

				//先加载默认获奖的人
				for (var i = 0, len = nameList.length; i < len; i++) {
					if (!nameList[i]) break;

					if (nameList[i].aClass == aClass &&
						nameList[i].isIn &&
						nameList[i].awardIndex == turn) {
						var tmpName = nameList[i].name;
						list.push(tmpName);
						nameList.splice(i, 1); //删除这个人
						count--;
						len--;
						i--;
					}
				}
				length = length - list.length;

				//随机获取获奖人
				for (var i = 0; i < length; i++) {
					var tmpName = this.getOneName(true)
					list.push(tmpName);
					count--;
				}
				return list;
			},

			//获取默认的winner
			getDefaultName: function(aClass) {
				return undefined;
			},

			isEnd: function() {
				return nameList.length == 0;
			},

			getAwardsPath: function() {
				return awardsPath;
			},

			getAwards: function(aClass) {
				return getFiles(awardsPath + aClass);
			},

			getTurn: function(aClass) {
				return turnConfig[aClass];
			}
		}

	}])