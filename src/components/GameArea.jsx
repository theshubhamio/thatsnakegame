import React, { useState, useEffect } from "react";

function GameArea() {
    const GRID_SIZE = 30; // Define the grid size (10x10)
    const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

    // Initialize the grid
    const initializeGrid = () => {
        return Array.from({ length: TOTAL_CELLS }, (_, index) => ({
            index,
            isSnakeBody: false,
            isFood: false
        }));
    };

    // Initialize game state
    const [isGameOver, setIsGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [grid, setGrid] = useState(initializeGrid());
    const [headIndex, setHeadIndex] = useState(0); // Snake's head starting position
    const [snakeBody, setSnakeBody] = useState([0]); // Initially, snake length is 1
    const [foodIndex, setFoodIndex] = useState(generateRandomIndex()); // Random food position
    const [snakeDirection, setSnakeDirection] = useState("RIGHT"); // Initial direction

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    //Generate a random index for food
    function generateRandomIndex() {
        let index;
        do {
            index = Math.floor(Math.random() * TOTAL_CELLS);
        } while (snakeBody.includes(index)); // Ensure food is not placed on the snake
        return index;
    }

    // Update snake's position
    useEffect(() => {

        const timer = setInterval(() => {
            if (isPlaying) {
                moveSnake();
            }
        }, 100); // Timer interval in ms

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [snakeBody, snakeDirection, foodIndex, isPlaying]);

    // Listen to keyboard events to update the snake's direction
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent the default behavior of arrow keys
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
            }
            switch (event.key) {
                case "ArrowUp":
                    if (snakeDirection !== "DOWN") setSnakeDirection("UP");
                    break;
                case "ArrowDown":
                    if (snakeDirection !== "UP") setSnakeDirection("DOWN");
                    break;
                case "ArrowLeft":
                    if (snakeDirection !== "RIGHT") setSnakeDirection("LEFT");
                    break;
                case "ArrowRight":
                    if (snakeDirection !== "LEFT") setSnakeDirection("RIGHT");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [snakeDirection]);

    // Move the snake
    const moveSnake = () => {
        let newHeadIndex = headIndex;

        switch (snakeDirection) {
            case "UP":
                newHeadIndex -= GRID_SIZE;
                if (newHeadIndex < 0) {
                    newHeadIndex += TOTAL_CELLS; // Wrap to the bottom
                }
                break;
            case "DOWN":
                newHeadIndex += GRID_SIZE;
                if (newHeadIndex >= TOTAL_CELLS) {
                    newHeadIndex -= TOTAL_CELLS; // Wrap to the top
                }
                break;
            case "LEFT":
                if (newHeadIndex % GRID_SIZE === 0) {
                    newHeadIndex += GRID_SIZE - 1; // Wrap to the right side of the row
                } else {
                    newHeadIndex -= 1;
                }
                break;
            case "RIGHT":
                if ((newHeadIndex + 1) % GRID_SIZE === 0) {
                    newHeadIndex -= GRID_SIZE - 1; // Wrap to the left side of the row
                } else {
                    newHeadIndex += 1;
                }
                break;
            default:
                break;
        }



        // Check for collisions with the snake's body
        if (snakeBody.includes(newHeadIndex)) {
            setIsGameOver(true);
            return;
        }

        // Update the snake's body
        const newSnakeBody = [newHeadIndex, ...snakeBody];
        if (newHeadIndex === foodIndex) {
            // Snake eats the food
            setFoodIndex(generateRandomIndex());
            setHighScore(highScore + 1);
        } else {
            newSnakeBody.pop(); // Remove the tail if no food is eaten
        }

        setHeadIndex(newHeadIndex);
        setSnakeBody(newSnakeBody);

        // Update the grid
        const updatedGrid = initializeGrid();
        newSnakeBody.forEach((index) => (updatedGrid[index].isSnakeBody = true));
        updatedGrid[foodIndex].isFood = true;
        setGrid(updatedGrid);
    };

    // Reset the game
    const resetGame = () => {
        setHeadIndex(0);
        setSnakeBody([0]);
        setFoodIndex(generateRandomIndex());
        setSnakeDirection("RIGHT");
        setGrid(initializeGrid());
        setIsGameOver(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.highScore}>
                High Score: <strong>{highScore}</strong>
            </div>
            <div
                style={{
                    ...styles.grid,
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                }}
            >
                {grid.map((cell) => (
                    <div
                        key={cell.index}
                        style={{
                            ...styles.cell,
                            backgroundColor: cell.isSnakeBody
                                ? "green"
                                : cell.isFood
                                    ? "red"
                                    : "lightgray"
                        }}
                    />
                ))}
            </div>
            <div style={styles.controlsWrapper}>

                {!isGameOver && <DirectionControl
                    snakeDirection={snakeDirection}
                    setSnakeDirection={setSnakeDirection}
                    isPlaying={isPlaying}
                    togglePlayPause={togglePlayPause}
                />}

                {isGameOver && (
                    <div style={styles.gameOverOverlay} onClick={resetGame}>
                        <h2>🐍 Game Over 🐍</h2>
                        <p>Tap to restart</p>
                    </div>)}

            

            </div>
        </div>
    );
}

function DirectionControl({ snakeDirection, setSnakeDirection, isPlaying, togglePlayPause }) {
    const handleClick = (direction) => {
        setSnakeDirection(direction);
    };

    return (
        <div style={styles.directionControl}>
            <button
                onClick={() => handleClick("LEFT")}
                style={{
                    ...styles.arrowButton,
                    backgroundColor: snakeDirection === "LEFT" ? "blue" : "lightgray",
                }}
            >
                ◀
            </button>

            <div style={styles.horizontalButtons}>
                <button
                    onClick={() => handleClick("UP")}
                    style={{
                        ...styles.arrowButton,
                        backgroundColor: snakeDirection === "UP" ? "blue" : "lightgray",
                    }}
                >
                    ▲
                </button>

                <button
                    onClick={togglePlayPause}
                    style={{
                        ...styles.playPauseButton
                    }}
                >
                    {isPlaying ? "❚❚" : "▶"}
                </button>

                <button
                    onClick={() => handleClick("DOWN")}
                    style={{
                        ...styles.arrowButton,
                        backgroundColor: snakeDirection === "DOWN" ? "blue" : "lightgray",
                    }}
                >
                    ▼
                </button>
            </div>
            <button
                onClick={() => handleClick("RIGHT")}
                style={{
                    ...styles.arrowButton,
                    backgroundColor: snakeDirection === "RIGHT" ? "blue" : "lightgray",
                }}
            >
                ▶
            </button>

        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
    },
    grid: {
        display: "grid",
        aspectRatio: "1",
        width: "90vw",
        maxWidth: "500px",
        height: "90vw",
        maxHeight: "500px",
        gap: "2px",
    },
    cell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgray",
        aspectRatio: "1",
    },
    controlsWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
    },
    directionControl: {
        display: "grid",
        gridTemplateRows: "repeat(3, auto)",
        gridTemplateColumns: "repeat(3, auto)",
        gap: "10px",
        alignItems: "center",
        justifyItems: "center",

    },
    arrowButton: {
        width: "50px",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        border: "0px solid black",
        borderRadius: "50%",
        color: "white"
    },
    playPauseButton: {
        width: "50px",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        border: "0px solid black",
        borderRadius: "8px",
        backgroundColor: "white"

    },
    highScore: {
        fontSize: "16px",
        margin: "10px", // Spacing between high score and grid
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    gameOverOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        zIndex: 10,
        borderRadius: "5px",
    },
};

export default GameArea;