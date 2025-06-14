import { useSelector, useDispatch } from 'react-redux'

const Counter = () => {
    const dispatch = useDispatch()
    const { good, ok, bad } = useSelector(state => state)

    return (
        <div>
            <h2>Give Feedback</h2>
            <button onClick={() => dispatch({ type: 'GOOD' })}>good</button>
            <button onClick={() => dispatch({ type: 'OK' })}>ok</button>
            <button onClick={() => dispatch({ type: 'BAD' })}>bad</button>
            <button onClick={() => dispatch({ type: 'ZERO' })}>reset stats</button>

            <h2>Statistics</h2>
            <div>good: {good}</div>
            <div>ok: {ok}</div>
            <div>bad: {bad}</div>
        </div>
    )
}

export default Counter