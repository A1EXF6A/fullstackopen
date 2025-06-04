import StatisticLine from './StatisticLine'

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad
    const average = total ? (good - bad) / total : 0
    const positive = total ? (good / total) * 100 : 0

    if (total === 0) {
        return <p>No feedback given</p>
    }

    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={total} />
                <StatisticLine text="average" value={average.toFixed(2)} />
                <StatisticLine text="positive" value={positive.toFixed(2) + ' %'} />
            </tbody>
        </table>
    )
}

export default Statistics
