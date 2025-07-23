// Terminal state management
const state = {
    currentPhase: 'boot',
    currentModule: 0,
    userName: 'Jess',
    userLevel: '',
    userFear: '',
    progress: 0,
    commandHistory: [],
    historyIndex: -1,
    soundEnabled: true,
    moduleHistory: [] // Track visited modules for navigation
};

// DOM elements
const terminalContent = document.getElementById('terminal-content');
const inputLine = document.getElementById('input-line');
const terminalInput = document.getElementById('terminal-input');
const cursor = document.getElementById('cursor');

// Sound management
const sounds = {
    keystroke: document.getElementById('keystroke'),
    beep: document.getElementById('beep'),
    startup: document.getElementById('startup')
};

// Mute sounds if they don't exist
Object.keys(sounds).forEach(key => {
    if (!sounds[key]) {
        console.warn(`Sound ${key} not found, creating dummy audio element`);
        sounds[key] = { play: () => Promise.resolve() };
    }
});

// Content modules (dummy text for now)
const modules = {
    intro: {
        title: "INTRO.EXE",
        loadingText: "Loading leadership fundamentals...",
        content: `LEADERSHIP FUNDAMENTALS INITIALIZED
========================================

Welcome to the Leadership Training Protocol.

So you've made it, huh? Finally! One of the most important steps in the corporate universe: leading a team.

You're probably thinking this is a big deal, and you're right—it is! Congrats!

You're probably trying to recall all of those tips you've seen on cringy LinkedIn posts about what "a true leader" is, or maybe you're looking for a book to help you lead correctly.

Don't panic, but also, do get a book. 

Surprisingly, there are a few of them that have some actual practical tips. 

The other 99% of leadership books are just empty things with a basic idea being repeated over and over, most of them could easily be an essay. (Just like this one, I guess.)

Why? Isn't Leadership Supposed to Be Hard?


I mean, yes and no. I'd say it's more of a happy journey than a hard thing to do.

And why is that, you ask?

It's because leadership is mostly common sense.

There, I said it.

People want to try to overcomplicate it with fancy methodologies, steps, wheels, and matrices, when in reality leadership boils down to common sense:
`,
        transition: "Press ENTER to execute HAPPINESS_PROTOCOL.exe"
    },
    happiness: {
        title: "HAPPINESS_PROTOCOL.exe",
        loadingText: "Analyzing team happiness algorithms...",
        content: `HAPPINESS PROTOCOL ACTIVATED
========================================

If you're looking for my credentials to see if it's worth following my advice, look no further. I don't have many other than leading happy teams for almost 10 years.

See how I didn't say "high performing" and instead said "happy"?

It’s because you first need the team to be happy before they are high-performing.

And that's your first tip! See, it's that easy!

Usually a happy team will drive results, almost automatically. So what does this tell you?

You're right—you need to build a strategy for keeping the team happy:

[✓] Respond to their requests and questions candidly and promptly
[✓] Set up a healthy environment for them to flourish; look for opportunities for them to grab onto
[✓] Be honest when a situation isn't good—nobody wants to have things sugar-coated
[✓] Care for their development, deeply. The better they become at their job, the easier it will be for you
[✓] Solve for obstacles they may have even if that may compromise your own tasks

You get the point, right?

All the things you would do for any of your friends, really. Don't do other things you would do to a friend, like, let's say, ignoring them or not caring for them.

See? Common sense.`,
        transition: "HAPPINESS_PROTOCOL complete. Executing STANDARDS_MODULE.exe"
    },
    standards: {
        title: "STANDARDS_MODULE.exe",
        loadingText: "Calibrating expectation parameters...",
        content: `STANDARDS MODULE INITIALIZED
========================================

DIRECTIVE #2: SET CLEAR, HIGH EXPECTATIONS

Ok, my team is happy! What now?

Well, show them the way! Tell them what you expect of them. Don't just sit there and think they can read your mind about what excellent performance looks like. Tell them, but also SHOW them.

Be an example for them to model excellent behavior:

* If you arrive late to meetings, they will catch on to that
* If you talk badly about other teams, they will do so
* If you don't put all your effort into your projects, they will do the same
* If you're not energetic, don't expect them to magically be proactive
* If you don't care about broken processes, then why would they bother?

This is also as key 🔑 as just "telling." 

You need to both set the standard, explain how you will measure that standard (the what, the numbers, the targets), and how you expect them to reach them (the how, the behaviors).

Ok, so until now it should be pretty simple, right?

Happy team + clear expectations = results

So, am I ready to go now?

No, no, no—final piece, I promise:`,
        transition: "Standards configured. Initializing PERFORMANCE_MANAGER.exe"
    },
    performance: {
        title: "PERFORMANCE_MANAGER.exe",
        loadingText: "Compiling advanced management protocols...",
        content: `PERFORMANCE MANAGEMENT SYSTEM ONLINE
========================================

You Need to Do Performance Management

(Yes, we're throwing around fancy words now that you know the basics.)

Ok, but what is performance management?

It's the art of adjusting your strategy as a manager if things aren't going well after having the team happy and setting expectations. How does this look in day-to-day practice?

* Is one person not reaching their goals? Sit down with them and understand if they're unmotivated, lack the skill, or they just didn't understand your expectation
* Is one person overachieving? Good—pay attention to them and provide them with even more tools to make the big jump
* Is the team not working as a team? Sit down with them and have a candid conversation, diagnose and act
* Is one person not bringing the right attitude to the table? If after talking it out things don't change, get rid of that person

You see, performance management is kind of important, because if you do not act on it, all your beautiful team dynamics and foundations will break apart, and we don't want that happening.

So yes, now you're ready to become a leader!

Go make your team happy and set clear expectations for them.

And remember: be patient with results, but impatient with action.`,
        transition: "LEADERSHIP PROTOCOLS COMPLETE. Preparing final assessment..."
    }
};

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playSound(soundName) {
    if (state.soundEnabled && sounds[soundName]) {
        sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
    }
}

// Typing animation
async function typeText(text, speed = 30, className = '') {
    const span = document.createElement('span');
    if (className) span.className = className;
    terminalContent.appendChild(span);
    
    for (let i = 0; i < text.length; i++) {
        span.textContent += text[i];
        if (Math.random() > 0.1) playSound('keystroke');
        scrollToBottom();
        await sleep(speed);
    }
    return span;
}

// Print text instantly
function printText(text, className = '') {
    const div = document.createElement('div');
    if (className) div.className = className;
    div.textContent = text;
    terminalContent.appendChild(div);
    scrollToBottom();
}

// Print with line break
function printLine(text = '', className = '') {
    printText(text + '\n', className);
}

// Scroll to bottom
function scrollToBottom() {
    const terminal = document.querySelector('.terminal-screen');
    terminal.scrollTop = terminal.scrollHeight;
}

// Clear terminal
function clearTerminal() {
    terminalContent.innerHTML = '';
}

// Show input line
function showInput() {
    inputLine.style.display = 'flex';
    terminalInput.focus();
    terminalInput.value = '';
}

// Hide input line
function hideInput() {
    inputLine.style.display = 'none';
}

// Get user input
function getUserInput() {
    return new Promise(resolve => {
        showInput();
        
        const handleInput = (e) => {
            if (e.key === 'Enter') {
                const value = terminalInput.value.trim();
                state.commandHistory.push(value);
                state.historyIndex = state.commandHistory.length;
                
                printLine(`> ${value}`, 'user-input');
                hideInput();
                terminalInput.removeEventListener('keydown', handleInput);
                terminalInput.removeEventListener('keydown', handleHistory);
                resolve(value);
            }
        };
        
        const handleHistory = (e) => {
            if (e.key === 'ArrowUp' && state.historyIndex > 0) {
                state.historyIndex--;
                terminalInput.value = state.commandHistory[state.historyIndex];
            } else if (e.key === 'ArrowDown' && state.historyIndex < state.commandHistory.length - 1) {
                state.historyIndex++;
                terminalInput.value = state.commandHistory[state.historyIndex];
            }
        };
        
        terminalInput.addEventListener('keydown', handleInput);
        terminalInput.addEventListener('keydown', handleHistory);
    });
}

// Progress bar
async function showProgressBar(duration = 2000) {
    const progressHtml = `
<div class="progress-bar">
    <div class="progress-fill" id="progress-fill"></div>
    <div class="progress-text" id="progress-text">0%</div>
</div>`;
    
    const div = document.createElement('div');
    div.innerHTML = progressHtml;
    terminalContent.appendChild(div);
    
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    
    for (let i = 0; i <= 100; i += 2) {
        fill.style.width = i + '%';
        text.textContent = i + '%';
        await sleep(duration / 50);
    }
    
    await sleep(500);
}

// ASCII art
function showASCII(art) {
    const div = document.createElement('div');
    div.className = 'ascii-art';
    div.textContent = art;
    terminalContent.appendChild(div);
    scrollToBottom();
}

// Boot sequence
async function bootSequence() {
    playSound('startup');
    
    await typeText('INITIALIZING SYSTEM...', 30);
    await sleep(1000);
    printLine();
    
    const bootMessages = [
        { text: 'BIOS Version 2.1.0', delay: 300 },
        { text: 'Memory Test: 640K OK', delay: 800 },
        { text: 'CPU: Intel 486DX2-66', delay: 200 },
        { text: 'Loading DOS...', delay: 1500 },
        { text: '', delay: 100 },
        { text: 'C:\\> cd LEADERSHIP', delay: 400 },
        { text: 'C:\\LEADERSHIP> dir', delay: 600 },
        { text: '', delay: 100 },
        { text: 'Volume in drive C is TRAINING', delay: 200 },
        { text: 'Directory of C:\\JAVIERRIVERO\\TOPSECRET\\LEADERSHIP', delay: 200 },
        { text: '', delay: 100 },
        { text: 'INTRO.EXE        2048  01-01-90  12:00a', delay: 150 },
        { text: 'HAPPINESS.EXE    4096  01-01-90  12:00a', delay: 150 },
        { text: 'STANDARDS.EXE    4096  01-01-90  12:00a', delay: 150 },
        { text: 'PERFORM.EXE      8192  01-01-90  12:00a', delay: 150 },
        { text: '        4 file(s)     18432 bytes', delay: 300 },
        { text: '', delay: 100 },
        { text: 'C:\\JAVIERRIVERO\\TOPSECRET\\LEADERSHIP\> RUN PROTOCOL.BAT', delay: 800 }
    ];
    
    for (const msg of bootMessages) {
        if (msg.text.includes('Memory Test')) {
            // Simulate memory test with dots
            await typeText('Memory Test: ', 30);
            for (let i = 0; i < 3; i++) {
                await sleep(300);
                await typeText('.', 30);
            }
            await typeText(' 640K OK', 30);
            printLine();
        } else if (msg.text.includes('Loading DOS')) {
            // Simulate loading with dots
            await typeText('Loading DOS', 30);
            for (let i = 0; i < 3; i++) {
                await sleep(400);
                await typeText('.', 30);
            }
            printLine();
        } else {
            printLine(msg.text);
        }
        await sleep(msg.delay);
    }
    
    await sleep(1500);
    clearTerminal();
    
    await typeText('LEADERSHIP_TRAINING_PROTOCOL v2.1 LOADED', 50, 'success');
    await sleep(1500);
    printLine();
    printLine();
    
    state.currentPhase = 'auth';
    await authSequence();
}

// Authentication sequence
async function authSequence() {
    showASCII(`
╔══════════════════════════════════════╗
║    SECURE ACCESS TERMINAL v2.1       ║
║    Authorized Personnel Only         ║
╚══════════════════════════════════════╝`);
    
    printLine();
    await typeText('Confirm username: Jess (y/n)');
    printLine();
    
    let authenticated = false;
    while (!authenticated) {
        const response = await getUserInput();
        
        if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
            authenticated = true;
            await typeText('Username confirmed.', 30, 'success');
            await sleep(500);
        } else {
            await typeText('ACCESS DENIED. Nice try, but Jess is the only authorized user.', 30, 'error');
            await sleep(1000);
            await typeText('Try again. Confirm username: Jess (y/n)');
            printLine();
        }
    }
    
    printLine();
    await sleep(500);
    
    // Security questions
    await typeText('SECURITY CLEARANCE REQUIRED', 30, 'warning');
    printLine();
    await sleep(500);
    
    // Question 1
    await typeText('Are you ready to unlock top management secrets? [Y/N]');
    printLine();
    const ready = await getUserInput();
    
    if (ready.toLowerCase() === 'n' || ready.toLowerCase() === 'no') {
        await typeText('Confidence subroutine activated. You ARE ready.', 30, 'success');
    } else {
        await typeText('Excellent. Confidence detected.', 30, 'success');
    }
    
    await sleep(500);
    printLine();
    
    // Question 2
    await typeText('Current leadership experience level? [ROOKIE/INTERMEDIATE/VETERAN]');
    printLine();
    state.userLevel = await getUserInput();
    await typeText(`Level "${state.userLevel.toUpperCase()}" recorded. Training will adapt.`, 30, 'success');
    
    await sleep(500);
    printLine();
    
    // Question 3
    await typeText('Primary leadership fear? [FAILURE/CONFLICT/IMPOSTER_SYNDROME/OTHER]');
    printLine();
    state.userFear = await getUserInput();
    await typeText(`Fear protocol "${state.userFear.toUpperCase()}" noted. Countermeasures loading...`, 30, 'success');
    
    await sleep(1000);
    printLine();
    
    await typeText('AUTHENTICATION COMPLETE', 40, 'success glitch');
    await sleep(500);
    printLine();
    await typeText('Access granted. Welcome, Jess.', 30, 'success');
    
    await sleep(1500);
    clearTerminal();
    
    state.currentPhase = 'content';
    await runModule('intro');
}

// Run content module
async function runModule(moduleName) {
    const module = modules[moduleName];
    
    showASCII(`
┌─────────────────────────────────────┐
│         ${module.title.padEnd(27)}│
└─────────────────────────────────────┘`);
    
    printLine();
    await typeText(module.loadingText, 30, 'loading');
    printLine();
    
    await showProgressBar(1500);
    printLine();
    
    // Display content with slow typing effect for better readability
    const lines = module.content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Type out important lines (headers, key points)
        if (i === 0 || // First line
            line.includes('========') || // Separators
            line.includes('DIRECTIVE') || // Headers
            line.includes('✓') || // Checkmarks
            line.includes('*') || // Bullet points
            line.includes('?') || // Questions
            line.includes('!') || // Exclamations
            line.trim().length > 50) { // Longer lines
            
            // Vary typing speed based on content
            let typeSpeed = 40; // Default speed
            
            if (line.includes('========')) {
                typeSpeed = 20; // Faster for separators
            } else if (line.length > 60) {
                typeSpeed = 35; // Slightly faster for long lines
            } else if (line.includes('DIRECTIVE') || i === 0) {
                typeSpeed = 50; // Slower for headers
            }
            
            await typeText(line, typeSpeed);
            printLine();
            
            // Add pause after important lines
            if (line.includes('DIRECTIVE') || line.includes('?')) {
                await sleep(500);
            } else {
                await sleep(200);
            }
        } else {
            // Print shorter lines instantly but with delay
            printLine(line);
            await sleep(150);
        }
    }
    
    printLine();
    await sleep(1000);
    
    // Update progress only if moving forward
    const moduleOrder = ['intro', 'happiness', 'standards', 'performance'];
    const currentIndex = moduleOrder.indexOf(moduleName);
    const expectedProgress = (currentIndex + 1) * 25;
    
    if (state.progress < expectedProgress) {
        state.progress = expectedProgress;
    }
    
    printLine(`[PROGRESS: ${state.progress}%]`, 'success');
    printLine();
    
    // Add reading confirmation prompt
    await sleep(500);
    await typeText('Press ENTER once you have read the entire system log', 30, 'warning');
    printLine();
    
    if (module.transition) {
        // Wait for user to confirm they've read the content
        let hasRead = false;
        while (!hasRead) {
            const readConfirm = await getUserInput();
            if (readConfirm === '') {
                hasRead = true;
            } else {
                await typeText('Please press ENTER to confirm you have read the system log', 25, 'error');
                printLine();
            }
        }
        
        printLine();
        await sleep(500);
        
        await typeText(module.transition, 30, 'success');
        printLine();
        
        // Add module to history if not already there
        if (!state.moduleHistory.includes(moduleName)) {
            state.moduleHistory.push(moduleName);
        }
        
        const moduleOrder = ['intro', 'happiness', 'standards', 'performance'];
        const currentIndex = moduleOrder.indexOf(moduleName);
        const canGoBack = currentIndex > 0;
        
        await sleep(500);
        printLine(`Type CONTINUE to proceed... ${canGoBack ? '(or BACK for previous module)' : '(or HELP for commands)'}`);
        
        let continueFlow = false;
        let goBack = false;
        
        while (!continueFlow && !goBack) {
            const input = await getUserInput();
            
            if (input === '' || input.toUpperCase() === 'CONTINUE') {
                continueFlow = true;
            } else if (input.toUpperCase() === 'BACK' && canGoBack) {
                goBack = true;
            } else if (input.toUpperCase() === 'BACK' && !canGoBack) {
                printLine('Cannot go back from the first module!', 'error');
                printLine();
            } else if (input.toUpperCase() === 'HELP') {
                printLine('Available commands:', 'warning');
                printLine('  CONTINUE      - Continue to next module');
                if (canGoBack) printLine('  BACK          - Go to previous module');
                printLine('  HELP          - Show this help');
                printLine('  STATUS        - Show your current progress');
                printLine();
            } else if (input.toUpperCase() === 'STATUS') {
                printLine(`Current Module: ${module.title}`, 'success');
                printLine(`Progress: ${state.progress}%`, 'success');
                printLine(`Modules Remaining: ${3 - state.progress / 25}`, 'warning');
                printLine();
            } else {
                printLine('Type CONTINUE to proceed...', 'warning');
            }
        }
        
        clearTerminal();
        
        if (goBack) {
            // Go back to previous module
            await runModule(moduleOrder[currentIndex - 1]);
        } else if (currentIndex < moduleOrder.length - 1) {
            await runModule(moduleOrder[currentIndex + 1]);
        } else {
            await commitmentPrompt();
        }
    }
}

// Commitment prompt
async function commitmentPrompt() {
    clearTerminal();
    
    showASCII(`
╔══════════════════════════════════════╗
║      FINAL PROTOCOL CHECKPOINT       ║
╚══════════════════════════════════════╝`);
    
    printLine();
    await typeText('SYSTEM VERIFICATION REQUIRED', 30, 'warning glitch');
    printLine();
    await sleep(500);
    
    await typeText('Before completing your training, we need to verify your commitment.', 30);
    printLine();
    printLine();
    
    await typeText('Have you read and understood all leadership protocols? [Y/N]', 30);
    printLine();
    
    let confirmed = false;
    while (!confirmed) {
        const response = await getUserInput();
        
        if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
            confirmed = true;
            await typeText('Excellent. One final question...', 30, 'success');
            await sleep(1000);
        } else if (response.toLowerCase() === 'n' || response.toLowerCase() === 'no') {
            await typeText('Please review the modules again. Type BACK to return to the previous module.', 30, 'error');
            printLine();
            const backResponse = await getUserInput();
            if (backResponse.toUpperCase() === 'BACK') {
                clearTerminal();
                await runModule('performance');
                return;
            }
        } else {
            await typeText('Please answer Y or N', 30, 'error');
            printLine();
        }
    }
    
    printLine();
    await typeText('Do you commit to being a good leader who prioritizes team happiness,', 30);
    await typeText('sets clear expectations, and manages performance effectively? [Y/N]', 30);
    printLine();
    
    let committed = false;
    while (!committed) {
        const response = await getUserInput();
        
        if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
            committed = true;
            await typeText('COMMITMENT ACCEPTED', 40, 'success glitch');
            await sleep(1000);
            await showCelebration();
        } else if (response.toLowerCase() === 'n' || response.toLowerCase() === 'no') {
            await typeText('ERROR: COMMITMENT REQUIRED FOR CERTIFICATION', 30, 'error glitch');
            await sleep(500);
            await typeText('...Just kidding. But seriously, why not? Try again!', 30, 'success');
            printLine();
        } else {
            await typeText('Please answer Y or N', 30, 'error');
            printLine();
        }
    }
}

// Celebration screen with retro animation
async function showCelebration() {
    clearTerminal();
    playSound('beep');
    
    // Create celebratory animation
    const celebrationFrames = [
        `
         *  .  *  .  *  .  *
      .  *  .  *  .  *  .  *
         CONGRATULATIONS!
      .  *  .  *  .  *  .  *
         *  .  *  .  *  .  *`,
        `
      .  *  .  *  .  *  .  *  .
         *  .  *  .  *  .  *
         CONGRATULATIONS!
         *  .  *  .  *  .  *
      .  *  .  *  .  *  .  *  .`,
        `
         *  .  *  .  *  .  *
      .  *  .  *  .  *  .  *
         CONGRATULATIONS!
      .  *  .  *  .  *  .  *
         *  .  *  .  *  .  *`
    ];
    
    // Animate celebration
    for (let i = 0; i < 6; i++) {
        clearTerminal();
        showASCII(celebrationFrames[i % celebrationFrames.length]);
        await sleep(300);
    }
    
    clearTerminal();
    
    showASCII(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║        MISSION COMPLETE!              ║
    ║                                       ║
    ║    LEADERSHIP PROTOCOL MASTERED       ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    
         ⭐ ACHIEVEMENT UNLOCKED ⭐
              LEVEL: LEADER
    `);
    
    printLine();
    await typeText('Congratulations, Jess!', 40, 'success glitch');
    printLine();
    await sleep(500);
    
    await typeText("You've successfully completed the Leadership Training Protocol.", 30);
    printLine();
    await typeText("You're now equipped with the tools to lead with confidence.", 30);
    printLine();
    printLine();
    
    await typeText('Your certification has been saved to: C:\\LEADERSHIP\\JESS_CERTIFIED.txt', 25);
    printLine();
    
    await sleep(1000);
    
    // Show final command prompt instead of popup
    printLine();
    printLine('═══════════════════════════════════════════════════════════════', 'success');
    printLine();
    await typeText('Type TERMINATE to close training protocol and return to start.', 30, 'warning');
    printLine();
    
    // Handle terminate command
    handleTerminateCommand();
}

// Handle terminate command
async function handleTerminateCommand() {
    const command = await getUserInput();
    
    if (command.toUpperCase() === 'TERMINATE') {
        await typeText('TERMINATING TRAINING PROTOCOL...', 30, 'error');
        await sleep(1000);
        printLine();
        await typeText('System shutdown in progress...', 25);
        await sleep(800);
        printLine();
        await typeText('Goodbye, Leader.', 40, 'success');
        await sleep(1500);
        
        // Restart the experience
        location.reload();
    } else {
        await typeText(`Command "${command}" not recognized. Type TERMINATE to exit.`, 30, 'error');
        printLine();
        handleTerminateCommand();
    }
}

// Handle end commands
async function handleEndCommands() {
    const command = await getUserInput();
    
    if (command.toUpperCase() === 'RESTART') {
        location.reload();
    } else if (command.toUpperCase() === 'EXIT') {
        await typeText('Shutting down...', 30);
        await sleep(1000);
        document.body.style.display = 'none';
    } else if (command.toUpperCase() === 'HELP') {
        printLine('Available commands:', 'warning');
        printLine('  RESTART - Begin training again');
        printLine('  EXIT    - Close terminal');
        printLine('  HELP    - Show this help');
        printLine('  STATUS  - Show your progress');
        printLine();
        handleEndCommands();
    } else if (command.toUpperCase() === 'STATUS') {
        printLine(`Leadership Level: ${state.userLevel || 'UNKNOWN'}`, 'success');
        printLine(`Primary Fear: ${state.userFear || 'UNKNOWN'}`, 'warning');
        printLine(`Progress: ${state.progress}%`, 'success');
        printLine();
        handleEndCommands();
    } else if (command === '1337' || command.toLowerCase() === 'hack') {
        await typeText('ADMIN MODE ACTIVATED', 30, 'error glitch');
        await sleep(500);
        printLine('Just kidding. Nice try though!', 'success');
        printLine();
        handleEndCommands();
    } else {
        await typeText(`Command "${command}" not recognized.`, 30, 'error');
        printLine();
        handleEndCommands();
    }
}

// Initialize terminal
async function init() {
    // Set up event listeners
    terminalInput.addEventListener('input', () => {
        playSound('keystroke');
    });
    
    // Start boot sequence
    await bootSequence();
}

// Start the experience
window.addEventListener('DOMContentLoaded', init); 