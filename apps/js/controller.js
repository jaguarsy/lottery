"use strict"
var gui = require('nw.gui'),
	win = gui.Window.get();

angular.module('lottoryApp')
	.directive('showName', ['$interval', 'lottery', function($interval, lottery) {

		function link(scope, element, attrs) {
			var timeoutId,
				isbegin,
				startLimit = [1, 1, 2, 3, 2, 2, 3, 2]; //每一项奖品抽奖次数的限制

			function updateTime() {
				element.text(lottery.getOneName());
			}

			scope.$watch(attrs.showName, function(value) {
				isbegin = value;
			});

			element.on('$destroy', function() {
				$interval.cancel(timeoutId);
			});

			var showMsg = function(msg) {
				scope.message = msg;
				$('#messagebox').modal();
			}

			var start = function() {
				scope.winners = [];
				scope.startCount++;
				timeoutId = $interval(function() {
					if (isbegin)
						updateTime();
				}, 10);
			}

			var stop = function() {
				var list = lottery.getNames(scope.current - 1, scope.turn);
				scope.winners = list;
				element.text(list[list.length - 1]);
				if (startLimit[scope.current - 1] == scope.startCount) {
					scope.startEnable = false;
				}
			}

			scope.begin = function() {
				if (!scope.isbegin && lottery.getCount() == 0) {
					showMsg("请先导入抽奖名单");
					return;
				}
				scope.isbegin = !scope.isbegin;

				if (scope.isbegin) {
					start();
				} else {
					stop();
				}
				scope.text = scope.isbegin ? '结束抽奖' : '开始抽奖'
			}
		}

		return {
			link: link
		};
	}])
	.directive('showAwardClass', [function() {

		var awardsName = ["特等奖", "一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "七等奖"];

		function link(scope, element, attrs) {

			scope.$watch(attrs.showAwardClass, function(value) {
				element.text(awardsName[value - 1]);
			});
		}

		return {
			link: link
		};
	}])
	.controller('mainController', [
		'$scope',
		'lottery',
		'$interval',
		function($scope, lottery, $interval) {

			var timeoutId,
				awardsPath = execPath + "/awards/";

			$scope.isbegin = false;
			$scope.list = [];
			$scope.current = 8;
			$scope.turn = 0;
			$scope.awards = [];
			$scope.turnDetail = lottery.getTurn($scope.current - 1);
			$scope.startCount = 0;
			$scope.startEnable = true;

			//显示奖品
			for (var i = 0; i <= 7; i++) {
				var names = lottery.getAwards(i);
				var path = lottery.getAwardsPath();
				var awards = [];

				for (var j = 0, len = names.length; j < len; j++) {
					awards.push({
						name: names[j].split('.')[0].split('-')[1],
						path: path + i + "/" + names[j]
					})
				}

				$scope.awards.push(awards);
			}

			//全屏
			win.toggleKioskMode();

			//$scope.import = function() {
			$scope.list = lottery.loadList(awardsPath + "data.xlsx");
			// $scope.message = $scope.list.length > 0 ? "导入成功！" : "导入失败。";
			// $('#messagebox').modal();
			//};

			$scope.close = function() {
				win.close();
			};

			$scope.minimize = function() {
				win.minimize();
			};

			$scope.nextTurn = function() {
				if ($scope.turnDetail.turnCount <= $scope.turn + 1) return;
				$scope.turn++;
			}

			$scope.change = function() {
				$scope.turn = 0;
				$scope.startCount = 0;
				$scope.winners = [];
				$scope.startEnable = true;
				$scope.turnDetail = lottery.getTurn($scope.current - 1);
			}
		}
	])