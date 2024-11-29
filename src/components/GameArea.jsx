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
    const [grid, setGrid] = useState(initializeGrid());
    const [headIndex, setHeadIndex] = useState(0); // Snake's head starting position
    const [snakeBody, setSnakeBody] = useState([0]); // Initially, snake length is 1
    const [foodIndex, setFoodIndex] = useState(generateRandomIndex()); // Random food position
    const [snakeDirection, setSnakeDirection] = useState("RIGHT"); // Initial direction

    // Generate a random index for food
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
            moveSnake();
        }, 100); // Timer interval in ms

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [snakeBody, snakeDirection, foodIndex]);

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
            alert("Game Over!");
            resetGame();
            return;
        }

        // Update the snake's body
        const newSnakeBody = [newHeadIndex, ...snakeBody];
        if (newHeadIndex === foodIndex) {
            // Snake eats the food
            setFoodIndex(generateRandomIndex());
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
    };

    return (
        <div style={styles.container}>
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
            <DirectionControl
                snakeDirection={snakeDirection}
                setSnakeDirection={setSnakeDirection}
            />
        </div>
    );
}

function DirectionControl({ snakeDirection, setSnakeDirection }) {
    

    const handleClick = (direction) => {
        setSnakeDirection(direction);
    };

    return (
        <div style={styles.controlContainer}>
            <div style={styles.arrowRow}>
                <ArrowButton
                    direction="UP"
                    isActive={snakeDirection === "UP"}
                    onClick={() => handleClick("UP")}
                />
            </div>
            <div style={styles.arrowRow}>
                <ArrowButton
                    direction="LEFT"
                    isActive={snakeDirection === "LEFT"}
                    onClick={() => handleClick("LEFT")}
                />
                <ArrowButton
                    direction="DOWN"
                    isActive={snakeDirection === "DOWN"}
                    onClick={() => handleClick("DOWN")}
                />
                <ArrowButton
                    direction="RIGHT"
                    isActive={snakeDirection === "RIGHT"}
                    onClick={() => handleClick("RIGHT")}
                />
            </div>
        </div>
    );
}

function ArrowButton({ direction, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                ...styles.arrowButton,
                backgroundColor: isActive ? "blue" : "lightgray",
            }}
        >
            {direction}
        </button>
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
        maxWidth: "300px",
        height: "90vw",
        maxHeight: "300px",
        gap: "2px",
    },
    cell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgray",
        aspectRatio: "1",
    },
    controlContainer: {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    arrowRow: {
        display: "flex",
        justifyContent: "center",
        margin: "5px 0",
    },
    arrowButton: {
        width: "50px",
        height: "50px",
        margin: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        border: "0px solid black",
        color: "white",
        borderRadius: "8px",
    },
};

export default GameArea;