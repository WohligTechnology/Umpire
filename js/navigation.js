var adminurl = "http://192.168.0.126:1337/";
var adminlogin = {
    "username": "admin@admin.com",
    "password": "admin123"
};
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
    var navigation = [{
            name: "Dashboard",
            classis: "active",
            link: "#/home",
            subnav: []
        }, {
            name: 'User',
            active: '',
            link: '#/user',
            subnav: []
        }, {
            name: 'Match',
            active: '',
            link: '#/match',
            subnav: []
        }, {
            name: 'Score',
            active: '',
            link: '#/score',
            subnav: []
        }, {
            name: 'Rate',
            active: '',
            link: '#/rate',
            subnav: []
        }, {
            name: 'Notification',
            active: '',
            link: '#/notification',
            subnav: []
        }, {
            name: 'Userorder',
            active: '',
            link: '#/userorder',
            subnav: []
        }, {
            name: 'Tournament',
            active: '',
            link: '#/tournament',
            subnav: []
        }, {
            name: 'Team',
            active: '',
            link: '#/team',
            subnav: []
        } //Add New Left
    ];

    return {
        makeactive: function(menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        getnav: function() {
            return navigation;
        },
        adminLogin: function(data, callback) {
            $http({
                url: adminurl + "user/adminlogin",
                method: "POST",
                data: {
                    "email": data.email,
                    "password": data.password
                }
            }).success(callback);
        },
        //    countUser: function(callback) {
        //      $http.get(adminurl + "user/countusers").success(callback);
        //    },
        setUser: function(data) {
            $.jStorage.set("user", data);
        },
        getUser: function() {
            $.jStorage.get("user");
        },
        getOneUser: function(id, callback) {
            $http({
                url: adminurl + 'user/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedUser: function(user, callback) {
            $http({
                url: adminurl + 'user/findLimited',
                method: 'POST',
                data: {
                    'search': user.search,
                    'pagesize': parseInt(user.limit),
                    'pagenumber': parseInt(user.page)
                }
            }).success(callback);
        },
        deleteUser: function(callback) {
            $http({
                url: adminurl + 'user/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteuser')
                }
            }).success(callback);
        },
        saveUser: function(data, callback) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneMatch: function(id, callback) {
            $http({
                url: adminurl + 'match/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedMatch: function(match, callback) {
            $http({
                url: adminurl + 'match/findLimited',
                method: 'POST',
                data: {
                    'search': match.search,
                    'pagesize': parseInt(match.limit),
                    'pagenumber': parseInt(match.page)
                }
            }).success(callback);
        },
        deleteMatch: function(callback) {
            $http({
                url: adminurl + 'match/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletematch')
                }
            }).success(callback);
        },
        saveMatch: function(data, callback) {
            $http({
                url: adminurl + 'match/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveTeam: function(data, callback) {
            $http({
                url: adminurl + 'team/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findTeam: function(data, team, callback) {
            $http({
                url: adminurl + 'team/find',
                method: 'POST',
                data: {
                    search: data,
                    team: team
                }
            }).success(callback);
        },
        saveTournament: function(data, callback) {
            $http({
                url: adminurl + 'tournament/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findTournament: function(data, tournament, callback) {
            $http({
                url: adminurl + 'tournament/find',
                method: 'POST',
                data: {
                    search: data,
                    tournament: tournament
                }
            }).success(callback);
        },
        saveToss: function(data, callback) {
            $http({
                url: adminurl + 'toss/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findToss: function(data, toss, callback) {
            $http({
                url: adminurl + 'toss/find',
                method: 'POST',
                data: {
                    search: data,
                    toss: toss
                }
            }).success(callback);
        },
        getOneScore: function(id, callback) {
            $http({
                url: adminurl + 'score/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedScore: function(score, callback) {
            $http({
                url: adminurl + 'score/findLimited',
                method: 'POST',
                data: {
                    'search': score.search,
                    'pagesize': parseInt(score.limit),
                    'pagenumber': parseInt(score.page)
                }
            }).success(callback);
        },
        deleteScore: function(callback) {
            $http({
                url: adminurl + 'score/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletescore')
                }
            }).success(callback);
        },
        saveScore: function(data, callback) {
            $http({
                url: adminurl + 'score/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveMatch: function(data, callback) {
            $http({
                url: adminurl + 'match/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findMatch: function(data, match, callback) {
            $http({
                url: adminurl + 'match/find',
                method: 'POST',
                data: {
                    search: data,
                    match: match
                }
            }).success(callback);
        },
        saveTeam: function(data, callback) {
            $http({
                url: adminurl + 'team/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findTeam: function(data, team, callback) {
            $http({
                url: adminurl + 'team/find',
                method: 'POST',
                data: {
                    search: data,
                    team: team
                }
            }).success(callback);
        },
        getOneRate: function(id, callback) {
            $http({
                url: adminurl + 'rate/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedRate: function(rate, callback) {
            $http({
                url: adminurl + 'rate/findLimited',
                method: 'POST',
                data: {
                    'search': rate.search,
                    'pagesize': parseInt(rate.limit),
                    'pagenumber': parseInt(rate.page)
                }
            }).success(callback);
        },
        deleteRate: function(callback) {
            $http({
                url: adminurl + 'rate/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleterate')
                }
            }).success(callback);
        },
        saveRate: function(data, callback) {
            $http({
                url: adminurl + 'rate/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveMatch: function(data, callback) {
            $http({
                url: adminurl + 'match/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findMatch: function(data, match, callback) {
            $http({
                url: adminurl + 'match/find',
                method: 'POST',
                data: {
                    search: data,
                    match: match
                }
            }).success(callback);
        },
        getOneNotification: function(id, callback) {
            $http({
                url: adminurl + 'notification/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedNotification: function(notification, callback) {
            $http({
                url: adminurl + 'notification/findLimited',
                method: 'POST',
                data: {
                    'search': notification.search,
                    'pagesize': parseInt(notification.limit),
                    'pagenumber': parseInt(notification.page)
                }
            }).success(callback);
        },
        deleteNotification: function(callback) {
            $http({
                url: adminurl + 'notification/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletenotification')
                }
            }).success(callback);
        },
        saveNotification: function(data, callback) {
            $http({
                url: adminurl + 'notification/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveUser: function(data, callback) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findUser: function(data, user, callback) {
            $http({
                url: adminurl + 'user/find',
                method: 'POST',
                data: {
                    search: data,
                    user: user
                }
            }).success(callback);
        },
        saveMatch: function(data, callback) {
            $http({
                url: adminurl + 'match/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findMatch: function(data, match, callback) {
            $http({
                url: adminurl + 'match/find',
                method: 'POST',
                data: {
                    search: data,
                    match: match
                }
            }).success(callback);
        },
        saveTeam: function(data, callback) {
            $http({
                url: adminurl + 'team/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findTeam: function(data, team, callback) {
            $http({
                url: adminurl + 'team/find',
                method: 'POST',
                data: {
                    search: data,
                    team: team
                }
            }).success(callback);
        },
        getOneUserorder: function(id, callback) {
            $http({
                url: adminurl + 'userorder/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedUserorder: function(userorder, callback) {
            $http({
                url: adminurl + 'userorder/findLimited',
                method: 'POST',
                data: {
                    'search': userorder.search,
                    'pagesize': parseInt(userorder.limit),
                    'pagenumber': parseInt(userorder.page)
                }
            }).success(callback);
        },
        deleteUserorder: function(callback) {
            $http({
                url: adminurl + 'userorder/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteuserorder')
                }
            }).success(callback);
        },
        saveUserorder: function(data, callback) {
            $http({
                url: adminurl + 'userorder/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveUser: function(data, callback) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findUser: function(data, user, callback) {
            $http({
                url: adminurl + 'user/find',
                method: 'POST',
                data: {
                    search: data,
                    user: user
                }
            }).success(callback);
        },
        getOneTournament: function(id, callback) {
            $http({
                url: adminurl + 'tournament/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedTournament: function(tournament, callback) {
            $http({
                url: adminurl + 'tournament/findLimited',
                method: 'POST',
                data: {
                    'search': tournament.search,
                    'pagesize': parseInt(tournament.limit),
                    'pagenumber': parseInt(tournament.page)
                }
            }).success(callback);
        },
        deleteTournament: function(callback) {
            $http({
                url: adminurl + 'tournament/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletetournament')
                }
            }).success(callback);
        },
        saveTournament: function(data, callback) {
            $http({
                url: adminurl + 'tournament/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneTeam: function(id, callback) {
            $http({
                url: adminurl + 'team/findOne',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedTeam: function(team, callback) {
            $http({
                url: adminurl + 'team/findLimited',
                method: 'POST',
                data: {
                    'search': team.search,
                    'pagesize': parseInt(team.limit),
                    'pagenumber': parseInt(team.page)
                }
            }).success(callback);
        },
        deleteTeam: function(callback) {
            $http({
                url: adminurl + 'team/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteteam')
                }
            }).success(callback);
        },
        saveTeam: function(data, callback) {
            $http({
                url: adminurl + 'team/save',
                method: 'POST',
                data: data
            }).success(callback);
        }, //Add New Service

    }
})
