"use strict"
var gui = require('nw.gui'),
	win = gui.Window.get();

angular.module('lottoryApp')
	.directive('showName', ['$interval', 'lottery', function($interval, lottery) {

		function link(scope, element, attrs) {
			var timeoutId,
				isbegin;

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
				timeoutId = $interval(function() {
					if (isbegin)
						updateTime();
				}, 10);
			}

			var stop = function() {
				$interval.cancel(timeoutId);
				//先获取默认的
				var name = lottery.getDefaultName(scope.current - 1);
				if (name) element.text(name)
				scope.winner = element.text();
				lottery.win(scope.winner, scope.current - 1);
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

		function link(scope, element, attrs) {

			scope.$watch(attrs.showAwardClass, function(value) {
				if (value == '1')
					element.text('一等奖');
				else if (value == '2')
					element.text('二等奖');
				else if (value == '3')
					element.text('三等奖');
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

			var timeoutId;

			var loadconfig = function() {
				var conf = lottery.getConfig();
				$scope.showconfig = {
					defaultWinners: [
						conf.d[0].join(','),
						conf.d[1].join(','),
						conf.d[2].join(',')
					],
					neverWin: conf.n.join(',')
				};
			}
			loadconfig();

			$scope.isbegin = false;
			$scope.list = [];
			$scope.winners = lottery.getWinners();
			$scope.current = 1;
			$scope.awards = [];

			for (var i = 1; i <= 3; i++) {
				var name = lottery.getAwards(i);
				var path = lottery.getAwardsPath();
				$scope.awards.push({
					name: name,
					path: path + i + "/" + name
				});
			}

			win.toggleKioskMode();

			$scope.import = function() {
				$scope.list = lottery.loadList($('#fileDialog').val());

				$scope.message = $scope.list.length > 0 ? "导入成功！" : "导入失败。";
				$('#messagebox').modal();
			};

			$scope.close = function() {
				win.close();
			};

			$scope.setDelete = function(name) {
				$scope.targetName = name;
			};

			$scope.remove = function() {
				lottery.removeWinner($scope.targetName);
			}

			$scope.openconfig = function() {
				$('#configbox').modal();
			}

			$scope.saveConfig = function() {
				lottery.setConfig($scope.showconfig.defaultWinners, $scope.showconfig.neverWin);
			}

			$scope.cancelConfig = function() {
				loadconfig();
			}
		}
	])