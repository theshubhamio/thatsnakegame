function DirectionControl({ snakeDirection, setSnakeDirection }) {
    const directions = ["UP", "LEFT", "DOWN", "RIGHT"];

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

export default DirectionControl;