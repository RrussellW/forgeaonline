import { motion } from 'framer-motion';
import { useEffect, useState } from "react"

export default function LoadingSquares() {
    const [order, setOrder] = useState(initialOrder)

    useEffect(() => {
        const timeout = setTimeout(() => setOrder(shuffle(order)), 400)
        //setTimeout(() => setOrder(initialOrder), 1200)
        setTimeout(() => setOrder(initialOrder), 2401)
        return () => clearTimeout(timeout)
    }, [order])

    return (
        <ul style={container}>
            {order.map((backgroundColor) => (
                <motion.li
                    initial={{
                        borderRadius: '100px',
                        borderWidth: 6,
                        borderColor: backgroundColor,
                        borderStyle: "solid",
                        backgroundColor: "transparent",
                    }}
                    animate={{
                        borderRadius: '10px', 
                        transition:{duration:1.6, delay: 0.2},
                        backgroundColor: backgroundColor,
                    }}
                    key={backgroundColor}
                    layout
                    transition={spring}
                    style={{ ...item, backgroundColor }}
                />
            ))}
        </ul>
    )
}

const initialOrder = ['#F8F1AD', '#EDACA3', '#E199C8', '#B78FD6']

/**
 * ==============   Utils   ================
 */
function shuffle([...array]) {
    return array.sort(() => Math.random() - 0.5)
}

/**
 * ==============   Styles   ================
 */

const spring = {
    type: "spring",
    damping: 20,
    stiffness: 300,
}

const container = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    gap: 30,
    width: 300,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
}

const item = {
    width: 50,
    height: 50,
    borderRadius: "10px",
}