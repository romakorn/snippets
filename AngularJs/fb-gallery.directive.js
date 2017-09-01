(function () {
    'use strict';

    angular
        .module("authApp")
        .directive("fbGallery",['$http', function ($http) {
            return {
                restrict:'E',
                templateUrl:'/views/fb_gallery.html',
                scope:{
                    images:'=',
                    imagefb:'=',
                    isaccount:'=',
                    imgnumber:'='
                },
                link:fbGallery
            };

            function fbGallery(scope, element, attrs) {
                var checkedPhoto = false,
                    blobImg;
                scope.catalogs = [];
                scope.fb_active = false;
                scope.li_active = false;

                scope.$watch('images', function (newValue) {

                    if (newValue){

                        for (var i = 0; i < scope.images.length; i++) {
                            scope.catalogs.push(scope.images[i].images[0].source);
                        }
                    }
                });

                var last_index;
                scope.selectPhoto = function (e,index) {

                    if(last_index === index){
                        return;
                    }

                    last_index = index;
                    var lis = $('.catalog_li'),
                        url;
                    lis.removeClass('active');
                    e.target.parentElement.classList.add("active");
                    url = e.target.src;
                    getblob(url).then(function (blob) {
                        blobImg = blob;
                        checkedPhoto = true;
                    });

                };
                
                scope.photoOk = function () {

                    if( checkedPhoto ){
                        scope.imagefb.blob = blobImg;
                        scope.fb_active = false;
                    }
                };

                function getblob(url) {
                    return new Promise(function (resolve, reject) {
                        try {
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET",  url);
                            xhr.responseType = "blob";
                            xhr.onerror = function () {
                                reject("Newtwork error");
                            };
                            xhr.onload = function(){
                                if (xhr.status === 200) {resolve(xhr.response)}
                                else {reject("Loading error:" + xhr.statusText)}
                            };
                            xhr.send();
                        }
                        catch (err){reject(err.message)}
                    });
                }
            }
        }])


})();

