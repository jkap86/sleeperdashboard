import { useState, useEffect } from "react"

const LeaguemateLeagues = (props) => {
    const [leagues, setLeagues] = useState([])

    useEffect(() => {
        setLeagues(props.leagues)
    }, [props])

    const display = (
        leagues.map((league, index) =>
            <tr key={`${league.league_id}_${index}`}>
                <td colSpan={2} className="image_secondary">
                    <span className="image">
                        {
                            props.avatar(league.avatar, league.name, 'league')
                        }
                        <strong>
                            {league.name}
                        </strong>
                    </span>
                </td>
                <td>
                    {league.lmroster.settings.wins}-{league.lmroster.settings.losses}
                </td>
                <td>
                    <em>
                        {
                            ((league.lmroster.settings.wins) /
                                (league.lmroster.settings.wins + league.lmroster.settings.losses)).toLocaleString("en-US", {
                                    maximumFractionDigits: 4,
                                    minimumFractionDigits: 4
                                })
                        }
                    </em>
                </td>
                <td>
                    {league.roster.settings.wins}-{league.roster.settings.losses}
                </td>
                <td>
                    <em>
                        {
                            ((league.roster.settings.wins) /
                                (league.roster.settings.wins + league.roster.settings.losses)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                        }
                    </em>
                </td>
            </tr>
        )

    )

    return <>
        <table className="secondary">
            <tbody className="secondary_header">
                <tr>
                    <th rowSpan={4} colSpan={2}>League</th>
                    <th colSpan={2}>{props.leaguemate}</th>
                    <th colSpan={2}>{props.username}</th>
                </tr>
                <tr>
                    <th>Record</th>
                    <th>Wpct</th>
                    <th>Record</th>
                    <th>Wpct</th>
                </tr>
            </tbody>
            <tbody className="secondary_content">
                {display}
            </tbody>
        </table>
    </>
}

export default LeaguemateLeagues