"use strict";angular.module("cimonitorApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","underscore","angularMoment","cb.x2js","ngStorage"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/monitor",{controller:"MonitorCtrl",templateUrl:"views/monitor.html",pageKey:"monitor"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/export",{templateUrl:"views/export.html",controller:"ExportCtrl"}).otherwise({redirectTo:"/"})}]).config(["$compileProvider",function(a){a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/)}]),angular.module("cimonitorApp").controller("MainCtrl",["$scope","monitorConfig","goService",function(a,b,c){a.config=b,a.go=c}]),angular.module("cimonitorApp").factory("goService",["$location",function(a){return function(b){a.path(b)}}]),angular.module("cimonitorApp").factory("projectsModel",["_",function(a){var b=function(){j.all.length=0},c=function(){b();var c=a.values(j.byUrl);a.each(c,function(b){a.each(a.values(b),function(a){j.all.push(a)})})},d=function(a,b){if(!angular.isUndefined(a)){var c=document.getElementById("Audiofailure");for(var d in a)if(!angular.isUndefined(b[d])&&!a[d].isFailure&&b[d].isFailure)return void c.play()}},e=function(a){for(var b in a)return a[b]},f=function(a,b){d(j.byUrl[a],b),j.byUrl[a]=b,c();var f=e(b);j.lastUpdate=angular.isUndefined(f)?"No project returned":f.lastUpdate,j.error=!1,j.loading=!1},g=function(a){j.error=!0,j.errorMessage=a},h=function(b){a.each(j.byUrl[b],function(a){a.loading=!0}),j.loading=!0},i=function(){j.byUrl={},b()},j={all:[],lastUpdate:"",error:!1,byUrl:{},loading:!1,setUrlLoading:h,setProjectsStatus:f,displayError:g,reset:i};return j}]),angular.module("cimonitorApp").factory("processProjectsService",["_","moment",function(a,b){var c=function(a){for(var b in a)if(a.hasOwnProperty(b)){var c=a[b],d=b.slice(1);delete a[b],a[d]=c}return a},d=function(a){return angular.isUndefined(a)||null===a},e=function(b){return b.length>0?function(c){return a.contains(b,c.name)}:function(){return!0}},f=function(e,f){if(d(e)||d(e.Projects)||d(e.Projects.Project))return null;var g=a.chain(e.Projects.Project).map(c).filter(f).map(function(a){return{project:a,name:a.name,isRecent:b(a.lastBuildTime).add(3,"minutes").isAfter(b()),lastUpdate:b().format("MMM, Do HH:mm:ss"),show:!0,loading:!1,isRunning:"Building"===a.activity,isSuccess:"Success"===a.lastBuildStatus,isWarning:"Warning"===a.lastBuildStatus,isFailure:"Failure"===a.lastBuildStatus||"Exception"===a.lastBuildStatus||"Error"===a.lastBuildStatus}}).indexBy("name").value();return g};return function(a){var b=e(a);return function(a){return f(a,b)}}}]),angular.module("cimonitorApp").factory("monitorFetcherService",["$http","x2js","processProjectsService","projectsModel","monitorConfig","$interval",function(a,b,c,d,e,f){var g=function(e){var f=c(e.projects),g=function(a){var c=b.xml_str2json(a),g=f(c);null!==g?d.setProjectsStatus(e.url,g):d.displayError("Invalid response")},h=function(a,b,c,e){d.displayError('Failed to fetch report for "'+e.url+'" got status '+b),console.log("Error fetching report, got status "+b+" and data "+a)};return d.setUrlLoading(e.url),a.get(e.url).success(g).error(h)},h=null,i=function(){null!==h&&(console.debug("canceling promise"),f.cancel(h)),h=null,d.reset()},j=function(){var a=e.config.sources,b=1e3*e.config.refreshInterval,c=function(){for(var b in a)g(a[b])};h=f(c,b),c()},k={start:j,stop:i};return k}]),angular.module("cimonitorApp").filter("trustUrl",["$sce",function(a){return function(b){return a.trustAsResourceUrl(b)}}]),angular.module("cimonitorApp").factory("monitorConfig",["$localStorage",function(a){var b=function(){i.config.sources.push({url:"",projects:[]})},c=function(a){angular.isUndefined(a.audio)&&(a.audio={success:"audio/success.mp3",failure:"audio/failure.wav"}),angular.isUndefined(a.audioFailure)||(a.audio.failure=a.audioFailure,delete a.audioFailure),angular.isUndefined(a.audioSuccess)||(a.audio.success=a.audioSuccess,delete a.audioSuccess)},d={monitorConfig:{refreshInterval:20,audio:{success:"audio/success.mp3",failure:"audio/failure.wav"},sources:[{url:"demo/cctray_sample.xml",projects:[]}]}},e=function(b){i.config=a.$reset(b).monitorConfig},f=function(){e(d)},g=function(a){e(angular.fromJson(a))},h=function(){return angular.toJson({monitorConfig:i.config},!0)},i={config:a.$default(d).monitorConfig,addSource:b,download:h,upload:g,reset:f};return c(i.config),i}]),angular.module("cimonitorApp").controller("MonitorCtrl",["$scope","monitorConfig","monitorFetcherService","goService","projectsModel",function(a,b,c,d,e){a.projects=e,a.config=b,c.start(),a.go=d,a.$on("$locationChangeStart",function(){c.stop()})}]),angular.module("cimonitorApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("cimonitorApp").factory("monitorExport",["monitorConfig","goService",function(a,b){var c=function(){e.exportString=a.download()},d=function(){a.upload(e.exportString),b("/")},e={exportString:"",prepare:c,load:d};return e}]),angular.module("cimonitorApp").controller("ExportCtrl",["$scope","monitorExport",function(a,b){a.export=b,b.prepare()}]);