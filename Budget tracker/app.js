// ██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗████████╗██╗   ██╗
// ██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔════╝╚══██╔══╝╚██╗ ██╔╝
// ██████╔╝██║   ██║██║  ██║██║  ███╗█████╗     ██║    ╚████╔╝ 
// ██╔══██╗██║   ██║██║  ██║██║   ██║██╔══╝     ██║     ╚██╔╝  
// ██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║      ██║   
// ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   
                                                            



//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage   = Math.round((this.value / totalIncome) *100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentege: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function (type, des, val) {
            var newItem, id;

            if (data.items[type].length > 0) {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }
            else {
                id = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            }
            else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }
        


            data.items[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {
             var ids, index;
            // map is a function that loops in an array and returns a new array with the same original size
            // it has access to current, index, array
             ids = data.items[type].map( function(current) {
                    return current.id;
             });

             index = ids.indexOf(id);

             if(index != -1){
                //deletes an item fromthe array: (index, count)
                 data.items[type].splice(index,1);
             }    
        },
        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            //calculate percentege of the income that we 
            if (data.totals.inc > 0) {
                data.percentege = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentege
            }
        },
        calculatePercentages: function() {
            data.items.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });          
        },
        getPercentages: function() {
            var allPerc = data.items.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPerc;
        },
        getData: function () {
            return data;
        }
    };
})();





//UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber = function(num, type) {
        
        var int,dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        //although integers are primitevs, when we try to apply a method to them, they're converted to objects
    
        int = num.split('.')[0];
        dec = num.split('.')[1]; 
        var newNum = int;
        if(int.length > 3){
            var i = int.length%3;
            if(i == 0)
            newNum = "";
            else if(i == 1)
                newNum = num[0]+',';
                else if(i==2)
                newNum = num[0] + num[1] + ',';
            
                
                for(i; i<int.length; i+=3){
                    var temp;
                    temp = int.slice(i,i+3)+',';
                    newNum += temp; 
            }
            newNum = newNum.slice(0,-1)
            
        }
        newNum = newNum + '.' + dec;
        
        return (type == 'exp'? '-' : '+' ) + newNum;
    };
    var nodeListForEach = function(nodeList, callbackFunction) {

        for(var i = 0; i < nodeList.length; i++) {
            callbackFunction(nodeList[i], i);

        }
    };
    return {
        
         displayDate : function () {
            var year,month,months;
    
            months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
            var currDate = new Date();
            year = currDate.getFullYear();
            month = currDate.getMonth();
    
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] +', ' + year;
        },

        getInput: function () {
            
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%',  obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            // 1. select the desired element
            // 2. traverse in the DOM to reach the parent
            // 3. delete that parent's child
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldsArray;
            //queryselector all returns a list not an array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            //we're gonna need a method fron the Array prototype
            //slice returns a section of the array, in case of no parameters it returns a copy of the array
            fieldsArray = Array.prototype.slice.call(fields);

            //applies a function to each element of the array, the callback function have access to these 3 variables:
            //current value being processe, current index, the entire array
            fieldsArray.forEach(function (current, index, array) {
                //remember it's a query!! we can use the value method here
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        displayBudget: function (obj) {

            var type = (obj.budget > 0 ? 'inc' : 'exp' );
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },
        displayPercentages: function (percentages) {
           //queryselectorall returns a nodeList 
            var fields = document.querySelectorAll(DOMstrings.itemPercentageLabel);
            //we can use the slice method from the array prototype, but we will implement a custom function instead
        
            //declaration: our function takes an array and a callback function that gets called in each iteration,
            //by default it has access to the index, current element and the whole array, so we pass those as arguments to the callback functions
            nodeListForEach(fields, function(current, index) {
                //do stuff
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '--';
                }
            });
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue);
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UIctrl) {

    var setupEventListeners = function () {
        var DOM = UIController.getDOMstrings();
        //the anonymous function takes the argument from the browser, each js eventlistener is assigned a set of parameters we can use
        //event is an object with properties like: keyCode, keyCode, ctrlPressed..etc
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {

            //console.log(event);
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteitem);
        document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
    };

    var updateBudget = function () {
        // 1.calculate budget
        budgetController.calculateBudget();
        //2.return the budget
        var budget = budgetController.getBudget();
        //3.display budget
        UIController.displayBudget(budget);
    };

    var updatePercentages = function () {
        // 1. calculate percentages
        budgetController.calculatePercentages();
        // 2. return percentages 
        var percentages = budgetController.getPercentages();
        // 3. display percentages in the UI
        // console.log(percentages);
        UIController.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1.get the field input data
        input = UIController.getInput();

        if (input.description != "" && !isNaN(input.value) && input.value > 0) {
            // 2.add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);
            // 3.add the item to the UI
            UIController.addListItem(newItem, input.type);
            UIController.clearFields();

            // 4.calculate and update budget
            updateBudget();

            updatePercentages();
        }
    };
    
    //the callback function of the addEventListened always has access to the event
    var ctrlDeleteitem = function (event) {
        // console.log(event.target);
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log(itemID);
        if(itemID){
            
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            // console.log(type,id);
            // 1. delete item from the data structure
            budgetController.deleteItem(type,id);
            //2. delete from UI
            UIController.deleteListItem(itemID);
            //3. update budget
            updateBudget();
            updatePercentages();
        }  
    };
    
    return {
        init: function () {
            console.log("app started");
            UIController.displayDate();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);






controller.init();