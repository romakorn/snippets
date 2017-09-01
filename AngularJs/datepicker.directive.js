(function () {
    'use strict';

    angular
        .module("authApp")
        .directive("datePicker", function (){
            return {
                restrict:'E',
                scope:{
                    date:'='
                },
                template:'<div class="form_fields date_block">' +
                '<div class="birth_title clearfix">' +
                '<span class="birth_left">DATE OF BIRTH:</span> <span class="birth_right" id="date_header"></span>' +
                '</div>' +
                '<div class="center_align before_after_line">' +
                '<select class="date" id="date" name="date">' +
                '<option ng-repeat="day in days" value="{{day}}">{{day}}.</option>' +
                '</select>' +
                '<select class="date" id="month" name="month">' +
                '<option ng-repeat="month in months" value="{{$index}}">{{month}}</option>' +
                '</select>' +
                '<select class="date" id="fullYear" name="fullYear">' +
                '<option ng-repeat="year in years" value="{{year}}" is-finish="finish">{{year}}</option>' +
                '</select>' +
                '</div>' +
                '</div>',
                link:function link (scope, element,attr){
                    scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
                    scope.months = ['January','February','March','April','May','June','July','August','September','October','November','December']
                    var date = new Date(),
                        current_year = date.getFullYear(),
                        firstLoad = false;
                    scope.years = [];
                    for(var i = current_year - 65; i < current_year - 14; i++){
                        scope.years.push(i);
                    }

                    scope.$watch('date.birth', function (newValue){

                        if(newValue && !firstLoad){
                            firstLoad = true;
                            var dateIndex = scope.date.birth.getDate() - 1,
                                year = scope.date.birth.getFullYear(),
                                monthIndex = scope.date.birth.getMonth(),
                                yearIndex = scope.years.indexOf(year);
                            $('.date#fullYear').drum('setIndex',yearIndex);
                            $('.date#month').drum('setIndex',monthIndex);
                            $('.date#date').drum('setIndex',dateIndex);
                        }


                    })
                    scope.$on('finish', function(param) {
                        $("select.date").drum({
                            interactive:false,
                            onChange : function (elem) {
                                var arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear'};
                                var date = new Date();
                                for (var s in arr) {
                                    var i = ($("select[name='" + s + "']"))[0].value;
                                    eval ("date." + arr[s] + "(" + i + ")");
                                }
                                update(date);

                                var format = pad( date.getDate() ) + '/' + pad( date.getMonth() + 1 ) + '/' + date.getFullYear();

                                $('#date_header').html(format);
                                scope.date.birth =new Date(date.getFullYear(), date.getMonth(), date.getDate());
                            }
                        });
                        $('.date#fullYear').drum('setIndex','40');
                        $('.date#month').drum('setIndex','5');
                    });

                    function update(datetime) {
                        $("#date").drum('setIndex', datetime.getDate()-1);
                        $("#month").drum('setIndex', datetime.getMonth());
                        $("#fullYear").drum('setIndex', getIndexForValue($("#fullYear")[0], datetime.getFullYear()));
                        $("#hours").drum('setIndex', datetime.getHours());
                        $("#minutes").drum('setIndex', datetime.getMinutes());
                    }
                    function getIndexForValue(elem, value) {
                        for (var i=0; i<elem.options.length; i++)
                            if (elem.options[i].value == value)
                                return i;
                    }
                    function pad(number) {
                        if ( number < 10 ) {
                            return '0' + number;
                        }
                        return number;
                    }
                }
            }
        })
    angular
        .module('authApp')
        .directive('isFinish', ['$timeout',function ($timeout) {
            return {
                restrict:'A',
                link:function (scope, element,attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit(attr.isFinish);
                        });
                    }
                }
            }
        }])

})();

