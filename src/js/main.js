// Game logic
const loopTime = 33.3334;
setInterval(gameLoop, loopTime);

let score = 0;
let money = 0;

let clickPower = 1;
let clickPowerCost = 1;

let basicClickerPower = 1;
let basicClickerPowerCost = 5;
let basicClickerBought = false;
let basicClickerInit = 30000.0;
let basicClickerTime = basicClickerInit;

let advancedClickerPower = 1;
let advancedClickerPowerCost = 25;
let advancedClickerBought = false;
let advancedClickerInit = 7000.0;
let advancedClickerTime = advancedClickerInit;

const clickElem = document.getElementById("clicker");
const moneyElem = document.getElementById("money");

const clickUpgradeElem = document.getElementById("click-upgrade");
const clickPowerElem = document.getElementById("click-power");
const clickPowerCostElem = document.getElementById("click-cost");

const basicClickerElem = document.getElementById("basic-clicker");
const clickerUpgradeElem = document.getElementById("clicker-1-upgrade");
const clickerPowerElem = document.getElementById("clicker-1-power");
const clickerPowerCostElem = document.getElementById("clicker-1-cost");

const advancedClickerElem = document.getElementById("advanced-clicker");
const advancedClickerUpgradeElem = document.getElementById("clicker-2-upgrade");
const advancedClickerPowerElem = document.getElementById("clicker-2-power");
const advancedClickerPowerCostElem = document.getElementById("clicker-2-cost");


function gameLoop() {
    if (clickElem.innerHTML !== score.toString()) {
        clickElem.innerHTML = score.toString();
    }
    if (moneyElem.innerHTML !== money.toString()) {
        moneyElem.innerHTML = money.toString();
    }

    basicClickerTime -= loopTime;
    if (basicClickerTime <= 0) {
        if (basicClickerBought) {
            console.log("incrementing score 1");
            incrementScore(basicClickerPower);
        }
        basicClickerTime = basicClickerInit;
    }

    advancedClickerTime -= loopTime;
    if (advancedClickerTime <= 0) {
        if (advancedClickerBought) {
            console.log("incrementing score 2");
            incrementScore(advancedClickerPower);
        }
        advancedClickerTime = advancedClickerInit;
    }
}

function incrementScore(amount) {
    score += amount;
    money += amount;
}

clickElem.addEventListener('click', function () {
    incrementScore(clickPower)
}, false);

clickUpgradeElem.addEventListener('click', function () {
    if (money >= clickPowerCost) {
        money -= clickPowerCost;
        clickPower += 1;
        clickPowerCost *= 2;
        clickPowerElem.innerHTML = clickPower;
        clickPowerCostElem.innerHTML = clickPowerCost;
    }
}, false);

clickerUpgradeElem.addEventListener('click', function () {
    if (money >= basicClickerPowerCost) {
        money -= basicClickerPowerCost;
        if (!basicClickerBought) {
            basicClickerBought = true;
            basicClickerElem.classList.remove("hidden");
        }
        basicClickerPower += 1;
        basicClickerPowerCost *= 2;
        clickerPowerElem.innerHTML = basicClickerPower;
        clickerPowerCostElem.innerHTML = basicClickerPowerCost;
    }
}, false);

advancedClickerUpgradeElem.addEventListener('click', function () {
    if (money >= advancedClickerPowerCost) {
        money -= advancedClickerPowerCost;
        if (!advancedClickerBought) {
            advancedClickerBought = true;
            advancedClickerElem.classList.remove("hidden");
        }
        advancedClickerPower += 1;
        advancedClickerPowerCost *= 2;
        advancedClickerPowerElem.innerHTML = advancedClickerPower;
        advancedClickerPowerCostElem.innerHTML = advancedClickerPowerCost;
    }
}, false);



// interaction with the service

function post_score() {
    window.parent.postMessage(
        {
            messageType: "SCORE",
            score: score
        }, "*");
}

function save() {
    window.parent.postMessage(
        {
            messageType: "SAVE",
            gameState: {
                score: score,
                money: money,

                clickPower: clickPower,
                clickPowerCost: clickPowerCost,

                basicClickerPower: basicClickerPower,
                basicClickerPowerCost: basicClickerPowerCost,
                basicClickerBought: basicClickerBought,

                advancedClickerPower: advancedClickerPower,
                advancedClickerPowerCost: advancedClickerPowerCost,
                advancedClickerBought: advancedClickerBought,
            }
        }, "*");
}

function load(state) {
    money = state.money;
    score = state.score;

    clickPower = state.clickPower;
    clickPowerElem.innerHTML = clickPower;
    clickPowerCost = state.clickPowerCost;
    clickPowerCostElem.innerHTML = clickPowerCost;

    basicClickerPower = state.basicClickerPower;
    clickerPowerElem.innerHTML = basicClickerPower;
    basicClickerPowerCost = state.basicClickerPowerCost;
    clickerPowerCostElem.innerHTML = basicClickerPowerCost;
    basicClickerBought = state.basicClickerBought;
    if (state.basicClickerBought) {
        basicClickerElem.classList.remove("hidden");
    }


    advancedClickerPower = state.advancedClickerPower;
    advancedClickerPowerElem.innerHTML = advancedClickerPower;
    advancedClickerPowerCost = state.advancedClickerPowerCost;
    advancedClickerPowerCostElem.innerHTML = advancedClickerPowerCost;
    advancedClickerBought = state.advancedClickerBought;
    if (state.advancedClickerBought) {
        advancedClickerElem.classList.remove("hidden");
    }
}

function loadRequest() {
    window.parent.postMessage(
        {
            messageType: "LOAD_REQUEST"
        }, "*");
}

document.getElementById("save-button").addEventListener('click', function () {
    save()
}, false);
document.getElementById("load-button").addEventListener('click', function () {
    loadRequest()
}, false);
document.getElementById("score-button").addEventListener('click', function () {
    post_score()
}, false);


window.addEventListener("message", function(evt) {
    if(evt.data.messageType === "LOAD") {
        console.log(evt.data)
        load(evt.data.gameState);
    } else if (evt.data.messageType === "ERROR") {
        alert(evt.data.info);
    }
});
