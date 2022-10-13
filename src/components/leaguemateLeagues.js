

const LeaguemateLeagues = (props) => {

    return <>
        <table className="secondary">
            <tr>
                <th rowSpan={4}>League</th>
                <th colSpan={2}>Leaguemate</th>
                <th colSpan={2}>User</th>
            </tr>
            <tr>
                <th>Record</th>
                <th>Wpct</th>
                <th>Record</th>
                <th>Wpct</th>
            </tr>
        </table>
    </>
}

export default LeaguemateLeagues