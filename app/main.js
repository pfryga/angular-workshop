var app = angular.module('app', ['ngRoute']);

app.controller('mainCtrl', function ($scope, $routeParams, itunesFactory, convertFactory) {
  $scope.defLimit = 100;
  $scope.textLimit = 100;
  $scope.sortingSelect = '';
  $scope.sort = "title";
  $scope.allTags = [];
  $scope.currentTag = 'tag1';
  $scope.basket = [];
  $scope.orders = [];
  $scope.itunesList = {};
  $scope.dolarRate;
  $scope.selectedProductId;
  $scope.currentId = $routeParams;
  
  itunesFactory.getData().then(function (data) {
    $scope.itunesList = data.data.results;
  });
  
  convertFactory.getData().then(function (data) {
    $scope.dolarRate = data.data.rate;
  });
  
  $scope.setSelectedProductId = function (productId) {
    $scope.selectedProductId = productId;
  };
  
  $scope.inserAllTags = function () {
      for (var i = 0; i < $scope.products.length; i++) {
        for (var j = 0; j < $scope.products[i].tags.length; j++) {
          if (!($scope.allTags.indexOf($scope.products[i].tags[j]) !== -1)) {
            $scope.allTags.push($scope.products[i].tags[j]);
          }
        }
      }
  };
  
  $scope.setCurrentTag = function (name) {
    $scope.currentTag = name;
  };
  
  $scope.toggleDesc = function (product) {
    if ($scope.defLimit === product.textLimit) {
      product.textLimit = 1000;
    } else {
      product.textLimit = $scope.defLimit;
    }
  };
  
  $scope.products = [{
    title: "Warzywa",
    textLimit: 100,
    imageUrl: "http://lorempixel.com/400/200/",
    description: "jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznacz",
    price: 150,
    tags: ['tag1', 'tag2', 'tag3'],
    special: true
  }, {
    title: "Owoce",
    textLimit: 100,
    imageUrl: "http://lorempixel.com/400/200/",
    description: "jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznacz",
    price: 110,
    tags: ['tag1', 'tag2', 'tag3'],
    special: false
  }, {
    title: "Abstract",
    textLimit: 100,
    imageUrl: "http://lorempixel.com/400/200/",
    description: "jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznacz",
    price: 200,
    tags: ['tag1', 'tag2', 'tag3'],
    special: true
  }, {
    title: "Lorem ergo",
    textLimit: 100,
    imageUrl: "http://lorempixel.com/400/200/",
    description: "jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznacz",
    price: 300,
    tags: ['tag1', 'tag2', 'tag4'],
    special: true
  }];
  
});

app.directive('inputDirective', function () {
  return {
    restrict: 'E',
    scope: {
      basket: '=',
      product: '='
    },
    templateUrl: 'inputDirectiveTemplate.html',
    link: function (scope) {
      scope.toggleBasket = function (basket, product) {
        if (basket.indexOf(product) !== -1) {
          basket.splice(basket.indexOf(product), 1); 
        } else {
          basket.push(product);
        }
      };
    }
  }
});

app.directive('basketDirective', function () {
  return {
    restrict: 'E',
    scope: {
      basket: '='
    },
    templateUrl: 'basket.html',
    link: function (scope) {
      scope.totalPrice = function () {
        var sum = 0;
        
        for (var n = 0; n < scope.basket.length; n++) {
          sum += scope.basket[n].price;
        }
        
        return sum;
      }
    }
  }
});

app.directive('orderForm', function () {
  return {
    restrict: 'E',
    scope: {
      orders: '=',
      order: '='
    },
    templateUrl: 'order-form.html',
    link: function (scope) {
        scope.order = {
            firstname: 'Piotr Fryga',
            street: 'ul. Zielona',
            city: 'KN'
        };
        
        scope.addNewOrder = function (order) {
          order.completed = false;
          scope.orders.push(order);
        };
    }
  }
});

app.factory('itunesFactory', function ($http) {
    return {
      getData: function () {
        return $http.get('https://xplatform.org/static/resources/itunes.json').then(function (data) {
          return data;
        });
      }
    }
});

app.factory('convertFactory', function ($http) {
    return {
      getData: function () {
        return $http.get('https://xplatform.org/convert?from=USD&to=PLN').then(function (data) {
          return data;
        });
      }
    }
});

app.filter('correctCurrency', function() {
  return function(input) {
    return Math.round(input * 100) / 100;
  };
});

app.config(function ($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home.html' 
  });
  
  $routeProvider.when('/order', {
    templateUrl: 'order.html'
  });
  
  $routeProvider.when('/product/:id', {
    templateUrl: 'productDetails.html'
  });
  
  $routeProvider.otherwise('/home');
});
