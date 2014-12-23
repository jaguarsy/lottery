"use strict"
var gui = require('nw.gui'),
	win = gui.Window.get();

angular.module('lottoryApp')
	.directive('showName', ['$interval', 'lottory', function($interval, lottory) {

		function link(scope, element, attrs) {
			var timeoutId,
				isbegin;

			function updateTime() {
				element.text(lottory.getOneName());
			}

			scope.$watch(attrs.showName, function(value) {
				isbegin = value;
			});

			element.on('$destroy', function() {
				$interval.cancel(timeoutId);
			});

			timeoutId = $interval(function() {
				if (isbegin)
					updateTime();
			}, 10);
		}

		return {
			link: link
		};
	}])
	.controller('mainController', [
		'$scope',
		'lottory',
		'$interval',
		function($scope, lottory, $interval) {

			var timeoutId;

			$scope.isbegin = false;
			$scope.list = [];
			$scope.winners;
			$scope.current = 1;

			win.toggleKioskMode();

			$scope.import = function() {
				$scope.list = lottory.loadList($('#fileDialog').val());

				$scope.message = $scope.list.length > 0 ? "导入成功！" : "导入失败。";
				$('#messagebox').modal();
			};

			$scope.close = function() {
				win.close();
			}


			var start = function() {
				timeoutId = $interval(function() {
					$scope.name = lottory.getOneName();
				}, 10);
			}

			var stop = function() {
				$scope.winners = lottory.win($scope.winner, $scope.current - 1);
				console.log($scope.winners)
				$interval.cancel(timeoutId);
			}

			$scope.begin = function() {
				if ($scope.isbegin && lottory.getCount() == 0) {
					$scope.message = "请先导入抽奖名单";
					$('#messagebox').modal();
					return;
				}

				$scope.isbegin = !$scope.isbegin;

				if ($scope.isbegin) {
					start();
				} else {
					stop();
				}
				$scope.text = $scope.isbegin ? '结束抽奖' : '开始抽奖'

			}
		}
	])