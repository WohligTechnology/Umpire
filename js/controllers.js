var uploadres = [];
var selectedData = [];
var abc = {};
var globalfunction = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize', 'ui.sortable']);
// window.uploadUrl = 'http://104.197.23.70/user/uploadfile';
//window.uploadUrl = 'http://192.168.2.22:1337/user/uploadfile';
window.uploadUrl = 'http://localhost:1337/uploadfile/upload';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    //  NavigationService.countUser(function(data, status) {
    //    $scope.user = data;
    //  });
});
phonecatControllers.controller('login', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;

    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.login = {};
    $scope.verifylogin = function() {
        console.log($scope.login);
        if ($scope.login.email && $scope.login.password) {
            NavigationService.adminLogin($scope.login, function(data, status) {
                if (data.value == "false") {
                    $scope.isValidLogin = 0;
                } else {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", data);
                    $location.url("/home");
                }
            })
        } else {
            console.log("blank login");
            $scope.isValidLogin = 0;
        }

    }
});

phonecatControllers.controller('createorder', function($scope, TemplateService, NavigationService, ngDialog, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Orders");
    TemplateService.title = $scope.menutitle;
    TemplateService.list = 2;
    TemplateService.content = "views/createorder.html";
    $scope.navigation = NavigationService.getnav();
    console.log($routeParams.id);

    $scope.order = {};

    $scope.submitForm = function() {
        console.log($scope.order);
        NavigationService.saveOrder($scope.order, function(data, status) {
            console.log(data);
            $location.url("/order");
        });
    };

    $scope.order.tag = [];
    $scope.ismatch = function(data, select) {
        abc.select = select;
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.order.tag = select.selected;
            }
        });
        console.log($scope.artwork.tag);
    }

    $scope.refreshOrder = function(search) {
        $scope.tag = [];
        if (search) {
            NavigationService.findArtMedium(search, $scope.order.tag, function(data, status) {
                $scope.tag = data;
            });
        }
    };

    $scope.GalleryStructure = [{
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }, {
        "name": "image",
        "type": "image"
    }, {
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }];

    $scope.persons = [{
        "id": 1,
        "name": "first option"
    }, {
        "id": 2,
        "name": "first option"
    }, {
        "id": 3,
        "name": "first option"
    }, {
        "id": 4,
        "name": "first option"
    }, {
        "id": 5,
        "name": "first option"
    }];

    NavigationService.getUser(function(data, status) {
        $scope.persons = data;
    });

});

phonecatControllers.controller('headerctrl', function($scope, TemplateService, NavigationService, $routeParams, $location, $upload, $timeout) {
    $scope.template = TemplateService;
    //  if (!$.jStorage.get("adminuser")) {
    //    $location.url("/login");
    //
    //  }

    var imagejstupld = "";
    $scope.images = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';

    var arrLength = 0;

    globalfunction.onFileSelect = function($files, callback) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        arrLength = $files.length;
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, callback);
            }
        }
    };

    $scope.start = function(index, callback) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.images.push(imagejstupld.files[0].fd);
                        console.log($scope.images);
                        imagejstupld = "";
                        if (arrLength == $scope.images.length) {
                            callback($scope.images);
                            $scope.images = [];
                        }
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

});



//User Controller
phonecatControllers.controller('UserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/user.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.User = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedUser($scope.pagedata, function(data, status) {
            $scope.user = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteUser(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteuser', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'UserCtrl',
                closeByDocument: false
            });
        }
        //End User
});
//user Controller
//createUser Controller
phonecatControllers.controller('createUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createuser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    $scope.submitForm = function() {
        NavigationService.saveUser($scope.user, function(data, status) {
            $location.url('/user');
        });
    };
    //createUser
});
//createUser Controller
//editUser Controller
phonecatControllers.controller('editUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edituser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    NavigationService.getOneUser($routeParams.id, function(data, status) {
        $scope.user = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.user._id = $routeParams.id;
        NavigationService.saveUser($scope.user, function(data, status) {
            $location.url('/user');
        });
    };
    //editUser
});
//editUser Controller
//Match Controller
phonecatControllers.controller('MatchCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Match');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/match.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Match = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedMatch($scope.pagedata, function(data, status) {
            $scope.match = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteMatch(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletematch', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'MatchCtrl',
                closeByDocument: false
            });
        }
        //End Match
});
//match Controller
//createMatch Controller
phonecatControllers.controller('createMatchCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Match');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/creatematch.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.match = {};
    $scope.submitForm = function() {
        NavigationService.saveMatch($scope.match, function(data, status) {
            $location.url('/match');
        });
    };
    $scope.match.team1 = [];
    $scope.ismatchTeam1 = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.team1 = select.selected;
            }
        });
    }
    $scope.refreshTeam1 = function(search) {
        $scope.team1 = [];
        if (search) {
            NavigationService.findTeam(search, $scope.match.team1, function(data, status) {
                if (data.value != false) {
                    $scope.team1 = data;
                }
            });
        }
    };
    $scope.match.team2 = [];
    $scope.ismatchTeam2 = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.team2 = select.selected;
            }
        });
    }
    $scope.refreshTeam2 = function(search) {
        $scope.team2 = [];
        if (search) {
            NavigationService.findTeam(search, $scope.match.team2, function(data, status) {
                if (data.value != false) {
                    $scope.team2 = data;
                }
            });
        }
    };
    $scope.match.tournament = [];
    $scope.ismatchTournament = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savetournament(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.tournament = select.selected;
            }
        });
    }
    $scope.refreshTournament = function(search) {
        $scope.tournament = [];
        if (search) {
            NavigationService.findTournament(search, $scope.match.tournament, function(data, status) {
                if (data.value != false) {
                    $scope.tournament = data;
                }
            });
        }
    };
    $scope.match.toss = [];
    $scope.ismatchToss = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savetoss(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.toss = select.selected;
            }
        });
    }
    $scope.refreshToss = function(search) {
        $scope.toss = [];
        if (search) {
            NavigationService.findToss(search, $scope.match.toss, function(data, status) {
                if (data.value != false) {
                    $scope.toss = data;
                }
            });
        }
    };
    //createMatch
});
//createMatch Controller
//editMatch Controller
phonecatControllers.controller('editMatchCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Match');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editmatch.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.match = {};
    NavigationService.getOneMatch($routeParams.id, function(data, status) {
        $scope.match = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.match._id = $routeParams.id;
        NavigationService.saveMatch($scope.match, function(data, status) {
            $location.url('/match');
        });
    };
    $scope.match.team1 = [];
    $scope.ismatchTeam1 = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.team1 = select.selected;
            }
        });
    }
    $scope.refreshTeam1 = function(search) {
        $scope.team1 = [];
        if (search) {
            NavigationService.findTeam(search, $scope.match.team1, function(data, status) {
                if (data.value != false) {
                    $scope.team1 = data;
                }
            });
        }
    };
    $scope.match.team2 = [];
    $scope.ismatchTeam2 = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.team2 = select.selected;
            }
        });
    }
    $scope.refreshTeam2 = function(search) {
        $scope.team2 = [];
        if (search) {
            NavigationService.findTeam(search, $scope.match.team2, function(data, status) {
                if (data.value != false) {
                    $scope.team2 = data;
                }
            });
        }
    };
    $scope.match.tournament = [];
    $scope.ismatchTournament = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savetournament(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.tournament = select.selected;
            }
        });
    }
    $scope.refreshTournament = function(search) {
        $scope.tournament = [];
        if (search) {
            NavigationService.findTournament(search, $scope.match.tournament, function(data, status) {
                if (data.value != false) {
                    $scope.tournament = data;
                }
            });
        }
    };
    $scope.match.toss = [];
    $scope.ismatchToss = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savetoss(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.match.toss = select.selected;
            }
        });
    }
    $scope.refreshToss = function(search) {
        $scope.toss = [];
        if (search) {
            NavigationService.findToss(search, $scope.match.toss, function(data, status) {
                if (data.value != false) {
                    $scope.toss = data;
                }
            });
        }
    };
    //editMatch
});
//editMatch Controller
//Score Controller
phonecatControllers.controller('ScoreCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Score');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/score.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Score = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedScore($scope.pagedata, function(data, status) {
            $scope.score = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteScore(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletescore', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'ScoreCtrl',
                closeByDocument: false
            });
        }
        //End Score
});
//score Controller
//createScore Controller
phonecatControllers.controller('createScoreCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Score');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createscore.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.score = {};
    $scope.submitForm = function() {
        NavigationService.saveScore($scope.score, function(data, status) {
            $location.url('/score');
        });
    };
    $scope.score.match = [];
    $scope.ismatchMatch = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savematch(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.score.match = select.selected;
            }
        });
    }
    $scope.refreshMatch = function(search) {
        $scope.match = [];
        if (search) {
            NavigationService.findMatch(search, $scope.score.match, function(data, status) {
                if (data.value != false) {
                    $scope.match = data;
                }
            });
        }
    };
    $scope.score.team = [];
    $scope.ismatchTeam = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.score.team = select.selected;
            }
        });
    }
    $scope.refreshTeam = function(search) {
        $scope.team = [];
        if (search) {
            NavigationService.findTeam(search, $scope.score.team, function(data, status) {
                if (data.value != false) {
                    $scope.team = data;
                }
            });
        }
    };
    //createScore
});
//createScore Controller
//editScore Controller
phonecatControllers.controller('editScoreCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Score');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editscore.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.score = {};
    NavigationService.getOneScore($routeParams.id, function(data, status) {
        $scope.score = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.score._id = $routeParams.id;
        NavigationService.saveScore($scope.score, function(data, status) {
            $location.url('/score');
        });
    };
    $scope.score.match = [];
    $scope.ismatchMatch = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savematch(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.score.match = select.selected;
            }
        });
    }
    $scope.refreshMatch = function(search) {
        $scope.match = [];
        if (search) {
            NavigationService.findMatch(search, $scope.score.match, function(data, status) {
                if (data.value != false) {
                    $scope.match = data;
                }
            });
        }
    };
    $scope.score.team = [];
    $scope.ismatchTeam = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.score.team = select.selected;
            }
        });
    }
    $scope.refreshTeam = function(search) {
        $scope.team = [];
        if (search) {
            NavigationService.findTeam(search, $scope.score.team, function(data, status) {
                if (data.value != false) {
                    $scope.team = data;
                }
            });
        }
    };
    //editScore
});
//editScore Controller
//Rate Controller
phonecatControllers.controller('RateCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Rate');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/rate.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Rate = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedRate($scope.pagedata, function(data, status) {
            $scope.rate = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteRate(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleterate', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'RateCtrl',
                closeByDocument: false
            });
        }
        //End Rate
});
//rate Controller
//createRate Controller
phonecatControllers.controller('createRateCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Rate');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createrate.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.rate = {};
    $scope.submitForm = function() {
        NavigationService.saveRate($scope.rate, function(data, status) {
            $location.url('/rate');
        });
    };
    $scope.rate.match = [];
    $scope.ismatchMatch = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savematch(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.rate.match = select.selected;
            }
        });
    }
    $scope.refreshMatch = function(search) {
        $scope.match = [];
        if (search) {
            NavigationService.findMatch(search, $scope.rate.match, function(data, status) {
                if (data.value != false) {
                    $scope.match = data;
                }
            });
        }
    };
    //createRate
});
//createRate Controller
//editRate Controller
phonecatControllers.controller('editRateCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Rate');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editrate.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.rate = {};
    NavigationService.getOneRate($routeParams.id, function(data, status) {
        $scope.rate = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.rate._id = $routeParams.id;
        NavigationService.saveRate($scope.rate, function(data, status) {
            $location.url('/rate');
        });
    };
    $scope.rate.match = [];
    $scope.ismatchMatch = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savematch(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.rate.match = select.selected;
            }
        });
    }
    $scope.refreshMatch = function(search) {
        $scope.match = [];
        if (search) {
            NavigationService.findMatch(search, $scope.rate.match, function(data, status) {
                if (data.value != false) {
                    $scope.match = data;
                }
            });
        }
    };
    //editRate
});
//editRate Controller
//Notification Controller
phonecatControllers.controller('NotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/notification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Notification = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedNotification($scope.pagedata, function(data, status) {
            $scope.notification = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteNotification(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletenotification', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'NotificationCtrl',
                closeByDocument: false
            });
        }
        //End Notification
});
//notification Controller
//createNotification Controller
phonecatControllers.controller('createNotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};
    $scope.submitForm = function() {
        NavigationService.saveNotification($scope.notification, function(data, status) {
            $location.url('/notification');
        });
    };
    $scope.notification.user = [];
    $scope.ismatchUser = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveuser(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.notification.user = select.selected;
            }
        });
    }
    $scope.refreshUser = function(search) {
        $scope.user = [];
        if (search) {
            NavigationService.findUser(search, $scope.notification.user, function(data, status) {
                if (data.value != false) {
                    $scope.user = data;
                }
            });
        }
    };
    $scope.notification.match = [];
    $scope.ismatchMatch = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savematch(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.notification.match = select.selected;
            }
        });
    }
    $scope.refreshMatch = function(search) {
        $scope.match = [];
        if (search) {
            NavigationService.findMatch(search, $scope.notification.match, function(data, status) {
                if (data.value != false) {
                    $scope.match = data;
                }
            });
        }
    };
    $scope.notification.team = [];
    $scope.ismatchTeam = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.notification.team = select.selected;
            }
        });
    }
    $scope.refreshTeam = function(search) {
        $scope.team = [];
        if (search) {
            NavigationService.findTeam(search, $scope.notification.team, function(data, status) {
                if (data.value != false) {
                    $scope.team = data;
                }
            });
        }
    };
    //createNotification
});
//createNotification Controller
//editNotification Controller
phonecatControllers.controller('editNotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};
    NavigationService.getOneNotification($routeParams.id, function(data, status) {
        $scope.notification = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.notification._id = $routeParams.id;
        NavigationService.saveNotification($scope.notification, function(data, status) {
            $location.url('/notification');
        });
    };
    $scope.notification.user = [];
    $scope.ismatchUser = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveuser(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.notification.user = select.selected;
            }
        });
    }
    $scope.refreshUser = function(search) {
        $scope.user = [];
        if (search) {
            NavigationService.findUser(search, $scope.notification.user, function(data, status) {
                if (data.value != false) {
                    $scope.user = data;
                }
            });
        }
    };
    $scope.notification.match = [];
    $scope.ismatchMatch = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.savematch(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.notification.match = select.selected;
            }
        });
    }
    $scope.refreshMatch = function(search) {
        $scope.match = [];
        if (search) {
            NavigationService.findMatch(search, $scope.notification.match, function(data, status) {
                if (data.value != false) {
                    $scope.match = data;
                }
            });
        }
    };
    $scope.notification.team = [];
    $scope.ismatchTeam = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveteam(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.notification.team = select.selected;
            }
        });
    }
    $scope.refreshTeam = function(search) {
        $scope.team = [];
        if (search) {
            NavigationService.findTeam(search, $scope.notification.team, function(data, status) {
                if (data.value != false) {
                    $scope.team = data;
                }
            });
        }
    };
    //editNotification
});
//editNotification Controller
//Userorder Controller
phonecatControllers.controller('UserorderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Userorder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/userorder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Userorder = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedUserorder($scope.pagedata, function(data, status) {
            $scope.userorder = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteUserorder(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteuserorder', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'UserorderCtrl',
                closeByDocument: false
            });
        }
        //End Userorder
});
//userorder Controller
//createUserorder Controller
phonecatControllers.controller('createUserorderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Userorder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createuserorder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.userorder = {};
    $scope.submitForm = function() {
        NavigationService.saveUserorder($scope.userorder, function(data, status) {
            $location.url('/userorder');
        });
    };
    $scope.userorder.user = [];
    $scope.ismatchUser = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveuser(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.userorder.user = select.selected;
            }
        });
    }
    $scope.refreshUser = function(search) {
        $scope.user = [];
        if (search) {
            NavigationService.findUser(search, $scope.userorder.user, function(data, status) {
                if (data.value != false) {
                    $scope.user = data;
                }
            });
        }
    };
    //createUserorder
});
//createUserorder Controller
//editUserorder Controller
phonecatControllers.controller('editUserorderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Userorder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edituserorder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.userorder = {};
    NavigationService.getOneUserorder($routeParams.id, function(data, status) {
        $scope.userorder = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.userorder._id = $routeParams.id;
        NavigationService.saveUserorder($scope.userorder, function(data, status) {
            $location.url('/userorder');
        });
    };
    $scope.userorder.user = [];
    $scope.ismatchUser = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveuser(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.userorder.user = select.selected;
            }
        });
    }
    $scope.refreshUser = function(search) {
        $scope.user = [];
        if (search) {
            NavigationService.findUser(search, $scope.userorder.user, function(data, status) {
                if (data.value != false) {
                    $scope.user = data;
                }
            });
        }
    };
    //editUserorder
});
//editUserorder Controller
//Tournament Controller
phonecatControllers.controller('TournamentCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Tournament');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/tournament.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Tournament = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedTournament($scope.pagedata, function(data, status) {
            $scope.tournament = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteTournament(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletetournament', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'TournamentCtrl',
                closeByDocument: false
            });
        }
        //End Tournament
});
//tournament Controller
//createTournament Controller
phonecatControllers.controller('createTournamentCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Tournament');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createtournament.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.tournament = {};
    $scope.submitForm = function() {
        NavigationService.saveTournament($scope.tournament, function(data, status) {
            $location.url('/tournament');
        });
    };
    //createTournament
});
//createTournament Controller
//editTournament Controller
phonecatControllers.controller('editTournamentCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Tournament');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edittournament.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.tournament = {};
    NavigationService.getOneTournament($routeParams.id, function(data, status) {
        $scope.tournament = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.tournament._id = $routeParams.id;
        NavigationService.saveTournament($scope.tournament, function(data, status) {
            $location.url('/tournament');
        });
    };
    //editTournament
});
//editTournament Controller
//Team Controller
phonecatControllers.controller('TeamCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Team');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/team.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Tournament = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedTeam($scope.pagedata, function(data, status) {
            $scope.team = data.data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteTeam(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteteam', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'TeamCtrl',
                closeByDocument: false
            });
        }
        //End Tournament
});
//team Controller
//createTeam Controller
phonecatControllers.controller('createTeamCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Team');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createteam.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.tournament = {};
    $scope.submitForm = function() {
        NavigationService.saveTeam($scope.team, function(data, status) {
            $location.url('/team');
        });
    };
    //createTeam
});
//createTeam Controller
//editTeam Controller
phonecatControllers.controller('editTeamCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Team');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editteam.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.tournament = {};
    NavigationService.getOneTeam($routeParams.id, function(data, status) {
        $scope.team = data.data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.tournament._id = $routeParams.id;
        NavigationService.saveTeam($scope.team, function(data, status) {
            $location.url('/team');
        });
    };
    //editTeam
});
//editTeam Controller
//Add New Controller
