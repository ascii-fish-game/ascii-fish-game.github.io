let t;
let g;
let s;

let playerData;

if (localStorage.getItem("player") !== null) {
    playerData = JSON.parse(localStorage.getItem("player"));
} else {
    playerData = {
        "name": "???",
        "firstFish": true,
        "currentTalk": 99,
        "shop": {
            "level": 1,
            "upgradeCost": 50,
            "brodyConvo": false,
            "brodyCaught": false
        },
        "upgrades": [
            { // catch time     0
                "level": 0,
                "info": "you currently do not have any upgrades that affect your catch time!",
                "bonus": 0,
                "multiplier": 1,
            },
            { // money          1
                "level": 0,
                "info": "you currently do not have any upgrades that affect your money multiplier!",
                "multiplier": 1
            },
            { // catch speed    2
                "level": 0,
                "info": "you currently do not have any upgrades that affect your catch speed!",
                "multiplier": 0,
                "bonus": 0
            },
            { // bait usage     3
                "info": "you currently do not have any upgrades that affect your bait usage!",
                "usage": false
            },
            { // run away       4
                "level": 0,
                "info": "you currently do not have any upgrades that affect the fish's ability to run away!",
                "CA": 0,
                "CM": 0
            },
            { // bonus upgrades 5 
                "unlimitedGrouper": false,
                "unlimitedTuna": false,
                "goliathM": 0
            },
            { // casino         6
                "level": 0,
                "multiplier": 1
            }
        ],
        "bag": [],
        "money": 10,
        "bait": 10,
        "score": 0,
        "lastFish": Date.now(),
        "tutorial": false
    };
}

let money = playerData.money;
let score = playerData.score;
let bait = playerData.bait;
let lastFish = playerData.lastFish;

let tutorial = playerData.tutorial;

let firstFish = playerData.firstFish;

let currentTalk = playerData.currentTalk;

let shopLvl = playerData.shop.level;
let upgradeCost = playerData.shop.upgradeCost;
let brodyConvo = playerData.shop.brodyConvo;
let brodyCaught = playerData.shop.brodyCaught;

let bag = playerData.bag;

// !--- SHOP ITEMS START ---!

// lvl. 2
let timeBS = playerData.upgrades[0].bonus; // bonus added time at the start of catching a fish; needs to be +1000 (in ms)
let timeM = playerData.upgrades[0].multiplier; // time multiplier
let achievementM = playerData.upgrades[2].multiplier; // needs to >= 2 to have an effect
let moneyM = playerData.upgrades[1].multiplier; // money multiplier
let runCA = playerData.upgrades[4]["CA"]; // decreases time for runAway=true; needs to be +1000 (in ms)
let runCM = playerData.upgrades[4]["CM"];

// lvl. 3 + gamble-a-tron 1000
let unlimitedGrouper = playerData.upgrades[5].unlimitedGrouper; // unlimited grouper, decreases difficulty of goliath by 100
let achievementB = playerData.upgrades[2].bonus; // bonus achievement at the start of catching a fish
let gambleL = playerData.upgrades[6].multiplier; // gamble luck multiplier
let baitU = playerData.upgrades[3].usage; // bait usage boolean

// lvl. 4 + gamble-a-tron 2000
let unlimitedTuna = playerData.upgrades[5].unlimitedTuna; // unlimited tuna, increases chance of tuna XL

// lvl. 5 + gamble-a-tron 3000
let goliathM = playerData.upgrades[5].goliathM; // increases chance and decreases difficulty of goliath by 500; needs to be 1 to have an effect

// !--- SHOP ITEMS END ---!


// shopkeeper stuff
const shopkeeper = document.getElementById("shopkeeper");
const fishShop = document.getElementById("fishShop");
const upgradeShop = document.getElementById("upgradeShop");
const shopItems = document.getElementById("shopItems");
const theShop = document.getElementById("shop2");

// game stuff
const scoreE = document.getElementById("Gscore");
const moneyE = document.getElementById("Gmoney");
const baitE = document.getElementById("Gbait");
const bagE = document.getElementById("Gbag");
const gameAreaE = document.getElementById("gameArea");
const fishAlert = document.getElementById("fishAlert");
const timer = document.getElementById("timer");
const gameGame = document.getElementById("gameGame");

const saveGameE = document.getElementById("saveGameE");
const talkE = document.getElementById("talkE");

let difficulty = 0;
let achievement = 0;
let cv = false;
let gameStart = false;
let fishOn = false;
let runAway = false;
let randomTimer = 0;
let victory = false;
let lost = false;
let gameArea = 99;
let potFish = "";
let potClass = "";
let potScore = 0;

let allowFish;
let tutorialNum = 0;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        if (allowFish) {
            event.preventDefault(); // prevent space bar from scrolling
            buttonPress();
        } else {
            tutorialPress();
        }
    }
});

gameAreaE.addEventListener("touchstart", function(event) {
    event.preventDefault(); // prevent something idek
    if (allowFish) {
        buttonPress();
    } else {
        tutorialPress();
    }
});

function buttonPress() {
    if (!gameStart) {
        gameStart = true;
        gameArea = 0;
        bait -= 1;
        g = setInterval(determineGame, 800);
        setTimeout(fishOnGame, Math.floor(Math.random() * 15000) + 2000);
    } else {
        if (fishOn && !victory) {
            if (randomTimer > 0) {
                if (!victory) {
                    if (!runAway) {
                        achievement += 1 + Math.floor(Math.random() * achievementM);
                    } else {
                        if (achievement > 0) {
                            achievement -= 1 + Math.floor(Math.random() * achievementM);
                            if (achievement < 0) {
                                achievement = 0;
                            }
                        }
                    }
                }
            }
        } else if (victory) {
            if (cv) {
                timer.textContent = "";
                gameGame.textContent = "";
                fishAlert.textContent = `press [space] or press down to cast!`;

                if (firstFish) {
                    shopkeeper.textContent = `nice catch ${playerData.name}! now go fish, buy upgrades, and catch more fish!! :D`;
                    firstFish = false;
                    theShop.style.display = "table-cell";
                    shopItems.style.display = "block";
                    saveGameE.style.display = "inline-block";
                    talkE.style.display = "inline-block";
                    s = setInterval(saveGame, 30000);
                }

                cv = false;
                fishOn = false;
                runAway = false;
                randomTimer = 0;
                victory = false;
                gameArea = 99;
                achievement = 0;
                if (potFish != "bait") {
                    bag.push(potFish);
                    console.log(`put ${potFish} in bag`);
                } else {
                    bait += 1;
                }
                potClass = "";
                potFish = "";

                lost = true;
                setTimeout(() => {
                    cv = true;
                }, 500);
            }
        } else if (lost && cv) {
            if (bait > 0) {
                if (baitU && Math.floor(Math.random() * 4) == 3) {
                    bait = bait;
                } else {
                    bait -= 1;
                }
                lost = false;
                cv = false;
                gameArea = 0;
                fishAlert.textContent = "";
                setTimeout(fishOnGame, Math.floor(Math.random() * 15000) + 2000);
            } else {
                if (money > 0) {
                    fishAlert.textContent = "you have no more bait! buy some more!";
                } else {
                    shopkeeper.textContent = "you have no more bait or money! fineeee... here's 5 bait!";
                    bait += 5;
                }
            }
            
        }
    }
}

function determineGame() {
    if (!fishOn && !victory && !lost) {
        let rand = Math.floor(Math.random() * 2);
        if (rand == 0) {
            gameArea = 1;
        } else {
            gameArea = 0;
        }
    }
}

function changeGameArea() {
    switch (gameArea) {
        case 0:
            gameAreaE.innerHTML = `<div style="font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;white-space: pre;background-color: #ffffff; color: #000000;"><div>                      |''                                     </div><div>                     |' '                                     </div><div>                    |'  '                                     </div><div>                   |'   ''                                    </div><div>                  |'     '                                    </div><div>                 |'       '                                   </div><div>               ||'        ''                                  </div><div>              | '           ''                                </div><div>             |''             ''                               </div><div>            |'                ''                              </div><div>           |'                   ''                            </div><div>          |'                      ''                          </div><div>         |'                         '''                       </div><div>        |'                            '''                     </div><div>       |'                                '''                  </div><div>      |'                                   '''                </div><div>     |║                                       ''              </div><div>   ||║║                                         '''           </div><div>  |║║║║                                           ''''        </div><div> |                                                   ''''''   </div><div>|                                                         '''▄</div></div>`;
            break;
        case 1:
            gameAreaE.innerHTML = `<div style="font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;white-space: pre;background-color: #ffffff; color: #000000;"><div>                      |'                                      </div><div>                     |''                                      </div><div>                    |' ''                                     </div><div>                   |'   '                                     </div><div>                  |'    ''                                    </div><div>                 |'      ''                                   </div><div>               ||'        ''                                  </div><div>              | '          ''                                 </div><div>             |''            ''                                </div><div>            |'               '''                              </div><div>           |'                  ''                             </div><div>          |'                    ''                            </div><div>         |'                       ''                          </div><div>        |'                         '''                        </div><div>       |'                            '''                      </div><div>      |'                               ''''                   </div><div>     |║                                   '''                 </div><div>   ||║║                                     '''               </div><div>  |║║║║                                       ''''            </div><div> |                                                '''''       </div><div>|                                                     '''''''▀</div></div>`;
            break;
        case 2:
            gameAreaE.innerHTML = `<div style="font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;white-space: pre;background-color: #ffffff; color: #000000;"><div>                      |'''                                         </div><div>                     |'  ''                                        </div><div>                    |'     ''                                      </div><div>                   |'       ''                                     </div><div>                  |'          ''                                   </div><div>                 |'             ''                                 </div><div>               ||'               '''                               </div><div>              | '                  ''                              </div><div>             |''                     ''                            </div><div>            |'                         ''                          </div><div>           |'                            ''                        </div><div>          |'                               '''                     </div><div>         |'                                  '''                   </div><div>        |'                                     '''                 </div><div>       |'                                         '''              </div><div>      |'                                            '''            </div><div>     |║                                               '''          </div><div>   ||║║                                                 '''        </div><div>  |║║║║                                                   '''      </div><div> |                                                          ''''   </div><div>|                                                               ''▄</div></div>`;
            break;
        case 3: // fish
            gameAreaE.innerHTML = fish[potClass][potFish].art;
            break;
        case 99:
            gameAreaE.innerHTML = `<div style="font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;white-space: pre;background-color: #ffffff; color: #000000;"><div>                         ''''''''               </div><div>                      |'''       ''''''         </div><div>                     |'               '''''     </div><div>                    |'                    ''''  </div><div>                   |'                        ''▄</div><div>                  |'                           ▄</div><div>                 |'                             </div><div>               ||'                              </div><div>              | '                               </div><div>             |''                                </div><div>            |'                                  </div><div>           |'                                   </div><div>          |'                                    </div><div>         |'                                     </div><div>        |'                                      </div><div>       |'                                       </div><div>      |'                                        </div><div>     |║                                         </div><div>   ||║║                                         </div><div>  |║║║║                                         </div><div> |                                              </div><div>|                                               </div></div>`;
            break;
    }
}

function updateFrame() {
    scoreE.textContent = `score: ${score}`;
    moneyE.textContent = `fishbuck$: ${money}`;
    baitE.textContent = `bait: ${bait}`;
    fishShop.textContent = `fish shop (lvl. ${shopLvl}) →`;
    if (bag.length > 0) {
        bagE.textContent = `bag: ${bag.join(", ")}`;
    } else {
        bagE.textContent = `bag: empty`;
    }
    changeGameArea();

    if (fishOn) {
        if (!victory) {
            randomTimer -= 10;
            if (randomTimer > 0) {
                playFish();
            } else if (randomTimer <= 0) {
                fishAlert.textContent = "you lost the fish! press [space] or press down to cast!";
                timer.textContent = "";
                gameGame.textContent = "";
                fishOn = false;
                runAway = false;
                randomTimer = 0;
                victory = false;
                lost = true;
                gameArea = 99;
                achievement = 0;
                potFish = "";

                setTimeout(() => {
                    cv = true;
                }, 500);
            }
        }
    }
}

function changeMode() {
    if (fishOn) {
        if (randomTimer <= 3000) {
            runAway = false;
        } else {
            if (runAway) {  
                runAway = false;
                setTimeout(changeMode, Math.floor(Math.random() * 7500) + 2500 + runCA);
            } else {
                runAway = true;
                setTimeout(changeMode, Math.floor(Math.random() * 4500) + 500 - runCM);
            }
        }
    }
}

function determineFish() {
    let fishGen = Math.floor(Math.random() * (400 + (20 * goliathM)));

    // *************
    // do unlimitedTuna and unlimitedGrouper LATER
    // *************

    if (fishGen >= 399) { // legendary
        potClass = "legendary";
        potFish = "goliath grouper";
        difficulty = 1000;
        if (goliathM == 1) {
            difficulty -= 100;
        }
        if (unlimitedGrouper) {
            difficulty -= 100;
        }
    } else if (fishGen >= 379) { // ultra rare
        potClass = "ultra rare";
        let keys = Object.keys(fish["ultra rare"]);
        potFish = keys[Math.floor(Math.random() * keys.length)];
    } else if (fishGen >= 339) { // rare
        potClass = "rare";
        let keys = Object.keys(fish.rare);
        potFish = keys[Math.floor(Math.random() * keys.length)];
    } else if (fishGen >= 239) { // uncommon
        potClass = "uncommon";
        let keys = Object.keys(fish.uncommon);
        potFish = keys[Math.floor(Math.random() * keys.length)];
    } else if (fishGen >= 59) { // c
        potClass = "common";
        let keys = Object.keys(fish.common);
        potFish = keys[Math.floor(Math.random() * keys.length)];
    } else {
        potClass = "trash";
        let keys = Object.keys(fish.trash);
        potFish = keys[Math.floor(Math.random() * keys.length)];
        if (potFish == "brody's hat") {
            if (Math.floor(Math.random() * 2) == 1) {
                potFish = "water bottle";
            }
        }
    }

    console.log(`fish: ${potFish} (${potClass})`);
    difficulty = Math.floor(Math.random() * fish[potClass][potFish].difficulty.high) + fish[potClass][potFish].difficulty.low;
    console.log(`difficulty: ${difficulty}`);
}

function fishOnGame() {
    fishOn = true;
    gameArea = 2;

    
    if (!firstFish) {
        determineFish();
        randomTimer = Math.floor(Math.random() * 6000 * timeM) + 8000 + timeBS;

        if (Math.floor(Math.random() * 8) == 7) {
            runAway = true;
        }

        setTimeout(changeMode, Math.floor(Math.random() * 5000) + 2000);
    } else {
        potClass = "common";
        potFish = "gag grouper";
        difficulty = 30;
        randomTimer = 25000;
        setTimeout(changeMode, 1800);
    }
}

function playFish() {
    timer.textContent = `time left: ${(randomTimer / 1000).toString().substring(0, 4)}s`;

    if (achievement < difficulty) {
        let gameStr = "[";
        for (i=0; i < achievement; i++) {
            gameStr += "≡";
        }
        for (i=0; i < difficulty-achievement; i++) {
            gameStr += "=";
        }
        gameStr += "]";
        gameGame.textContent = gameStr;

        if (runAway) {
            fishAlert.textContent = "X: the fish is tryin' to get away!!";
        } else {
            fishAlert.textContent = "O: reel that sucker in!!";
        }
    } else {
        victory = true;
        fishAlert.textContent = `you caught a "${potFish}"! press [space] or press down to put the ${potFish} in your bag!`;
        timer.textContent = `time left: ${(randomTimer / 1000).toString().substring(0, 4)}s; difficulty of fish: ${difficulty}`;
        let gameStr = "[";
        for (i=0; i < achievement; i++) {
            gameStr += "≡";
        }
        gameStr += "]";
        gameGame.textContent = gameStr;

        // score = (difficulty * 10) for normal; (difficulty * 50) for rare; (difficulty * 100) for super rare; 
        gameArea = 3;

        score += Math.ceil(difficulty * fish[potClass][potFish].scoreM);

        lastFish = Date.now();

        setTimeout(() => {
            cv = true;
        }, 500);
    }
}

function sellAllFish() {
    if (bag.length > 0) {
        let ALP = 0;
        shopkeeper.textContent = ``;
        let tempF = ["trash", "common", "uncommon", "rare", "ultra rare", "legendary"];
        while (bag.length > 0) {
            for (i=0; i < 6; i++) {
                if (fish[tempF[i]][bag[0]] != null) {
                    ALP += Math.ceil(fish[tempF[i]][bag[0]].money * moneyM);
                    break;
                }
            }
            bag.shift();
        }
        money += ALP;
        shopkeeper.textContent += `i love fish ^_^ here's $${ALP}. thanks for sellin'!`;
        console.log(`sold $${ALP} worth of fish`);
    } else {
        shopkeeper.textContent = `you don't have any fish to sell dum dum :P`;
    }
}

function buyBait() {
    if (money >= 3) { 
        if (bait >= 20) {
            shopkeeper.textContent = `you already have max bait!`;
        } else {
            bait += 1;
            money -= 3;
            shopkeeper.textContent = `you bought my bait! thanks for doin' business :D`;
        }
    } else {
        poorBoy(3);
    }
}

function createShopItem(funct, i, text) {
    let newE = document.createElement("a");
    newE.setAttribute("onclick", funct);
    newE.setAttribute("id", i);
    newE.textContent = text;
    shopItems.appendChild(newE);
}

function talkShopkeeper() {
    if (!firstFish) {
        let talk;
        while (true) {
            talk = Math.floor(Math.random() * 19);
            if (talk != currentTalk) {
                currentTalk = talk;
                break;
            }
        }
        if (talk == 0) {
            shopkeeper.textContent = `i love fish ^_^`;
        } else if (talk == 1) {
            shopkeeper.textContent = `i know we don't talk much, but i hope you're doing awesome sauce! :P`;
        } else if (talk == 2) {
            shopkeeper.textContent = `le vent se lève ... il faut tenter de vivre ! the wind's rising, we must try to live!`;
        } else if (talk == 3) {
            shopkeeper.textContent = `sometimes i look at the moon at 2 am... and i think about you.... HA just kidding, i think about fish!`;
        } else if (talk == 4) {
            shopkeeper.textContent = `what has two eyes and can swim? uhhh... a fish!`;
        } else if (talk == 5) {
            shopkeeper.textContent = `my mind's an enigma.`;
        } else if (talk == 6) {
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let amPm = hours >= 12 ? "pm" : "am";

            hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) to 12-hour format
            minutes = minutes.toString().padStart(2, "0");
            shopkeeper.textContent = `what time is it? ${hours}:${minutes} ${amPm}?? noooo, it's fish 'o clock!!`;
            if ((hours > 7 && amPm == "pm") || (hours < 4 && amPm == "am") || (hours == 12 && amPm == "am")) {
                shopkeeper.textContent += ` actually, i should start going to bed soon :P`;
            }
        } else if (talk == 7) {
            shopkeeper.textContent = `i'm not a fish, but i can be your catch of the day!`;
        } else if (talk == 8) {
            shopkeeper.textContent = `the best time of day is the time when i can sit down, relax, watch some tv, and eat apple pie. the second best time is when i'm fishing!`;
        } else if (talk == 9) {
            if (!brodyConvo) {
                shopkeeper.innerHTML = `oh hey by the way, i lost my <b>friend's hat</b> a couple weeks ago... he might kill me if he finds out!!! if you find it please let me know!!`;
                brodyConvo = true;
            } else {
                shopkeeper.innerHTML = `please let me know if you find my <b>friend's hat</b>! he might kill me if he finds out i lost it... :_(`;
            }
        } else if (talk == 10) {
            shopkeeper.innerHTML = `did you know that i can't swim!? that's why i had to cut my line that <b>one time</b>...`;
        } else if (talk == 11) {
            shopkeeper.innerHTML = `i've never seen it but i've heard of this <b>legend</b> from long ago... they say there's something <b>goliath</b> in size here ~_~`;
        } else if (talk == 12) {
            shopkeeper.innerHTML = `you can see all the work i've done by checking the <a href="./patchnotes.html" target="_blank" style="display: inline; margin: 0; padding: 0;">patch notes</a>!`;
        } else if (talk == 13) {
            shopkeeper.innerHTML = `if only there was a <b>journal</b> to see the different types of fish caught... hey that's a pretty good idea!! (coming soon)`;
        } else if (talk == 14) {
            shopkeeper.innerHTML = `HEY ${playerData.name}!!!!!!!! hi :P`;
        } else if (talk == 15) {
            shopkeeper.innerHTML = `a <b>leaderboard</b>??`;
        } else if (talk == 16) {
            shopkeeper.innerHTML = `have you caught a <b>rare</b> fish yet?! it might be a little difficult, but it's possible (if you get a little lucky)!`;
        } else if (talk == 17) {
            shopkeeper.innerHTML = `i can't wait for the next <a href="./patchnotes.html" target="_blank" style="display: inline; margin: 0; padding: 0;">update</a>! hopefully i'll have more than <b>19</b> fun dialogue options!`;
        } else if (talk == 18) {
            shopkeeper.innerHTML = `oh did i tell you? my name is <b>ratoko</b> :3`;
        }
    } else {
        let talk;
        while (true) {
            talk = Math.floor(Math.random() * 8);
            if (talk <= 4 && currentTalk <= 4) {
                continue;
            } else if (talk != currentTalk) {
                currentTalk = talk;
                break;
            }
        }
        if (talk <= 4) {
            shopkeeper.textContent = `hit the [space] button or press down (on mobile devices) to cast! when you have a fish on the line, hit the [space] button or press down to reel it in! (you'll see a bar at the bottom of the screen that tells you how close you are to catching it!) :D`;
        } else if (talk == 5) {
            shopkeeper.textContent = `did you know that you can buy bait from me when you're running low? ;)`;
        } else if (talk == 6) {
            shopkeeper.textContent = `good luck!! catch some fish!! ^_^`;
        } else {
            shopkeeper.textContent = `you can sell me your fish and count on the fact that i'll give you the deserved amount! i love fish!! ^_^`;
        }
    }
}

function talkMultipliers() {
    let newS = "";
    for (i=0; i < playerData.upgrades.length; i++) {
        if (playerData.upgrades[i].info) {
            newS += `${playerData.upgrades[i].info} `;
        }
    }
    shopkeeper.textContent = newS;
}

function buyUpgrade(upg) {
    if (upg == "timeMultiplier1" && money >= 120) {
        money -= 120;
        timeM += 0.5; // 6000->     9000 (+3000)
        playerData.upgrades[0].multiplier = timeM;
        timeBS += 6000; // 8000->   14000 (+6000)
        playerData.upgrades[0].bonus = timeBS;
        playerData.upgrades[0].level = 1;
        shopkeeper.textContent = `nice upgrade :) you will now have a base catch time of 14 seconds and an increased chance for greater time!`;
        document.getElementById("timeMultiplier1").remove();
        playerData.upgrades[0].info = `you have base catch time of 14s, and an increased chance for greater time!`;
        if (shopLvl > 2) {  
            createShopItem("buyUpgrade('timeMultiplier2')", "timeMultiplier2", "more time to catch (ii) [fb$1200]");
        }
    } else if (upg == "achievementMultiplier1" && money >= 120) {
        money -= 120;
        achievementM = 2; // 50% chance to double achievement
        playerData.upgrades[2].multiplier = achievementM;
        playerData.upgrades[2].level = 1;
        shopkeeper.textContent = `nice upgrade :) you will now have a 50% chance to double your reel speed!`;
        document.getElementById("achievementMultiplier1").remove();
        playerData.upgrades[2].info = `you have a 50% chance to double your reel speed!`;
        if (shopLvl > 2) {  
            createShopItem("buyUpgrade('achievementMultiplier2')", "achievementMultiplier2", "catch speed multiplier (ii) [fb$1200]");
        }
    } else if (upg == "runAwayChance1" && money >= 120) {
        money -= 120;
        runCA += 500; // 0->    500 (+500)
        playerData.upgrades[4]["CA"] = runCA;
        runCM += 100; // 0->    100 (+100)
        playerData.upgrades[4]["CM"] = runCM;
        playerData.upgrades[4].level = 1;
        shopkeeper.textContent = `nice upgrade :) you will now have at least 0.5 seconds more before the fish tries to run away again! also, the fish will run away for a little bit less time!`;
        document.getElementById("runAwayChance1").remove();
        playerData.upgrades[4].info = `you have at least 0.5 seconds more before the fish tries to run away again! also, fish will run away for a little bit less time!`;
        if (shopLvl > 2) {  
            createShopItem("buyUpgrade('runAwayChance2')", "runAwayChance2", "decrease run away chance (ii) [fb$1200]");
        }
    } else if (upg == "moneyMultiplier1" && money >= 200) {
        money -= 200;
        moneyM += 0.25; // 1x-> 1.25x (+0.25)
        playerData.upgrades[1].multiplier = moneyM;
        playerData.upgrades[1].level = 1;
        shopkeeper.textContent = `nice upgrade :) i'll now give you 1.25x more fishbuck$! call me generous, i know!`;
        document.getElementById("moneyMultiplier1").remove();
        playerData.upgrades[1].info = `i'll give you 1.25x more fishbuck$ than usual!`;
        if (shopLvl > 2) {  
            createShopItem("buyUpgrade('moneyMultiplier2')", "moneyMultiplier2", "money multiplier (ii) [fb$1800]");
        }
    }
    else {
        poorBoy();
    }
}

function buyShopUpgrade() {
    if (money >= upgradeCost) {
        // money -= upgradeCost;
        if (shopLvl == 1) {
            money -= upgradeCost;
            shopLvl += 1;
            upgradeCost = 500;
            bait += 5;
            upgradeShop.textContent = `upgrade shop (lvl. 2 -> lvl. 3) [fb$${upgradeCost}]`;
            shopkeeper.textContent = `:O !!! (WOW!) HOLY COW YOU UPGRADED MY SHOP!!! i might kiss you on the mouth broski :D because i love you so much, here's 5 bait, on the house ;) i also added some new stuff to buy, just for you :3 also, if you buy an upgrade or two, don't be afraid to talk to me about them!`;

            // create elements
            let newE = document.createElement("p");
            newE.textContent = "upgrades:";
            shopItems.appendChild(newE);
            // create multiplier talk button
            let newE2 = document.createElement("a");
            newE2.setAttribute("onclick", "talkMultipliers()");
            newE2.textContent = `talk about multipliers`;
            document.getElementById("talkOpts").appendChild(newE2);

            // time multiplier
            createShopItem("buyUpgrade('timeMultiplier1')", "timeMultiplier1", "more time to catch (i) [fb$120]");
            // achievement multiplier
            createShopItem("buyUpgrade('achievementMultiplier1')", "achievementMultiplier1", "catch speed multiplier (i) [fb$120]");
            // run away chance
            createShopItem("buyUpgrade('runAwayChance1')", "runAwayChance1", "decrease run away chance (i) [fb$120]");
            // money multiplier
            createShopItem("buyUpgrade('moneyMultiplier1')", "moneyMultiplier1", "money multiplier (i) [fb$200]");
        } else if (shopLvl == 2) {
            shopkeeper.textContent = `hmmmm... looks like my shipment won't be arriving here in time :( thank you, but try upgrading my shop later :3`;
        }
    } else {
        poorBoy(upgradeCost);
    }
}

function buildShop() {
    // create elements
    let newE = document.createElement("p");
    newE.textContent = "upgrades:";
    shopItems.appendChild(newE);
    // create multiplier talk button
    let newE2 = document.createElement("a");
    newE2.setAttribute("onclick", "talkMultipliers()");
    newE2.textContent = `talk about multipliers`;
    document.getElementById("talkOpts").appendChild(newE2);

    // time, money, speed, bait, runAway, bonus, casino

    // time multiplier
    if (playerData.upgrades[0].level == 0) {
        createShopItem("buyUpgrade('timeMultiplier1')", "timeMultiplier1", "more time to catch (i) [fb$120]");
    }

    // money multiplier
    if (playerData.upgrades[1].level == 0) {
        createShopItem("buyUpgrade('moneyMultiplier1')", "moneyMultiplier1", "money multiplier (i) [fb$200]");
    }
    
    // achievement multiplier
    if (playerData.upgrades[2].level == 0) {
        createShopItem("buyUpgrade('achievementMultiplier1')", "achievementMultiplier1", "catch speed multiplier (i) [fb$120]");
    }

    // bait usage
    
    // run away chance
    if (playerData.upgrades[4].level == 0) {
        createShopItem("buyUpgrade('runAwayChance1')", "runAwayChance1", "decrease run away chance (i) [fb$120]");
    }

    // bonus upgrades

    // casino upgrades
}

function poorBoy(cost) {
    shopkeeper.textContent = `:( sorry little buddy but you don't have enough fishbuck$`;
    if (cost != null) {
        shopkeeper.textContent += `you need ${cost-money} more fishbuck$!`;
    }
}

function saveGame(blerp) {
    playerData = {
        "name": playerData.name,
        "firstFish": firstFish,
        "currentTalk": currentTalk,
        "shop": {
            "level": shopLvl,
            "upgradeCost": upgradeCost,
            "brodyConvo": brodyConvo,
            "brodyCaught": brodyCaught
        },
        "upgrades": playerData.upgrades,
        "bag": bag,
        "money": money,
        "bait": bait,
        "score": score,
        "lastFish": lastFish,
        "tutorial": tutorial
    };
    localStorage.setItem("player", JSON.stringify(playerData));
    if (blerp != null) {
        shopkeeper.textContent = `i saved your progress! ^_^`;
    } else {
        shopkeeper.textContent += ` i saved your progress! ^_^`;
    }
    console.log("saved game");
}

function deleteGame() { // in command: deleteGame();
    localStorage.removeItem("player");
    console.log("deleted player data");
}

function tutorialPress() {
    if (tutorialNum == 0) {
        shopkeeper.textContent = `before we get started, what's your name?`;
        document.getElementById("nameMake").style.display = "block";
        tutorialNum += 1;
    } else if (tutorialNum == 2) {
        shopkeeper.textContent = `ascii fish is all about fishin'! press [space] or press down in the fishing pole area to cast! when you get a fish on the line, at the bottom of the screen you'll see your directive, time to catch, and progress bar! if your directive tells you to reel in, press [space] or press down to reel it in! on the other hand if it tells you that the fish is trying to get away, if you hold down, you'll lose progress! pretty easy right!? try casting and catching a fish now! *oh by the way, your game will save every 30 seconds!`;
        allowFish = true;
        t = setInterval(updateFrame, 10);
    }
}

function tutorialName() {
    if (tutorialNum == 1) {
        const nameSafe = /^[a-z ,.'-]+$/i;
        let testName = document.getElementById("userInput").value;
        if (nameSafe.test(testName)) {
            playerData.name = testName;
            if (testName == "zach" || testName == "ratoko") {
                shopkeeper.textContent = `nice name ${playerData.name} :3 hey, because your name is so cool, here's some extra money, on the house :)`;
                money += 1000;
            } else {
                shopkeeper.textContent = `nice to meet you ${playerData.name}!! :D`;
            }
            shopkeeper.textContent += ` alright, now that we got that out of the way, let's learn how to fish!!`;
            
            document.getElementById("nameMake").style.display = "none";
            tutorialNum += 1;
        } else {
            shopkeeper.textContent = `sorry, but that name isn't allowed :/ please only use name-safe characters!`;
        }
    }
}

// window.onload = function() {

window.onload = function() {
    scoreE.textContent = `score: ${score}`;
    moneyE.textContent = `fishbuck$: ${money}`;
    baitE.textContent = `bait: ${bait}`;
    if (playerData.bag.length > 0) {
        bagE.textContent = `bag: ${bag.join(", ")}`;
    } else {
        bagE.textContent = `bag: empty`;
    }
    // check for available upgrades
    fishShop.textContent = `fish shop (lvl. 1) →`;
    upgradeShop.textContent = `upgrade shop (lvl. 1 -> lvl. 2) [fb$50]`;
    //
    if (playerData.firstFish) { // ask for name, tutorial here
        allowFish = false;
        theShop.style.display = "none";
        shopItems.style.display = "none";
        saveGameE.style.display = "none";
        talkE.style.display = "none";
        shopkeeper.textContent = `welcome to ascii fish! :D i'm the shopkeeper here! press [space] or press down in the fishing pole area!`;
    } else {
        allowFish = true;
        shopkeeper.textContent = `welcome back to ascii fish!! start fishin' ${playerData.name} :3`;
        if (shopLvl > 1) {
            upgradeShop.textContent = `upgrade shop (lvl. ${shopLvl} -> lvl. ${shopLvl+1}) [fb$${upgradeCost}]`;
            buildShop();
        }
        if (Date.now() > 86400000 + lastFish) {
            let randFF = Math.floor(Math.random() * 3) + 1;
            let sayFF = [];
            for (i=0; i < randFF; i++) {
                let randY = Math.floor(Math.random() * 5);
                if (randY == 4) {
                    potClass = "uncommon";
                } else if (randY > 0) {
                    potClass = "common";
                } else {
                    potClass = "trash";
                }

                let keys = Object.keys(fish[potClass]);
                potFish = keys[Math.floor(Math.random() * keys.length)];
                bag.push(potFish);
                sayFF.push(potFish);
            }
            if (randFF > 1) {
                shopkeeper.textContent += ` i caught a fish (${sayFF[0]}) for you while you were away <3`;
            } else {
                shopkeeper.textContent += ` i caught some fish (${sayFF.join(", ")}) for you while you were away <3`;
            }
        }
        t = setInterval(updateFrame, 10);
        s = setInterval(saveGame, 30000);
    }
}