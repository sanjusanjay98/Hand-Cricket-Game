var OE = -1;
var inp;
var callback;
var userBats = -1;
var userScore = 0,
    cpuScore = 0;
var superOverUserScore = 0,
    superOverCpuScore = 0;
var superOverBall = 1;
var isUserBattingSuperOver = true;
var playerName = "";
var botName = "";

function generateBotName() {
    const prefix = "Bot";
    const randomNum = Math.floor(Math.random() * 1000);
    return `${prefix}${randomNum}`;
}

function S(id) {
    return document.getElementById(id);
}

function updateAllBotNames() {
    const botNameElements = [
        "bot_name_display",
        "bot_name_score",
        "bot_name_choice",
        "bot_name_super"
    ];
    botNameElements.forEach(id => {
        if (S(id)) S(id).innerHTML = botName;
    });
}

function updateAllPlayerNames() {
    const playerNameElements = [
        "player_name_display",
        "player_name_score",
        "player_name_choice",
        "player_name_super",
        "player_name_toss"
    ];
    playerNameElements.forEach(id => {
        if (S(id)) S(id).innerHTML = playerName;
    });
}

function submitPlayerName() {
    playerName = S("player_name").value.trim();
    if (playerName === "") {
        alert("Please enter your name to start the game!");
        return;
    }
    
    // Generate bot name at the start of each game
    botName = generateBotName();
    S("bot_name").innerHTML = botName;
    
    // Update all name displays
    updateAllPlayerNames();
    updateAllBotNames();
    
    // Hide name input and show toss section
    S("player_name_section").style.display = "none";
    S("toss_section").style.display = "block";
}

function set_OE(i) {
    OE = i;
    console.log(`${playerName} chose ${i ? "Even" : "Odd"}`);
    S("OddEven").style.display = "none";
    get_inp("do_toss");
}

function get_inp(_callback) {
    S("inp").style.display = "block";
    callback = _callback;
}

function set_inp(i) {
    inp = i;
    console.log(`${playerName} chose ${i}`);
    S("inp").style.display = "none";
    window[callback](i);
}

function get_cpu_inp() {
    var c = Math.floor(Math.random() * 6 + 1);
    console.log(`${botName} chose: ${c}`);
    return c;
}

function set_userBats(i) {
    userBats = i;
    console.log(`${playerName} chose to ${userBats ? "Bat" : "Bowl"} first`);
    S("ask_user_bat").style.display = "none";
    if (userBats) userBat();
    else cpuBat();
    S("score_board").style.display = "block";
    S("choice_board").style.display = "block";
}

function do_toss(i) {
    var userToss = i;
    var cpuToss = get_cpu_inp();
    var toss = userToss + cpuToss;
    if ((toss % 2 == 0 && OE) || (toss % 2 && !OE)) {
        askUserBat();
    } else {
        userBats = 0;
        console.log(`${playerName} has to Bowl first`);
        S("score_board").style.display = "block";
        S("choice_board").style.display = "block";
        alert(`${playerName}, you lost the toss. You have to bowl first`);
        cpuBat();
    }
}

function addUserScore(i) {
    var cpu_inp = get_cpu_inp();
    S("user_choice").innerHTML = i;
    S("cpu_choice").innerHTML = cpu_inp;
    if (cpu_inp == i) {
        alert(`${playerName}, you have been dismissed for ${userScore} runs`);
        if (userBats == 1) {
            cpuBat();
        } else {
            if (userScore > cpuScore) {
                alert(`Congratulations ${playerName}! You won the match and beat ${botName} by ${userScore - cpuScore} runs.`);
                S("restart_section").style.display = "block";
            } else if (userScore == cpuScore) {
                startSuperOver();
            } else {
                alert(`${playerName}, you lost the match. ${botName} beat you by ${cpuScore - userScore} runs.`);
                S("restart_section").style.display = "block";
            }
        }
    } else {
        userScore += i;
        S("user_score").innerHTML = userScore;
        if (userBats == 0 && userScore >= cpuScore) {
            alert(`Congratulations ${playerName}! You won the match by ${10 - Math.floor(userScore / 10)} wickets.`);
            S("restart_section").style.display = "block";
        } else {
            get_inp("addUserScore");
        }
    }
}

function addCpuScore(i) {
    var cpu_inp = get_cpu_inp();
    S("user_choice").innerHTML = i;
    S("cpu_choice").innerHTML = cpu_inp;
    if (cpu_inp == i) {
        alert(`${botName} has been dismissed for ${cpuScore} runs`);
        if (userBats == 0) {
            userBat();
        } else {
            if (userScore >= cpuScore) {
                alert(`Congratulations ${playerName}! You won the match by ${userScore - cpuScore} runs.`);
                S("restart_section").style.display = "block";
            } else {
                alert(`${playerName}, you lost the match. ${botName} beat you by ${cpuScore - userScore} runs.`);
                S("restart_section").style.display = "block";
            }
        }
    } else {
        cpuScore += cpu_inp;
        S("cpu_score").innerHTML = cpuScore;
        if (userBats == 1 && userScore < cpuScore) {
            alert(`${playerName}, you lost the match. ${botName} beat you by ${10 - Math.floor(cpuScore / 10)} wickets.`);
            S("restart_section").style.display = "block";
        } else {
            get_inp("addCpuScore");
        }
    }
}

function startSuperOver() {
    alert(`${playerName}, the match is tied. Super Over begins!`);
    S("super_over_section").style.display = "block";
    S("score_board").style.display = "none";
    S("choice_board").style.display = "none";
    isUserBattingSuperOver = true;
    S("super_over_user_input").style.display = "block";
}

function playSuperOverUser(run) {
    var cpu_inp = get_cpu_inp();
    S("super_over_user_choice").innerHTML = run;
    S("super_over_cpu_choice").innerHTML = cpu_inp;
    if (cpu_inp === run) {
        alert(`${playerName}, you are out in the Super Over!`);
        superOverBall = 7;
        playSuperOverCpu();
    } else {
        superOverUserScore += run;
        S("super_over_user_score").innerHTML = superOverUserScore;
        superOverBall++;
        if (superOverBall <= 6) return;
        playSuperOverCpu();
    }
}

function playSuperOverCpu() {
    isUserBattingSuperOver = false;
    alert(`${botName} is now batting!`);
    S("super_over_user_input").style.display = "none";
    superOverBall = 1;
    cpuSuperOverPlay();
}

function cpuSuperOverPlay() {
    if (superOverBall > 6 || superOverCpuScore > superOverUserScore) {
        declareSuperOverResult();
        return;
    }
    var cpu_inp = get_cpu_inp();
    var userInp = parseInt(prompt(`Ball ${superOverBall}: Guess ${botName}'s run (1-6)`));
    if (isNaN(userInp) || userInp < 1 || userInp > 6) {
        alert("Invalid input! Enter a number between 1 and 6.");
        return cpuSuperOverPlay();
    }
    S("super_over_user_choice").innerHTML = userInp;
    S("super_over_cpu_choice").innerHTML = cpu_inp;
    if (userInp === cpu_inp) {
        alert(`${botName} is out in the Super Over!`);
        declareSuperOverResult();
    } else {
        superOverCpuScore += cpu_inp;
        S("super_over_cpu_score").innerHTML = superOverCpuScore;
        superOverBall++;
        cpuSuperOverPlay();
    }
}

function declareSuperOverResult() {
    if (superOverUserScore > superOverCpuScore) {
        alert(`Congratulations ${playerName}! You won the Super Over by ${superOverUserScore - superOverCpuScore} runs.`);
    } else if (superOverUserScore < superOverCpuScore) {
        alert(`${playerName}, you lost the Super Over. ${botName} beat you by ${superOverCpuScore - superOverUserScore} runs.`);
    } else {
        alert(`${playerName}, the Super Over is tied! Match ends in a draw.`);
    }
    S("restart_section").style.display = "block";
}

function restartMatch() {
    // Reset all variables
    userScore = 0;
    cpuScore = 0;
    superOverUserScore = 0;
    superOverCpuScore = 0;
    superOverBall = 1;
    isUserBattingSuperOver = true;
    userBats = -1;
    OE = -1;
    
    // Generate new bot name for the new game
    botName = generateBotName();
    
    // Reset UI elements
    S("user_score").innerHTML = "0";
    S("cpu_score").innerHTML = "0";
    S("super_over_user_score").innerHTML = "0";
    S("super_over_cpu_score").innerHTML = "0";
    S("user_choice").innerHTML = "-";
    S("cpu_choice").innerHTML = "-";
    S("bot_name").innerHTML = botName;
    
    // Clear player name input
    S("player_name").value = "";
    
    // Update all bot name displays
    updateAllBotNames();
    
    // Show and hide appropriate sections
    S("player_name_section").style.display = "block";
    S("toss_section").style.display = "none";
    S("super_over_section").style.display = "none";
    S("score_board").style.display = "none";
    S("choice_board").style.display = "none";
    S("restart_section").style.display = "none";
    S("ask_user_bat").style.display = "none";
    S("inp").style.display = "none";
}

// Utility functions for game statistics
function getGameStats() {
    return {
        playerName: playerName,
        botName: botName,
        userScore: userScore,
        cpuScore: cpuScore,
        isSuperOver: superOverBall > 1,
        superOverStats: {
            userScore: superOverUserScore,
            cpuScore: superOverCpuScore,
            currentBall: superOverBall
        }
    };
}

// Add event listeners when the page loads
window.onload = function() {
    // Initialize the game with a bot name
    botName = generateBotName();
    S("bot_name").innerHTML = botName;
    
    // Add enter key support for player name input
    S("player_name").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            submitPlayerName();
        }
    });
    
    // Add keyboard support for number inputs (1-6)
    document.addEventListener("keypress", function(event) {
        if (S("inp").style.display !== "none") {
            const num = parseInt(event.key);
            if (num >= 1 && num <= 6) {
                set_inp(num);
            }
        }
    });
};

// Helper function to format runs text
function formatRunsText(runs) {
    return runs === 1 ? "1 run" : `${runs} runs`;
}

// Enhanced batting functions
function userBat() {
    console.log(`${playerName}'s batting turn`);
    get_inp("addUserScore");
}

function cpuBat() {
    console.log(`${botName}'s batting turn`);
    get_inp("addCpuScore");
}

// Enhanced toss functions
function askUserBat() {
    S("ask_user_bat").style.display = "block";
    console.log(`${playerName} won the toss`);
}

// Function to validate user input
function validateUserInput(input, min, max) {
    const num = parseInt(input);
    return !isNaN(num) && num >= min && num <= max;
}

// Function to show game progress
function showGameProgress() {
    const stats = getGameStats();
    console.log(`
        Current Score:
        ${stats.playerName}: ${stats.userScore}
        ${stats.botName}: ${stats.cpuScore}
        ${stats.isSuperOver ? `
        Super Over:
        Ball: ${stats.superOverStats.currentBall}
        ${stats.playerName}: ${stats.superOverStats.userScore}
        ${stats.botName}: ${stats.superOverStats.cpuScore}
        ` : ''}
    `);
}

// Function to handle invalid inputs
function handleInvalidInput(message) {
    alert(message);
    return false;
}

// Enhanced input validation for super over
function validateSuperOverInput(input) {
    if (!validateUserInput(input, 1, 6)) {
        return handleInvalidInput("Please enter a number between 1 and 6");
    }
    return true;
}

// Function to show match result
function showMatchResult(winner, margin, type) {
    let message = winner === playerName ? 
        `Congratulations ${playerName}! ` :
        `${playerName}, `;
    
    message += `${winner} ${winner === playerName ? 'won' : 'wins'} `;
    
    if (type === 'runs') {
        message += `by ${formatRunsText(margin)}`;
    } else if (type === 'wickets') {
        message += `by ${margin} ${margin === 1 ? 'wicket' : 'wickets'}`;
    }
    
    alert(message);
    showGameProgress();
}

// Function to handle game completion
function handleGameCompletion(winner, margin, type) {
    showMatchResult(winner, margin, type);
    S("restart_section").style.display = "block";
}