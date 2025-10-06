const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine to render HTML
app.set('view engine', 'ejs');

// Helper function to validate if input is a number
function isValidNumber(input) {
    return !isNaN(input) && input.trim() !== '' && isFinite(input);
}

// Helper function to perform calculations
function calculate(num1, num2, operation) {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    
    switch(operation) {
        case 'add':
            return n1 + n2;
        case 'subtract':
            return n1 - n2;
        case 'multiply':
            return n1 * n2;
        case 'divide':
            if (n2 === 0) {
                throw new Error("Oops! We can't divide by zero. Try a different number!");
            }
            return n1 / n2;
        default:
            throw new Error("Unknown operation");
    }
}

// Route to serve the calculator form
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kids Calculator</title>
        <style>
            body {
                font-family: 'Comic Sans MS', cursive, sans-serif;
                background: linear-gradient(135deg, #1b3ccfff 0%, #c1acd661 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .calculator {
                background: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            
            h1 {
                color: #4a5568;
                margin-bottom: 30px;
                font-size: 2.5em;
            }
            
            .input-group {
                margin: 20px 0;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                color: #2d3748;
                font-size: 1.2em;
                font-weight: bold;
            }
            
            input[type="number"] {
                width: 100%;
                padding: 12px;
                font-size: 1.1em;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                box-sizing: border-box;
                font-family: inherit;
            }
            
            input[type="number"]:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .operation-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 25px 0;
            }
            
            button {
                padding: 15px 20px;
                font-size: 1.2em;
                font-weight: bold;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-family: inherit;
                transition: all 0.2s;
            }
            
            .add-btn { background: #3575ceff; color: white; }
            .subtract-btn { background: #3575ceff; color: white; }
            .multiply-btn { background: #3575ceff; color: white; }
            .divide-btn { background: #3575ceff; color: white; }
            
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            button:active {
                transform: translateY(0);
            }
            
            .emoji {
                font-size: 1.5em;
                margin-right: 8px;
            }
            
            @media (max-width: 480px) {
                .operation-buttons {
                    grid-template-columns: 1fr;
                }
                
                h1 {
                    font-size: 2em;
                }
            }
        </style>
    </head>
    <body>
        <div class="calculator">
            <h1> Kids Calculator</h1>
            <form method="POST" action="/calculate">
                <div class="input-group">
                    <label for="number1">First Number:</label>
                    <input type="number" step="any" name="number1" id="number1" required 
                           placeholder="Enter your first number...">
                </div>
                
                <div class="input-group">
                    <label for="number2">Second Number:</label>
                    <input type="number" step="any" name="number2" id="number2" required 
                           placeholder="Enter your second number...">
                </div>
                
                <div class="operation-buttons">
                    <button type="submit" name="operation" value="add" class="add-btn">
                        Add
                    </button>
                    <button type="submit" name="operation" value="subtract" class="subtract-btn">
                        Subtract
                    </button>
                    <button type="submit" name="operation" value="multiply" class="multiply-btn">
                        Multiply
                    </button>
                    <button type="submit" name="operation" value="divide" class="divide-btn">
                        Divide
                    </button>
                </div>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Route to handle calculations
app.post('/calculate', (req, res) => {
    const { number1, number2, operation } = req.body;
    
    try {
        // Validate inputs
        if (!isValidNumber(number1) || !isValidNumber(number2)) {
            throw new Error("Please enter valid numbers only! No letters or special characters allowed.");
        }
        
        // Perform calculation
        const result = calculate(number1, number2, operation);
        
        // Determine operation symbol and name for display
        const operationInfo = {
            add: { symbol: '+', name: 'Addition' },
            subtract: { symbol: '-', name: 'Subtraction' },
            multiply: { symbol: '×', name: 'Multiplication' },
            divide: { symbol: '÷', name: 'Division' }
        };
        
        const opInfo = operationInfo[operation];
        const formattedResult = Number.isInteger(result) ? result : result.toFixed(2);
        
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Calculator Result 🎉</title>
            <style>
                body {
                    font-family: 'Comic Sans MS', cursive, sans-serif;
                    background: linear-gradient(135deg, #1b3ccfff 0%, #b491d761 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .result-container {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                }
                
                h1 {
                    color: #4a5568;
                    margin-bottom: 30px;
                    font-size: 2.2em;
                }
                
                .calculation {
                    background: #f7fafc;
                    padding: 25px;
                    border-radius: 15px;
                    margin: 20px 0;
                    font-size: 1.4em;
                    color: #2d3748;
                    border-left: 5px solid #48bb78;
                }
                
                .result {
                    font-size: 2em;
                    color: #48bb78;
                    font-weight: bold;
                    margin: 20px 0;
                }
                
                .back-button {
                    background: #667eea;
                    color: white;
                    padding: 15px 30px;
                    font-size: 1.2em;
                    font-weight: bold;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    font-family: inherit;
                    transition: all 0.2s;
                    margin-top: 20px;
                }
                
                .back-button:hover {
                    background: #5a67d8;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                .celebration {
                    font-size: 2em;
                    margin: 10px 0;
                    animation: bounce 1s infinite alternate;
                }
                
                @keyframes bounce {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-10px); }
                }
            </style>
        </head>
        <body>
            <div class="result-container">
                
                <h1>Your Answer is Ready!</h1>
                
                <div class="calculation">
                    ${number1} ${opInfo.symbol} ${number2} = 
                    <div class="result">${formattedResult}</div>
                </div>
                
                <p style="color: #718096; font-size: 1.1em;">
                    You just solved a ${opInfo.name.toLowerCase()} problem! 
                </p>
                
                <a href="/" class="back-button">
                     Calculate Again
                </a>
            </div>
        </body>
        </html>
        `);
        
    } catch (error) {
        // Handle errors (invalid inputs, division by zero, etc.)
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Oops! Try Again</title>
            <style>
                body {
                    font-family: 'Comic Sans MS', cursive, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .error-container {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                }
                
                h1 {
                    color: #e53e3e;
                    margin-bottom: 20px;
                    font-size: 2.2em;
                }
                
                .error-message {
                    background: #fed7d7;
                    color: #c53030;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    font-size: 1.2em;
                    border-left: 5px solid #e53e3e;
                }
                
                .back-button {
                    background: #667eea;
                    color: white;
                    padding: 15px 30px;
                    font-size: 1.2em;
                    font-weight: bold;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    font-family: inherit;
                    transition: all 0.2s;
                    margin-top: 20px;
                }
                
                .back-button:hover {
                    background: #5a67d8;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1> Oops!</h1>
                
                <div class="error-message">
                    ${error.message}
                </div>
                
                <p style="color: #718096; font-size: 1.1em;">
                    Don't worry, everyone makes mistakes! Let's try again. 
                </p>
                
                <a href="/" class="back-button">
                    Try Again
                </a>
            </div>
        </body>
        </html>
        `);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Kids Calculator server is running at http://localhost:${port}`);
    console.log('Open your browser and navigate to the URL above to start calculating!');
});

module.exports = app;