

const LeaguemateLeagues = (props) => {

    return <>
        <table className="secondary">
            <tbody>
                <tr className="secondary_header_double">
                    <th rowSpan={4}>League</th>
                    <th colSpan={2}>Leaguemate</th>
                    <th colSpan={2}>User</th>
                </tr>
                <tr className="secondary_header_double">
                    <th>Record</th>
                    <th>Wpct</th>
                    <th>Record</th>
                    <th>Wpct</th>
                </tr>
            </tbody>
        </table>
    </>
}

export default LeaguemateLeagues